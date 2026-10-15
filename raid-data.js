// 마스레이드 공용 데이터 (raid.html 과 admin.html 이 함께 사용합니다)

export const DEFAULT_PC_PASSWORD = "1234";

// 포지션 스킬 정의가 바뀔 때마다 올립니다. 관리자가 게임을 열면 그 게임의 포지션 스킬이 이 버전으로 자동 갱신됩니다.
// v2: 2026-10 스킬 문서 반영 (사거리·효과 재정리)
export const PLAYER_SKILLS_VERSION = 2;
export const POSITION_SKILL_IDS = ['지탱', '목갑', '구조', '정착', '의지', '수호', '추격', '연쇄', '섬전', '살상', '관통', '포식',
    '속박', '암전', '박탈', '매복', '전이', '잠식', '결속', '순환', '정화', '태동', '소생', '개화'];

export const PREDEFINED_EFFECTS = {
    rooted: { id: 'rooted', name: '속박' },
    stunned: { id: 'stunned', name: '기절' },
    poisoned: { id: 'poisoned', name: '중독', effectType: 'damage' },
    regenerating: { id: 'regenerating', name: '재생', effectType: 'heal' },
    anchored: { id: 'anchored', name: '정착' },
    growth: { id: 'growth', name: '생장' },
    cursed: { id: 'cursed', name: '저주' },
    corrosion: { id: 'corrosion', name: '잠식 반동' },
    defBuff: { id: 'defBuff', name: '방어 버프' },
    taunted: { id: 'taunted', name: '도발' },
    stealth: { id: 'stealth', name: '은폐' },
    sharp: { id: 'sharp', name: '첨예' },
    hitLock: { id: 'hitLock', name: '명중률 고정' },
    linkedFate: { id: 'linkedFate', name: '연좌' },
    guarding: { id: 'guarding', name: '대리 피격 준비' },
    mentalRot: { id: 'mentalRot', name: '정신 부식', effectType: 'mentalDamage' },
    confused: { id: 'confused', name: '혼란' },
    barkArmor: { id: 'barkArmor', name: '목갑' },
    hitSet: { id: 'hitSet', name: '명중률 변경' },
    exhausted: { id: 'exhausted', name: '행동 불가' },
    guardian: { id: 'guardian', name: '수호' },
};

export const DEFAULT_SKILLS = {
        'move': { id: 'move', name: '이동', type: 'Utility', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '🏃', mpCost: 0, category: 'Utility' },

        // ===== 고목 =====
        '지탱': { id: '지탱', name: '지탱', type: 'Defense', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🛡️', mpCost: 10, category: 'Defense', desc: '시전 당시 2마스 이내 아군 수 × 5%만큼 방어율 상승. 1라운드 지속.' },
        '목갑': { id: '목갑', name: '목갑', type: 'Defense', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🪵', mpCost: 20, category: 'Defense', desc: '방어율 25% 상승. 1라운드 지속.' },
        '구조': { id: '구조', name: '구조', type: 'Support', range: 5, rangeShape: 'diamond', multiplier: 0, icon: '🤝', mpCost: 20, category: 'Support', targetType: 'ALLY', desc: '5마스 내 아군을 시전자 1마스 내 위치로 즉시 이동. 이동 전 그 아군과 1마스로 인접한 적에게 [기절].' },
        '정착': { id: '정착', name: '정착', type: 'Defense', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '⚓', mpCost: 0, category: 'Defense', desc: '시전 라운드 동안 위치 고정, 모든 상태이상·강제이동 면역. 라운드 종료 시 이번 라운드 피격 데미지/2만큼 정신 내구도 회복.' },
        '의지': { id: '의지', name: '의지', type: 'Melee', range: 0, rangeShape: 'diamond', multiplier: 3, icon: '🔥', mpCost: 0, category: 'Attack', isAoe: true, aoeRange: 3, aoeShape: 'diamond', desc: '시전자 기준 3마스 내 적 전원에게 운용력×3 데미지, 피해를 입은 적에게 [도발].' },
        '수호': { id: '수호', name: '수호', type: 'Defense', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '⚔️', mpCost: 20, category: 'Defense', desc: '정신 내구도 50 이하일 때 사용. 1라운드 동안 시전자 내구도는 1 아래로 내려가지 않고, 모든 아군의 피해(스킬 정신 소모 포함)와 상태이상을 대신 받음. 레이드 당 1회.' },

        // ===== 덤불 =====
        '추격': { id: '추격', name: '추격', type: 'Melee', range: 5, rangeShape: 'diamond', multiplier: 3, icon: '🎯', mpCost: 10, category: 'Attack', desc: '5마스 내 적 1체의 인접 마스로 이동 후 운용력×3 데미지. 이동할 마스 선택(현재 위치 포함).' },
        '연쇄': { id: '연쇄', name: '연쇄', type: 'Melee', range: 1, rangeShape: 'diamond', multiplier: 4, icon: '⛓️', mpCost: 15, category: 'Attack', desc: '1마스 내 적 1체에게 운용력×4 데미지. 직전 행동이 [추격]이면 운용력×5.' },
        '섬전': { id: '섬전', name: '섬전', type: 'Melee', range: 3, rangeShape: 'diamond', multiplier: 3, icon: '⚡', mpCost: 15, category: 'Attack', desc: '3마스 내 적 1체에게 운용력×3 데미지. 이 공격부터 명중에 성공할 때까지 명중률 50%.' },
        '살상': { id: '살상', name: '살상', type: 'Melee', range: 0, rangeShape: 'diamond', multiplier: 2, icon: '🗡️', mpCost: 30, category: 'Attack', isAoe: true, aoeRange: 3, aoeShape: 'diamond', desc: '시전자 기준 3마스 내 적 전원에게 운용력×2 데미지 후, (공격한 적 수×2)만큼 추가 데미지.' },
        '관통': { id: '관통', name: '관통', type: 'Melee', range: 1, rangeShape: 'diamond', multiplier: 0, icon: '🏹', mpCost: 25, category: 'Attack', desc: '정신 내구도 60 이하일 때 사용. 1마스 내 적 1체의 신체 내구도가 100 이하면 즉시 사살.' },
        '포식': { id: '포식', name: '포식', type: 'Support', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🍴', mpCost: 0, category: 'Support', desc: '(지금까지 입힌 데미지 총합÷5)만큼 모든 아군 정신 내구도 회복(최대치 초과 가능). 시전자는 다음 라운드 행동 불가. 레이드 당 1회.' },

        // ===== 이끼 =====
        '속박': { id: '속박', name: '속박', type: 'Melee', range: 0, rangeShape: 'diamond', multiplier: 3, icon: '🔗', mpCost: 10, category: 'Attack', isAoe: true, aoeRange: 2, aoeShape: 'diamond', desc: '시전자 기준 2마스 내 적 전원에게 운용력×3 데미지와 [속박](이동력 1) 1라운드.' },
        '암전': { id: '암전', name: '암전', type: 'Melee', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '🌙', mpCost: 10, category: 'Attack', desc: '3마스 내 적 1체에게 [중독](라운드마다 운용력만큼 피해) 3라운드.' },
        '박탈': { id: '박탈', name: '박탈', type: 'Melee', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '🔎', mpCost: 10, category: 'Attack', desc: '3마스 내 적 1체의 [은폐] 제거(은폐 상태여도 지정 가능). 이 공격부터 명중에 성공할 때까지 명중률 50%.' },
        '매복': { id: '매복', name: '매복', type: 'Melee', range: 1, rangeShape: 'diamond', multiplier: 4, icon: '🥷', mpCost: 15, category: 'Attack', desc: '1마스 내 적 1체에게 운용력×4 데미지, 위치 무관 아군 1명(시전자 포함)에게 [은폐](이동 전까지).' },
        '전이': { id: '전이', name: '전이', type: 'Support', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '🔄', mpCost: 20, category: 'Support', desc: '3마스 내 적 1체의 모든 상태이상([도발] 제외)을 시전자 기준 3마스 내 다른 적 모두에게 부여.' },
        '잠식': { id: '잠식', name: '잠식', type: 'Support', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🌑', mpCost: 0, category: 'Support', desc: '상태이상이 있는 적 수×10만큼 시전자, ×5만큼 다른 아군 정신 내구도 회복(최대치까지). 다른 아군 명중률 100%(1회 명중까지). 시전자는 다음 1라운드 명중률 0%, 속도 1. 레이드 당 1회.' },

        // ===== 새순 =====
        '결속': { id: '결속', name: '결속', type: 'Heal', range: 3, rangeShape: 'diamond', multiplier: 3, icon: '💚', mpCost: 10, category: 'Heal', targetType: 'ALLY', desc: '3마스 내 아군 1명(시전자 포함)의 신체 내구도를 운용력×3 회복.' },
        '순환': { id: '순환', name: '순환', type: 'Heal', range: 3, rangeShape: 'diamond', multiplier: 1, icon: '♻️', mpCost: 10, category: 'Heal', targetType: 'ALLY', desc: '3마스 내 아군 1명(시전자 포함)의 신체 내구도를 3라운드간 라운드마다 운용력만큼 회복.' },
        '정화': { id: '정화', name: '정화', type: 'Heal', range: 0, rangeShape: 'diamond', multiplier: 1, icon: '✨', mpCost: 15, category: 'Heal', desc: '시전자를 포함한 아군 전체의 정신 내구도를 운용력만큼 회복.' },
        '태동': { id: '태동', name: '태동', type: 'Support', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '🌱', mpCost: 20, category: 'Support', targetType: 'ALLY', desc: '시전자를 제외한 3마스 내 아군 1명에게 [생장](운용력 + 시전자 운용력) 3라운드.' },
        '소생': { id: '소생', name: '소생', type: 'Heal', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '💙', mpCost: 30, category: 'Heal', targetType: 'ALLY', desc: '정신 내구도 50 이하인 아군 1명(시전자 포함, 거리 무관)의 정신 내구도를 즉시 100 회복.' },
        '개화': { id: '개화', name: '개화', type: 'Support', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🌸', mpCost: 0, category: 'Special', desc: '모든 아군의 모든 내구도를 최대치로 회복한 뒤 시전자 신체 내구도 1. 모든 적에게 1라운드 [도발]. 레이드 당 1회.' },

        // ===== 서브 개체 스킬 =====
        '파편': { id: '파편', name: '파편', type: 'Melee', range: 1, rangeShape: 'diamond', multiplier: 3, icon: '🔹', mpCost: 0, category: 'Attack' },
        '균사': { id: '균사', name: '균사', type: 'Ranged', range: 0, rangeShape: 'diamond', multiplier: 2, icon: '🍄', mpCost: 0, category: 'Attack', isAoe: true, aoeRange: 3, aoeShape: 'diamond', selfTargetAoe: true },
        '대리': { id: '대리', name: '대리', type: 'Defense', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🪵', mpCost: 0, category: 'Defense' },

        // ===== 야슈체 =====
        "hats'ik": { id: "hats'ik", name: "hats'ik", type: 'Ranged', range: 0, rangeShape: 'diamond', multiplier: 3, icon: '💥', mpCost: 0, category: 'Attack', isAoe: true, aoeRange: 3, aoeShape: 'diamond', selfTargetAoe: true },
        "ch'a'ik ik'": { id: "ch'a'ik ik'", name: "ch'a'ik ik'", type: 'Ranged', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '🩸', mpCost: 0, category: 'Attack' },
        "k'alik": { id: "k'alik", name: "k'alik", type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🔗', mpCost: 0, category: 'Attack' },

        // ===== 시카모어 =====
        'ما خفي كان أعظم': { id: 'ما خفي كان أعظم', name: 'ما خفي كان أعظم', type: 'Ranged', range: 0, rangeShape: 'diamond', multiplier: 2, icon: '➖', mpCost: 0, category: 'Attack', isAoe: true, selfTargetAoe: true },
        'المؤمن مصاب.': { id: 'المؤمن مصاب.', name: 'المؤمن مصاب.', type: 'Melee', range: 1, rangeShape: 'diamond', multiplier: 0, icon: '🧛', mpCost: 0, category: 'Attack' },
        'يا ما تحت السواهي دواهي.': { id: 'يا ما تحت السواهي دواهي.', name: 'يا ما تحت السواهي دواهي.', type: 'Support', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '👻', mpCost: 0, category: 'Support' },

        // ===== 위그드라실 =====
        'Urðarbrunnr': { id: 'Urðarbrunnr', name: 'Urðarbrunnr', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🌳', mpCost: 0, category: 'Special', onceOnly: true },
        'Hvergelmir': { id: 'Hvergelmir', name: 'Hvergelmir', type: 'Ranged', range: 5, rangeShape: 'diamond', multiplier: 0, icon: '💧', mpCost: 0, category: 'Attack' },
        'Mímisbrunnr': { id: 'Mímisbrunnr', name: 'Mímisbrunnr', type: 'Support', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '🌲', mpCost: 0, category: 'Support' },

        // ===== 에게르퇴뢰 파 =====
        'Turul szárnyai': { id: 'Turul szárnyai', name: 'Turul szárnyai', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🦅', mpCost: 0, category: 'Attack' },
        'Ördög rosszindulata': { id: 'Ördög rosszindulata', name: 'Ördög rosszindulata', type: 'Ranged', range: 5, rangeShape: 'square', multiplier: 2, icon: '👹', mpCost: 0, category: 'Attack', isAoe: true, aoeRange: 1, aoeShape: 'square' },
        'Bábák varázsa': { id: 'Bábák varázsa', name: 'Bábák varázsa', type: 'Ranged', range: 5, rangeShape: 'diamond', multiplier: 0, icon: '🔄', mpCost: 0, category: 'Attack' },

        // ===== 가오케레나 =====
        'کینه اهریمن.': { id: 'کینه اهریمن.', name: 'کینه اهریمن.', type: 'Ranged', range: 5, rangeShape: 'diamond', multiplier: 0, icon: '😈', mpCost: 0, category: 'Attack' },
        'هوم سفید': { id: 'هوم سفید', name: 'هوم سفید', type: 'Ranged', range: 3, rangeShape: 'diamond', multiplier: 0, icon: '☁️', mpCost: 0, category: 'Attack' },
        'خانه بوروکاشا': { id: 'خانه بوروکاشا', name: 'خانه بوروکاشا', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🏚️', mpCost: 0, category: 'Special' },
        'لانه سیمرغ': { id: 'لانه سیمرغ', name: 'لانه سیمرغ', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🪺', mpCost: 0, category: 'Special' },
        'حفاظت از اهورا مزدا': { id: 'حفاظت از اهورا مزدا', name: 'حفاظت از اهورا مزدا', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🛡️', mpCost: 0, category: 'Attack' },

        // ===== 세피로트 =====
        'אֶהְיֶה אֲשֶׁר אֶהְיֶה': { id: 'אֶהְיֶה אֲשֶׁר אֶהְיֶה', name: 'אֶהְיֶה אֲשֶׁר אֶהְיֶה', type: 'Ranged', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '✡️', mpCost: 0, category: 'Attack' },
        'נְחֻשְׁתָּן': { id: 'נְחֻשְׁתָּן', name: 'נְחֻשְׁתָּן', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🐍', mpCost: 0, category: 'Attack' },
        'דָּעַת': { id: 'דָּעַת', name: 'דָּעַת', type: 'Support', range: 0, rangeShape: 'diamond', multiplier: 0, icon: '📖', mpCost: 0, category: 'Support' },
        'אין': { id: 'אין', name: 'אין', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '👁️', mpCost: 0, category: 'Special' },
        'סִטְרָא אַחְרָא': { id: 'סִטְרָא אַחְרָא', name: 'סִטְרָא אַחְרָא', type: 'Ranged', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🌑', mpCost: 0, category: 'Attack' },
        'לְהִתְפַּלֵל': { id: 'לְהִתְפַּלֵל', name: 'לְהִתְפַּלֵל', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '🙏', mpCost: 0, category: 'Special' },

        // ===== 아포칼립스 =====
        '불완전한 위협': { id: '불완전한 위협', name: '불완전한 위협', type: 'Special', range: 99, rangeShape: 'diamond', multiplier: 0, icon: '💀', mpCost: 0, category: 'Attack' },
    };

export const POSITIONS = {
        '고목': ['지탱', '목갑', '구조', '정착', '의지', '수호'],
        '덤불': ['추격', '연쇄', '섬전', '살상', '관통', '포식'],
        '이끼': ['속박', '암전', '박탈', '매복', '전이', '잠식'],
        '새순': ['결속', '순환', '정화', '태동', '개화', '소생'],
    };

export const RAID_ENEMY_CATALOG = {
        subTypes: [
            { key: 'fragment', label: '녹빛 파편', imageUrl: 'https://i.imgur.com/2KBDVmP.png', bodyHp: 60, mentalHp: 0, maxBodyHp: 60, maxMentalHp: 0, speed: 4.5, moveRange: 3, op: 10, defPct: 0, hitPct: 0, skills: ['파편'] },
            { key: 'spore', label: '떠다니는 균사', imageUrl: 'https://i.imgur.com/HULXn1e.png', bodyHp: 40, mentalHp: 0, maxBodyHp: 40, maxMentalHp: 0, speed: 7.5, moveRange: 4, op: 10, defPct: 0, hitPct: 0, skills: ['균사'], defaultEffects: [{ id: 'stealth', turns: 9999 }] },
            { key: 'cocoon', label: '질긴 옹이', imageUrl: 'https://i.imgur.com/WpF02qq.png', bodyHp: 200, mentalHp: 0, maxBodyHp: 200, maxMentalHp: 0, speed: 2.5, moveRange: 1, op: 4, defPct: 0, hitPct: 0, skills: ['대리'] },
        ],
        bosses: [
            { name: '야슈체', imageUrl: 'https://i.imgur.com/C8oxEtH.png', bodyHp: 500, maxBodyHp: 500, mentalHp: 0, maxMentalHp: 0, speed: 3.5, moveRange: 1, op: 15, defPct: 10, hitPct: 10, skills: ["hats'ik", "ch'a'ik ik'", "k'alik"], desc: '파편 3체. 스킬: 범위 밀쳐내기, 내구도 차감, 원거리 속박' },
            { name: '시카모어', imageUrl: 'https://i.imgur.com/HZdhbNn.png', bodyHp: 700, maxBodyHp: 700, mentalHp: 0, maxMentalHp: 0, speed: 5.5, moveRange: 2, op: 15, defPct: 15, hitPct: 10, skills: ['ما خفي كان أعظم', 'المؤمن مصاب.', 'يا ما تحت السواهي دواهي.'], desc: '파편 2, 균사 1. 스킬: 가로 광역 혼란, 정신 흡수 회복, 은폐 부여' },
            { name: '위그드라실', imageUrl: 'https://i.imgur.com/l6RMccd.png', bodyHp: 1000, maxBodyHp: 1000, mentalHp: 0, maxMentalHp: 0, speed: 6.5, moveRange: 0, op: 20, defPct: 20, hitPct: 15, skills: ['Urðarbrunnr', 'Hvergelmir', 'Mímisbrunnr'], stunImmuneAfterOne: true, desc: '파편 2, 균사 2. 스킬: Urðarbrunnr, Hvergelmir, Mímisbrunnr' },
            { name: '에게르퇴뢰 파', imageUrl: 'https://i.imgur.com/8RGyVKu.png', bodyHp: 1500, maxBodyHp: 1500, mentalHp: 0, maxMentalHp: 0, speed: 7.5, moveRange: 3, op: 30, defPct: 20, hitPct: 20, skills: ['Turul szárnyai', 'Ördög rosszindulata', 'Bábák varázsa'], stunImmune: true, desc: '파편 1, 균사 2, 옹이 1. 스킬: Turul, Ördög, Bábák' },
            { name: '가오케레나', imageUrl: 'https://i.imgur.com/uv3mvUd.png', bodyHp: 2000, maxBodyHp: 2000, mentalHp: 0, maxMentalHp: 0, speed: 8.5, moveRange: 3, op: 30, defPct: 25, hitPct: 25, skills: ['کینه اهریمن.', 'هوم سفید', 'خانه بوروکاشا', 'لانه سیمرغ', 'حفاظت از اهورا مزدا'], stunImmune: true, desc: '파편 2, 균사 2, 옹이 1. 5개 스킬' },
            { name: '세피로트', imageUrl: 'https://i.imgur.com/Olq6BfV.png', bodyHp: 10000, maxBodyHp: 10000, mentalHp: 0, maxMentalHp: 0, speed: 9.5, moveRange: 4, op: 40, defPct: 35, hitPct: 30, skills: ['אֶהְיֶה אֲשֶׁר אֶהְיֶה', 'נְחֻשְׁתָּן', 'דָּעַת', 'אין', 'סִטְרָא אַחְרָא', 'לְהִתְפַּלֵל'], stunImmune: true, desc: '파편 2, 균사 2, 옹이 2. 6개 스킬. 멤버 사망 시 최대 체력 감소' },
            { name: '아포칼립스', imageUrl: 'https://i.imgur.com/JcYwyco.png', bodyHp: 99999, maxBodyHp: 99999, mentalHp: 0, maxMentalHp: 0, speed: 1, moveRange: 0, op: 0, defPct: 0, hitPct: 0, skills: ['불완전한 위협'], stunImmune: true, desc: '무작위 아군 1명의 모든 내구도를 0으로 설정' },
        ]
    };

export const SKILL_CATEGORIES = ['Attack', 'Defense', 'Heal', 'Support', 'Special', 'Utility', 'Other'];
