// 레이드 캐릭터 성장 규칙: 포지션 기본치 + 정수 분배
// 실제로 적용되는 값은 Firestore 의 siteConfig/raidBuild 문서이며, 관리자 설정 페이지에서 바꿀 수 있습니다.
// 아래 DEFAULT_RAID_BUILD 는 그 문서가 아직 없을 때 관리자 페이지가 처음 만들어 넣는 값입니다.
import { POSITIONS } from "./raid-data.js?v=2";

// 분배 가능한 항목 (정신 내구도는 포지션 고정값)
export const BUILD_STATS = [
    { key: 'body', label: '신체 내구도', unit: '' },
    { key: 'speed', label: '속도', unit: '' },
    { key: 'move', label: '이동력', unit: '' },
    { key: 'op', label: '운용력', unit: '' },
    { key: 'def', label: '방어율', unit: '%' },
    { key: 'hit', label: '명중률', unit: '%' },
];
export const BASE_STATS = [
    { key: 'body', label: '신체 내구도', unit: '' },
    { key: 'mental', label: '정신 내구도', unit: '' },
    { key: 'speed', label: '속도', unit: '' },
    { key: 'move', label: '이동력', unit: '' },
    { key: 'op', label: '운용력', unit: '' },
    { key: 'def', label: '방어율', unit: '%' },
    { key: 'hit', label: '명중률', unit: '%' },
];
export const POSITION_ORDER = ['고목', '덤불', '이끼', '새순'];

export const DEFAULT_RAID_BUILD = {
    points: 7,
    per: { body: 10, speed: 1, move: 1, op: 1, def: 5, hit: 5 },
    max: { body: 300, speed: 10, move: 5, op: 15, def: 40, hit: 40 },
    positions: {
        '고목': { body: 200, mental: 200, speed: 6, move: 2, op: 3, def: 25, hit: 5 },
        '덤불': { body: 150, mental: 150, speed: 4, move: 2, op: 10, def: 10, hit: 10 },
        '이끼': { body: 120, mental: 150, speed: 9, move: 4, op: 7, def: 0, hit: 20 },
        '새순': { body: 100, mental: 200, speed: 2, move: 1, op: 10, def: 10, hit: 10 },
    },
    skills: Object.fromEntries(POSITION_ORDER.map(p => [p, POSITIONS[p]])),
};

export const emptyPoints = () => Object.fromEntries(BUILD_STATS.map(s => [s.key, 0]));
export const pointsUsed = (points) => BUILD_STATS.reduce((n, s) => n + (points?.[s.key] || 0), 0);

/** 분배 후 최종 값 */
export function finalValue(build, position, key, points) {
    const base = build.positions[position]?.[key] ?? 0;
    if (key === 'mental') return base;
    return base + (build.per[key] || 0) * (points?.[key] || 0);
}
/** 이 항목에 1포인트 더 넣을 수 있는지 */
export function canAdd(build, raid, key) {
    if (!raid?.position) return false;
    if (pointsUsed(raid.points) >= build.points) return false;
    const next = finalValue(build, raid.position, key, { ...raid.points, [key]: (raid.points?.[key] || 0) + 1 });
    return next <= build.max[key];
}
export function validateRaid(build, raid) {
    if (!raid || !build.positions[raid.position]) return false;
    const p = raid.points || {};
    if (Object.keys(p).some(k => !BUILD_STATS.some(s => s.key === k))) return false;
    for (const s of BUILD_STATS) {
        const v = p[s.key];
        if (!Number.isInteger(v) || v < 0) return false;
        if (finalValue(build, raid.position, s.key, p) > build.max[s.key]) return false;
    }
    return pointsUsed(p) <= build.points;
}

/** 레이드 게임에 넣을 캐릭터 문서 (보안 규칙이 같은 계산으로 검사합니다) */
export function raidCharacterDoc(char, build, turnOrder) {
    const { position, points } = char.raid;
    const v = (k) => finalValue(build, position, k, points);
    const body = v('body'), mental = v('mental');
    return {
        name: char.name, type: 'PC', imageUrl: char.imageUrl || '', position, sharedCharId: char.id,
        bodyHp: body, maxBodyHp: body, hp: body, maxHp: body,
        mentalHp: mental, maxMentalHp: mental, mp: mental, maxMp: mental,
        speed: v('speed'), moveRange: v('move'), op: v('op'), defPct: v('def'), hitPct: v('hit'),
        size: 1, skills: [...(build.skills?.[position] || POSITIONS[position] || [])],
        x: null, y: null, isLoggedIn: false, hasActedThisRound: false,
        statusEffects: [], isLastFallen: false, totalDamage: 0, turnOrder,
    };
}
