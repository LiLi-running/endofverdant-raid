// 비밀번호 해시 (SHA-256). 원래 비밀번호는 어디에도 저장하지 않고, 같은 계산으로 만든 해시끼리만 비교합니다.
// ※ 소금(salt) 문자열을 바꾸면 기존 비밀번호가 모두 맞지 않게 되니 바꾸지 마세요.

export async function sha256Hex(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
/** 공유 캐릭터 비밀번호 해시 (캐릭터마다 다른 값이 나오도록 캐릭터 ID를 섞습니다) */
export const charPasswordHash = (charId, password) => sha256Hex(`endofverdant-char:${charId}:${password}`);
/** 레이드 게임별 PC(공유 캐릭터가 아닌 PC) 비밀번호 해시 — 설정 파일로 옮겨도 유지되도록 ID를 섞지 않습니다 */
export const pcPasswordHash = (password) => sha256Hex(`endofverdant-pc:${password}`);

/**
 * 이 브라우저의 예전 평문 등록(duelClaims.password)을 해시로 바꿉니다.
 * 주인 기기에서 실행되면 캐릭터 비밀번호(duelCharSecrets)도 같은 배치에서 해시로 바꿉니다.
 * 이미 다른 기기에서 전환되어 맞출 수 없으면, 평문 등록만 지우고 다시 불러오도록 둡니다.
 * fs: { doc, writeBatch, setDoc, deleteDoc, serverTimestamp }
 */
const migrating = new Set();
export async function migrateLegacyClaims(db, uid, claimDocs, fs) {
    for (const d of claimDocs) {
        const c = d.data();
        if (!('password' in c) || migrating.has(d.id)) continue;
        migrating.add(d.id);
        try {
            const hash = await charPasswordHash(c.charId, c.password);
            const batch = fs.writeBatch(db);
            batch.set(fs.doc(db, 'duelCharSecrets', c.charId), { hash });
            batch.set(fs.doc(db, 'duelClaims', d.id), { uid, charId: c.charId, hash, at: fs.serverTimestamp() });
            await batch.commit();
        } catch (e) {
            // 다른 기기가 먼저 전환했다면 등록만 해시로 바꿔 봅니다 (비밀번호가 같으면 통과)
            try {
                const hash = await charPasswordHash(c.charId, c.password);
                await fs.setDoc(fs.doc(db, 'duelClaims', d.id), { uid, charId: c.charId, hash, at: fs.serverTimestamp() });
            } catch (e2) {
                try { await fs.deleteDoc(fs.doc(db, 'duelClaims', d.id)); } catch (e3) { /* 무시 */ }
            }
        }
    }
}
