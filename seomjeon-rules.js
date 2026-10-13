// 오늘의 섬전 규칙 (seomjeon.html, characters.html, 테스트에서 함께 사용)
// ※ firestore.rules 의 지갑 규칙과 반드시 같은 계산을 해야 합니다. 한쪽을 바꾸면 다른 쪽도 바꾸세요.

export const START_BALANCE = 10;   // 캐릭터 생성 시 지급
export const ATTEND_REWARD = 10;   // 매일 출석
export const DAILY_SPINS = 5;      // 하루 기본 섬전 횟수
export const EXTRA_SPIN_COST = 50; // 기회 1회 추가 비용

// 결과표: roll(0~99)이 [from, to) 구간에 들면 해당 결과
export const OUTCOMES = [
    { key: 'jackpot', label: '대성공', from: 0, to: 5, score: 2, net: '+10배' },
    { key: 'success', label: '성공', from: 5, to: 35, score: 1, net: '+1배' },
    { key: 'even', label: '변동없음', from: 35, to: 75, score: 0, net: '±0' },
    { key: 'fail', label: '실패', from: 75, to: 95, score: -1, net: '−1배' },
    { key: 'disaster', label: '대실패', from: 95, to: 100, score: -2, net: '−3배' },
];
export const OUTCOME_BY_KEY = Object.fromEntries(OUTCOMES.map(o => [o.key, o]));
export const zeroCounts = () => ({ jackpot: 0, success: 0, even: 0, fail: 0, disaster: 0 });

// 한국 시간 기준 날짜 키 (YYYYMMDD 숫자)
export function kstDayKey(ms = Date.now()) {
    const d = new Date(ms + 9 * 3600 * 1000);
    return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

// 서버가 찍은 시각의 마이크로초로 결과를 정합니다 (Firestore Timestamp 의 nanoseconds 사용)
export function rollFromTimestamp(ts) {
    const nanos = ts?.nanoseconds ?? 0;
    return Math.floor(nanos / 1000) % 100;
}
export function outcomeFromRoll(r) {
    return OUTCOMES.find(o => r >= o.from && r < o.to);
}

// 날짜가 바뀌었으면 일일 항목을 오늘 기준으로 맞춘 값
export function effectiveDaily(w, today = kstDayKey()) {
    const same = w.dayKey === today;
    return {
        attended: same ? !!w.attended : false,
        spinsUsed: same ? (w.spinsUsed || 0) : 0,
        extraSpins: same ? (w.extraSpins || 0) : 0,
        dayScore: same ? (w.dayScore || 0) : 0,
    };
}
export function spinsLeft(w, today = kstDayKey()) {
    const e = effectiveDaily(w, today);
    return DAILY_SPINS + e.extraSpins - e.spinsUsed;
}

export function newWallet(serverTs) {
    return {
        balance: START_BALANCE, totalScore: 0, dayKey: kstDayKey(), attended: false,
        spinsUsed: 0, extraSpins: 0, dayScore: 0, pending: null, counts: zeroCounts(),
        lastOp: 'create', lastOpAt: serverTs, createdAt: serverTs,
    };
}

// 각 동작이 지갑에 쓸 값 (serverTs 는 serverTimestamp())
export function attendUpdate(w, serverTs, today = kstDayKey()) {
    const e = effectiveDaily(w, today);
    if (w.pending) throw new Error('pending');
    if (e.attended) throw new Error('attended');
    return { ...e, dayKey: today, attended: true, balance: w.balance + ATTEND_REWARD, lastOp: 'attend', lastOpAt: serverTs };
}
export function buyUpdate(w, serverTs, today = kstDayKey()) {
    const e = effectiveDaily(w, today);
    if (w.pending) throw new Error('pending');
    if (w.balance < EXTRA_SPIN_COST) throw new Error('balance');
    return { ...e, dayKey: today, extraSpins: e.extraSpins + 1, balance: w.balance - EXTRA_SPIN_COST, lastOp: 'buy', lastOpAt: serverTs };
}
export function spinUpdate(w, bet, serverTs, today = kstDayKey()) {
    const e = effectiveDaily(w, today);
    if (w.pending) throw new Error('pending');
    if (!Number.isInteger(bet) || bet < 1 || bet > w.balance) throw new Error('bet');
    if (DAILY_SPINS + e.extraSpins - e.spinsUsed <= 0) throw new Error('spins');
    return {
        ...e, dayKey: today, spinsUsed: e.spinsUsed + 1, balance: w.balance - bet,
        pending: { bet, at: serverTs, dayKey: today }, lastOp: 'spin', lastOpAt: serverTs,
    };
}
// 정산: 걸은 금액은 섬전 때 이미 빠져 있으므로 순변동이 +10배/+1배/0/−1배/−3배(0에서 멈춤)가 되도록 돌려줍니다.
export function settledBalance(balanceAfterBet, bet, key) {
    switch (key) {
        case 'jackpot': return balanceAfterBet + bet * 11;
        case 'success': return balanceAfterBet + bet * 2;
        case 'even': return balanceAfterBet + bet;
        case 'fail': return balanceAfterBet;
        default: return Math.max(0, balanceAfterBet - bet * 2);
    }
}
export function settleUpdate(w, serverTs) {
    const p = w.pending;
    if (!p) throw new Error('nopending');
    const outcome = outcomeFromRoll(rollFromTimestamp(p.at));
    const counts = { ...zeroCounts(), ...(w.counts || {}) };
    counts[outcome.key] += 1;
    const balance = settledBalance(w.balance, p.bet, outcome.key);
    return {
        outcome, bet: p.bet, delta: balance - (w.balance + p.bet),
        update: {
            pending: null, balance, counts,
            totalScore: (w.totalScore || 0) + outcome.score,
            dayScore: (w.dayScore || 0) + outcome.score,
            lastOp: 'settle', lastOpAt: serverTs,
        },
    };
}
