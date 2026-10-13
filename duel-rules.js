// 1:1 전투 규칙 (duel.html 과 테스트에서 함께 사용)
// 체력: 기본 5 + 투자 0~5 / 투력: 1~5 / 저력: 1~5 / 투자 합계(체력 투자 + 투력 + 저력): 9~12

export const BASE_HP = 5;
export const STAT_LIMITS = {
    hpInvest: { min: 0, max: 5 },
    power: { min: 1, max: 5 },
    guard: { min: 1, max: 5 },
};
export const TOTAL_MIN = 9;
export const TOTAL_MAX = 12;

export function statTotal(c) {
    return (c.hpInvest || 0) + (c.power || 0) + (c.guard || 0);
}
export function validateStats(c) {
    for (const [k, { min, max }] of Object.entries(STAT_LIMITS)) {
        const v = c[k];
        if (!Number.isInteger(v) || v < min || v > max) return false;
    }
    const t = statTotal(c);
    return t >= TOTAL_MIN && t <= TOTAL_MAX;
}
export function maxHpOf(c) {
    return BASE_HP + (c.hpInvest || 0);
}

// 1~sides 균등 난수 (crypto 사용)
export function rollDie(sides) {
    const cryptoObj = globalThis.crypto;
    const limit = Math.floor(0x100000000 / sides) * sides;
    const buf = new Uint32Array(1);
    let x;
    do { cryptoObj.getRandomValues(buf); x = buf[0]; } while (x >= limit);
    return (x % sides) + 1;
}
export function rollDice(count, sides, roll = rollDie) {
    return Array.from({ length: count }, () => roll(sides));
}

// ---- 조사 ----
const DIGIT_BATCHIM = { '0': true, '1': true, '2': false, '3': true, '4': false, '5': false, '6': true, '7': true, '8': true, '9': false };
function hasBatchim(word) {
    const ch = (word || '').trim().slice(-1);
    if (!ch) return false;
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) return (code - 0xAC00) % 28 !== 0;
    if (ch in DIGIT_BATCHIM) return DIGIT_BATCHIM[ch];
    return false;
}
export function josa(word, withBatchim, withoutBatchim) {
    return hasBatchim(word) ? withBatchim : withoutBatchim;
}
export const tag = (name) => `[${name}]`;
const iga = (name) => `${tag(name)}${josa(name, '이', '가')}`;
const eunneun = (name) => `${tag(name)}${josa(name, '은', '는')}`;

export const otherSlot = (k) => (k === 'p1' ? 'p2' : 'p1');

export function firstChoiceLog(name, action) {
    return action === 'attack'
        ? `${iga(name)} 공격을 선택했습니다.`
        : `${iga(name)} 행동하지 않기로 했습니다.`;
}
export function startLog(firstName) {
    return `전투를 시작합니다.\n\n1라운드 선공은 ${tag(firstName)}입니다.`;
}

/**
 * 한 라운드를 판정합니다.
 * @param duel  현재 전투 문서 (status ACTIVE, phase SECOND)
 * @param secondAction 'attack' | 'defend' | 'none'
 * @param roll  주사위 함수 (테스트용 주입 가능)
 * @returns { hp: {p1, p2}, text, ended, winner, nextFirst, nextRound }
 */
export function resolveRound(duel, secondAction, roll = rollDie) {
    const F = duel.first, S = otherSlot(F);
    const f = duel[F], s = duel[S];
    const fa = duel.firstAction, sa = secondAction;
    const lines = ['결과를 출력합니다.'];
    const hp = { [F]: f.hp, [S]: s.hp };

    const fDice = fa === 'attack' ? rollDice(f.power, 6, roll) : null;
    const sDice = sa === 'attack' ? rollDice(s.power, 6, roll) : null;
    const sDef = (fa === 'attack' && sa === 'defend') ? roll(s.guard) : null;

    if (fDice) lines.push(`${tag(f.name)}의 공격 판정 ${f.power}D6 > ${fDice.join(', ')}`);
    if (sDice) lines.push(`${tag(s.name)}의 공격 판정 ${s.power}D6 > ${sDice.join(', ')}`);
    if (sDef !== null) lines.push(`${tag(s.name)}의 방어 판정 1D${s.guard} > ${sDef}`);

    const hitLine = (name, n) => n > 0 ? `${tag(name)}의 공격 ${n}타 유효.` : `${tag(name)}의 공격은 모두 상쇄되었습니다.`;
    const outcome = [];
    if (fDice && sDef !== null) {
        const hits = fDice.filter(v => v > sDef).length;
        outcome.push(`${iga(s.name)} ${sDef} 이하의 공격을 상쇄합니다.`);
        outcome.push(hitLine(f.name, hits));
        hp[S] = Math.max(0, hp[S] - hits);
    } else if (fDice && sDice) {
        outcome.push('방어 없이 서로 타격합니다.');
        outcome.push(hitLine(f.name, fDice.length));
        outcome.push(hitLine(s.name, sDice.length));
        hp[S] = Math.max(0, hp[S] - fDice.length);
        hp[F] = Math.max(0, hp[F] - sDice.length);
    } else if (fDice) {
        outcome.push(`${eunneun(s.name)} 행동하지 않았습니다.`);
        outcome.push(hitLine(f.name, fDice.length));
        hp[S] = Math.max(0, hp[S] - fDice.length);
    } else if (sDice) {
        outcome.push(`${eunneun(f.name)} 행동하지 않았습니다.`);
        outcome.push(hitLine(s.name, sDice.length));
        hp[F] = Math.max(0, hp[F] - sDice.length);
    } else if (sa === 'defend') {
        outcome.push(`${eunneun(f.name)} 행동하지 않았고, ${eunneun(s.name)} 방어 태세를 취했습니다.`);
        outcome.push('이번 라운드에는 공격이 없었습니다.');
    } else {
        outcome.push('양측 모두 행동하지 않았습니다.');
    }
    if (lines.length > 1) lines.push('');
    lines.push(...outcome, '');
    lines.push(`${tag(f.name)}의 현재 체력 ${hp[F]}.`);
    lines.push(`${tag(s.name)}의 현재 체력 ${hp[S]}.`, '');
    lines.push(`${duel.round}라운드 종료.`, '');

    let ended = false, winner = null;
    if (hp[F] === 0 && hp[S] === 0) {
        ended = true; winner = 'draw';
        lines.push('양측 모두 체력이 0이 되었습니다.', '', '전투 종료. 무승부입니다.');
    } else if (hp[F] === 0 || hp[S] === 0) {
        ended = true;
        const loserKey = hp[F] === 0 ? F : S;
        winner = otherSlot(loserKey);
        lines.push(`${tag(duel[loserKey].name)}의 체력이 0이 되었습니다.`, '', `전투 종료. ${tag(duel[winner].name)}의 승리입니다.`);
    } else {
        lines.push(`${duel.round + 1}라운드 선공은 ${tag(s.name)}입니다.`);
    }
    return { hp, text: lines.join('\n'), ended, winner, nextFirst: S, nextRound: duel.round + 1 };
}
