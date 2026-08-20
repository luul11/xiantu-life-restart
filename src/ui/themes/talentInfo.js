const PROP_NAMES = {
    AGE: '年龄', LSP: '寿元', CULT: '修为', REALM: '境界', STAGE: '层数',
    HP: '气血', MHP: '气血上限', MP: '灵力', MMP: '灵力上限', STR: '力量',
    MOOD: '心境', STONE: '灵石', JIN: '金', MU: '木', SHUI: '水', HUO: '火', TU: '土',
    PILL2: '筑基丹', PILL3: '结金丹', PILL4: '元婴丹', TELE: '传送符', POST: '宗门身份',
};

const formatValue = value => Number(value) > 0 ? `+${value}` : `${value}`;

const formatEffect = effect => Object.entries(effect || {})
    .map(([key, value]) => `${PROP_NAMES[key] || key} ${formatValue(value)}`)
    .join('、');

const formatCondition = condition => `${condition || ''}`
    .replaceAll('AGE', '年龄')
    .replaceAll('MOOD', '心境')
    .replaceAll('>', ' > ')
    .replaceAll('<', ' < ')
    .replaceAll('=', ' = ');

export const talentDetails = data => {
    const effectEntries = Object.entries(data.effect || {});
    const positive = effectEntries.filter(([, value]) => Number(value) >= 0);
    const negative = effectEntries.filter(([, value]) => Number(value) < 0);
    const effectDescription = positive.length ? formatEffect(Object.fromEntries(positive)) : '无直接增益';
    const riskParts = [];
    if(negative.length) riskParts.push(formatEffect(Object.fromEntries(negative)));
    if(data.condition) riskParts.push(`仅在${formatCondition(data.condition)}时触发`);
    if(data.max_triggers) riskParts.push(`最多触发${data.max_triggers}次`);
    return {
        ...data,
        effectDescription,
        riskDescription: riskParts.join('；') || '暂无明显负面后果',
    };
};

export const talentSummary = data => [
    `效果：${data.effectDescription}`,
].join('');
