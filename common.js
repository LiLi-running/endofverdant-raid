// 공용 Firebase 연결과 캐릭터·지갑 도우미 (characters.html, seomjeon.html)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot, query, orderBy, where, setDoc, writeBatch, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { newWallet } from "./seomjeon-rules.js?v=2";
import { maxHpOf } from "./duel-rules.js";
import { charPasswordHash, migrateLegacyClaims } from "./password-hash.js";

export const app = initializeApp(window.FIREBASE_CONFIG);
export const db = getFirestore(app);
const auth = getAuth(app);

/** 익명 로그인 후 uid 를 넘겨 줍니다. */
export function onReady(cb) {
  onAuthStateChanged(auth, (user) => {
    if (!user) { signInAnonymously(auth).catch(e => console.error('익명 로그인 실패', e)); return; }
    cb(user.uid);
  });
}

// ---------- 화면 도우미 ----------
export const $ = (id) => document.getElementById(id);
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const safeUrl = (u) => /^https?:\/\//i.test(u || '') ? u : '';
export const money = (n) => `$${Number(n || 0).toLocaleString('ko-KR')}`;
export function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}
export const openModal = (id) => $(id).classList.add('open');
export const closeModal = (id) => $(id).classList.remove('open');
export function avatarHtml(c, cls = 'avatar') {
  const url = safeUrl(c?.imageUrl);
  return url ? `<img class="${cls}" src="${esc(url)}" alt="" referrerpolicy="no-referrer">`
             : `<div class="${cls}">${esc((c?.name || '?').slice(0, 1))}</div>`;
}
export function statChips(c) {
  return `<span class="chip">체력 ${c.maxHp ?? maxHpOf(c)}</span><span class="chip">투력 ${c.power}</span><span class="chip">저력 ${c.guard}</span>`;
}
export function errMsg(e) {
  if (e?.code === 'permission-denied') return '권한이 없거나 비밀번호가 맞지 않습니다.';
  return '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}

// ---------- 데이터 구독 ----------
// 공유 캐릭터는 처음 1:1 전투용으로 만든 duelCharacters 컬렉션을 그대로 씁니다.
export function watchCharacters(cb) {
  return onSnapshot(query(collection(db, 'duelCharacters'), orderBy('name')), snap => {
    const all = {}; snap.docs.forEach(d => { all[d.id] = { id: d.id, ...d.data() }; }); cb(all);
  }, e => console.error('캐릭터 목록 오류', e));
}
// 다른 기기에서 비밀번호를 바꾸면 이 기기의 등록(해시)은 더 이상 맞지 않습니다.
// 페이지를 열 때 등록을 같은 값으로 한 번 다시 써 보고, 거절되면 '비밀번호 확인 필요'로 표시합니다.
const claimCheck = new Map(); // `${claimId}:${hash}` -> 'checking' | 'ok' | 'stale'
export function watchMyCharIds(uid, cb) {
  let lastDocs = [];
  const emit = () => {
    const ids = new Set(), stale = new Set();
    for (const d of lastDocs) {
      const c = d.data();
      ids.add(c.charId);
      if (claimCheck.get(`${d.id}:${c.hash}`) === 'stale') stale.add(c.charId);
    }
    cb(ids, stale);
  };
  return onSnapshot(query(collection(db, 'duelClaims'), where('uid', '==', uid)), snap => {
    migrateLegacyClaims(db, uid, snap.docs, { doc, writeBatch, setDoc, deleteDoc, serverTimestamp });
    lastDocs = snap.docs;
    for (const d of snap.docs) {
      const c = d.data(), key = `${d.id}:${c.hash}`;
      if (!c.hash || claimCheck.has(key)) continue;
      claimCheck.set(key, 'checking');
      setDoc(doc(db, 'duelClaims', d.id), { uid, charId: c.charId, hash: c.hash, at: c.at ?? serverTimestamp() })
        .then(() => claimCheck.set(key, 'ok'))
        .catch(e => { if (e?.code === 'permission-denied') { claimCheck.set(key, 'stale'); emit(); } else claimCheck.delete(key); });
    }
    emit();
  }, e => console.error('내 캐릭터 오류', e));
}

/** 비밀번호가 바뀐 캐릭터를 이 기기에서 다시 확인합니다. 성공하면 true. */
export function askCharPassword(uid, char) {
  let m = document.getElementById('reclaim-modal');
  if (!m) {
    m = document.createElement('div');
    m.id = 'reclaim-modal'; m.className = 'modal';
    m.innerHTML = `<div class="modal-box">
      <h3 id="reclaim-title">비밀번호 확인</h3>
      <p class="muted" id="reclaim-help"></p>
      <div class="field"><label for="reclaim-password">캐릭터 비밀번호</label><input id="reclaim-password" type="password" autocomplete="current-password"></div>
      <p class="error" id="reclaim-error"></p>
      <div class="actions"><button id="reclaim-cancel" class="btn-ghost">취소</button><button id="reclaim-ok" class="btn-primary">확인</button></div>
    </div>`;
    document.body.appendChild(m);
  }
  $('reclaim-title').textContent = `${char?.name || '캐릭터'} 비밀번호 확인`;
  $('reclaim-help').textContent = '다른 기기에서 비밀번호가 바뀌어 이 기기의 등록이 더 이상 맞지 않습니다. 지금 비밀번호를 입력하면 다시 쓸 수 있습니다.';
  $('reclaim-password').value = ''; $('reclaim-error').textContent = '';
  m.classList.add('open');
  setTimeout(() => $('reclaim-password').focus(), 50);
  return new Promise(res => {
    const done = (v) => { m.classList.remove('open'); res(v); };
    $('reclaim-cancel').onclick = () => done(false);
    const ok = async () => {
      const pw = $('reclaim-password').value;
      if (!pw) { $('reclaim-error').textContent = '비밀번호를 입력하세요.'; return; }
      $('reclaim-ok').disabled = true;
      try { await claimCharacter(uid, char.id, pw); toast('확인했습니다.'); done(true); }
      catch (e) { $('reclaim-error').textContent = e?.code === 'permission-denied' ? '비밀번호가 맞지 않습니다.' : errMsg(e); }
      finally { $('reclaim-ok').disabled = false; }
    };
    $('reclaim-ok').onclick = ok;
    $('reclaim-password').onkeydown = (e) => { if (e.key === 'Enter' && !e.isComposing) ok(); };
  });
}
export function watchWallets(cb) {
  return onSnapshot(collection(db, 'wallets'), snap => {
    const all = {}; snap.docs.forEach(d => { all[d.id] = { id: d.id, ...d.data() }; }); cb(all);
  }, e => console.error('지갑 오류', e));
}

/** 비밀번호로 이 브라우저에 캐릭터를 등록합니다. 틀리면 permission-denied. */
export async function claimCharacter(uid, charId, password) {
  const hash = await charPasswordHash(charId, password);
  return setDoc(doc(db, 'duelClaims', `${uid}_${charId}`), { uid, charId, hash, at: serverTimestamp() });
}

/** 지갑이 없는 내 캐릭터(기능 추가 전에 만든 캐릭터)에 지갑을 만들어 줍니다 (+10달러). */
const creatingWallet = new Set();
export async function ensureWallets(myIds, allChars, wallets) {
  for (const id of myIds) {
    if (!allChars[id] || wallets[id] || creatingWallet.has(id)) continue;
    creatingWallet.add(id);
    try { await setDoc(doc(db, 'wallets', id), newWallet(serverTimestamp())); }
    catch (e) { console.warn('지갑 생성 실패', id, e?.code); }
  }
}
