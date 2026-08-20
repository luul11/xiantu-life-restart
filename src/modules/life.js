import * as util from '../functions/util.js';
import * as fCondition from '../functions/condition.js';

import Property from './property.js';
import Event from './event.js';
import Talent from './talent.js';
import Achievement from './achievement.js';
import Realm from './realm.js';
import Battle from './battle.js';

/** 属性键 -> 中文名（日志/界面展示属性变化用） */
const PROP_NAMES = {
    AGE: '年龄', LSP: '寿元', CULT: '修为', REALM: '境界', STAGE: '层数',
    HP: '气血', MHP: '气血上限', MP: '灵力', MMP: '灵力上限',
    STR: '力量', MOOD: '心境', STONE: '灵石',
    JIN: '金', MU: '木', SHUI: '水', HUO: '火', TU: '土',
    PILL2: '筑基丹', PILL3: '结金丹', PILL4: '元婴丹', TELE: '传送符',
    YXD1: '一品淤血丹', YXD2: '二品淤血丹', YXD3: '三品淤血丹',
    HQD1: '一品回气丹', HQD2: '二品回气丹', HQD3: '三品回气丹',
};

/**
 * 游戏主循环
 * 每回合（一年）：
 *   1. 年龄 +1
 *   2. 修炼结算（心境波动、修为增长、宝物加成、小/大境界突破）
 *   3. 触发天赋
 *   4. 从当前大境界的事件池抽取一个事件
 *      - 战斗事件：自动回合制结算
 *      - 选择事件（副本/闭关确认）：暂停等待 choose()，同一年内继续
 *   5. 成就判定
 *   6. 结局判定：元婴 = 通关；HP<=0 或 年龄>=寿元 = 结束
 * 全程累积人生日志，结束后可导出 txt。
 */
class Life {
    constructor() {
        this.#property = new Property(this);
        this.#event = new Event(this);
        this.#talent = new Talent(this);
        this.#achievement = new Achievement(this);
        this.#realm = new Realm(this);
        this.#battle = new Battle(this);
    }

    Module = {
        PROPERTY: 'PROPERTY',
        TALENT: 'TALENT',
        EVENT: 'EVENT',
        ACHIEVEMENT: 'ACHIEVEMENT',
        REALM: 'REALM',
        BATTLE: 'BATTLE',
    }

    Function = {
        CONDITION: 'CONDITION',
        UTIL: 'UTIL',
    }

    #property;
    #event;
    #talent;
    #achievement;
    #realm;
    #battle;
    #triggerTalents;
    #defaultPropertyPoints;
    #talentSelectLimit;
    #propertyAllocateLimit;
    #defaultPropertys;
    #initialData;
    #pendingChoice = null; // 等待玩家选择：{ prompt, options: [{label, next}] }
    #log = [];             // 人生日志行

    /** 加载数据：load(数据集名) => Promise<JSON> */
    async initial(load) {
        const [talents, achievements, lianqi, zhuji, jindan, skills, treasures] = await Promise.all([
            load('talents'),
            load('achievement'),
            load('events_lianqi'),
            load('events_zhuji'),
            load('events_jindan'),
            load('skills'),
            load('treasures'),
        ]);
        this.#talent.initial({ talents });
        this.#achievement.initial({ achievements });
        this.#event.initial({
            eventsByRealm: { 1: lianqi, 2: zhuji, 3: jindan },
        });
        this.#property.initial();
        this.#realm.initial({ treasures });
        this.#battle.initial({ skills });
    }

    config({
        defaultPropertyPoints = 20, // 开局可分配的属性点
        talentSelectLimit = 3,      // 最多可选天赋数
        propertyAllocateLimit = [0, 20], // 单项属性分配范围
        defaultPropertys = {},      // 默认属性
        talentConfig,               // 天赋抽取配置
            skillConfig = { chance: 0.18, pity: 10 },
    } = {}) {
        this.#defaultPropertyPoints = defaultPropertyPoints;
        this.#talentSelectLimit = talentSelectLimit;
        this.#propertyAllocateLimit = propertyAllocateLimit;
        this.#defaultPropertys = defaultPropertys;
        this.#talent.config(talentConfig);
        this.#event.config({ skillConfig });
    }

    request(module) {
        switch (module) {
            case this.Module.ACHIEVEMENT: return this.#achievement;
            case this.Module.EVENT: return this.#event;
            case this.Module.PROPERTY: return this.#property;
            case this.Module.TALENT: return this.#talent;
            case this.Module.REALM: return this.#realm;
            case this.Module.BATTLE: return this.#battle;
            default: return null;
        }
    }

    function(type) {
        switch (type) {
            case this.Function.CONDITION: return fCondition;
            case this.Function.UTIL: return util;
        }
    }

    check(condition) {
        return fCondition.checkCondition(this.#property, condition);
    }

    clone(...args) {
        return util.clone(...args);
    }

    remake(talents) {
        this.#initialData = util.clone(this.#defaultPropertys);
        this.#initialData.TLT = util.clone(talents);
        this.#triggerTalents = {};
        this.#pendingChoice = null;
        this.#log = [];
        return this.talentReplace(this.#initialData.TLT);
    }

    start(allocation) {
        for(const key in allocation) {
            this.#initialData[key] = util.clone(allocation[key]);
        }
        this.#property.restart(this.#initialData);
        const T = this.PropertyTypes;
        this.#log.push(
            `天赋：${this.#property.get(T.TLT).map(id => this.#talent.get(id).name).join(' / ') || '无'}`,
            '----------------------------------------'
        );
        this.doTalent();
        this.#achievement.achieve(this.AchievementOpportunity.START);
    }

    getPropertyPoints() {
        return this.#defaultPropertyPoints + this.#talent.allocationAddition(this.#initialData.TLT);
    }

    getTalentCurrentTriggerCount(talentId) {
        return this.#triggerTalents[talentId] || 0;
    }

    /** 是否有等待玩家选择的分支（副本前进/撤离、闭关确认等） */
    get hasPendingChoice() { return !!this.#pendingChoice; }
    get pendingChoice() { return this.#pendingChoice; }

    /** 查询技能/宝物/突破需求/境界名（界面展示用） */
    skill(id) { return this.#battle.skill(id); }
    treasure(id) { return this.#realm.treasure(id); }
    cultNeed() { return this.#realm.cultNeed(); }
    realmName() { return this.#realm.name(this.#property.get(this.PropertyTypes.REALM)); }
    postName() { return this.#realm.postName(); }

    /** 推进一年 */
    next() {
        const T = this.PropertyTypes;
        if(this.#pendingChoice) // 有未处理的选择，不允许进入下一年
            return { age: this.#property.get(T.AGE), content: [], needChoice: true, isWin: false, isEnd: false };

        const age = this.#property.ageNext();
        const content = [];

        // 1. 修炼结算（心境波动 + 修为增长 + 宝物加成 + 突破）
        const realmResults = this.#realm.settle();
        content.push(...realmResults);

        const breakthrough = realmResults.find(result => result.type === 'REALM');
        if(breakthrough) {
            this.#event.resetSkillPity(breakthrough.realm);
            const breakthroughEvents = { 2: null, 3: 2030, 4: 3060 };
            const breakthroughEvent = breakthroughEvents[breakthrough.realm];
            const beforeRealm = breakthrough.realm - 1;
            const breakthroughContent = breakthroughEvent == null ? [] : this.doEvent(breakthroughEvent);
            content.push(...breakthroughContent);
            if(breakthroughContent.some(item => item.breakthroughFailure))
                this.#realm.rollbackBreakthrough(beforeRealm);
            if(this.#pendingChoice)
                return this.#finishYear(age, content);
        }

        // 2. 天赋触发
        content.push(...this.doTalent());

        // 3. 按当前大境界抽取事件
        const eventId = this.#event.random(this.#property.get(T.REALM));
        if(eventId != null) content.push(...this.doEvent(eventId));

        return this.#finishYear(age, content);
    }

    /** 玩家做出选择（副本前进/撤离、闭关是/否），继续本年结算 */
    choose(index) {
        const pending = this.#pendingChoice;
        if(!pending) return { content: [], needChoice: false, isWin: false, isEnd: false };
        this.#pendingChoice = null;

        const option = pending.options[index];
        const T = this.PropertyTypes;
        const age = this.#property.get(T.AGE);

        this.#log.push(`  ➤ 选择：${option ? option.label : '放弃'}`);

        // 战后服药：先服药（消耗淤血丹回血），再继续后续事件
        let pillContent = [];
        if(option?.pill) {
            const pill = this.#battle.bestPill('HP');
            if(pill) {
                const healed = this.#battle.usePill(pill, 'HP');
                pillContent = [{
                    type: 'EVT',
                    description: `你服下【${pill.name}】，气血恢复 ${healed} 点。`,
                    grade: 1,
                }];
            }
        }

        if(!option || !option.next)
            return this.#finishYear(age, pillContent);

        return this.#finishYear(age, [...pillContent, ...this.doEvent(option.next)]);
    }

    /** 年度收尾：成就、结局判定、写日志 */
    #finishYear(age, content) {
        const T = this.PropertyTypes;

        // 成就判定
        this.#achievement.achieve(this.AchievementOpportunity.TRAJECTORY);

        // 结局判定
        const isWin = this.#property.get(T.REALM) >= 4;
        const isDead = !isWin && (this.#property.get(T.HP) < 1
            || age >= this.#property.get(T.LSP));

        if(isWin) {
            content.push({
                type: 'WIN',
                description: '你成就元婴，自此超脱凡尘，长生久视！【通关】',
            });
        } else if(isDead) {
            content.push({
                type: 'END',
                description: this.#property.get(T.HP) < 1
                    ? '你伤势过重，道消身殒。'
                    : '你寿元已尽，于洞府中安然坐化。',
            });
        }

        // 写人生日志（战斗回合明细也记录）
        if(content.length) {
            this.#log.push(`${age}岁：`);
            for(const item of content) {
                this.#log.push(`  ${this.contentToText(item)}`);
                if(item.battleLog)
                    for(const line of item.battleLog)
                        this.#log.push(`    ⚔ ${line}`);
            }
        }

        return {
            age,
            content,
            needChoice: !!this.#pendingChoice,
            isWin,
            isEnd: isWin || isDead,
        };
    }

    /** 强敌缩放：敌人境界 = 主角绝对境界 + offset[0]~offset[1] 层，属性按境界曲线生成 */
    #scaledEnemy({ offset, name }) {
        const T = this.PropertyTypes;
        const abs = (this.#property.get(T.REALM) - 1) * 10 + this.#property.get(T.STAGE);
        const tier = abs + offset[0]
            + Math.floor(Math.random() * (offset[1] - offset[0] + 1));
        // 战力曲线：练气段 1~10 层，筑基段 11~20 层
        const hp = tier <= 10 ? 40 + 14 * tier : 250 + 50 * (tier - 10);
        const atk = tier <= 10 ? Math.round(4 + 1.2 * tier) : 14 + 2 * (tier - 10);
        const tierName = tier <= 10 ? `练气${tier}层` : `筑基${tier - 10}层`;
        return { hp, atk, name: `${name}（${tierName}）` };
    }

    /** 导出人生日志文本 */
    exportLog() {
        const s = this.summary;
        return [
            '修仙人生模拟器 - 人生日志',
            '========================================',
            ...this.#log,
            '----------------------------------------',
            `最终境界：${s.realmName} ${s.stage} 层`,
            `享年：${s.age} / 寿元 ${s.lifespan}`,
            `力量：${s.power}　心境：${s.mood}　灵石：${s.stone}`,
            `重开次数：${s.times}`,
        ].join('\n');
    }

    /** 把一条内容渲染为纯文本（日志/控制台/界面共用） */
    contentToText(item) {
        const { type, description, postEvent, name, category, effect, gain, realm, stage, pillName, prompt, options } = item;
        switch (type) {
            case 'CULT':
                return `修为 +${gain}`
                    + (item.treasure ? `　宝物加持 ${item.treasure > 0 ? '+' : ''}${item.treasure}` : '')
                    + (item.salary != null ? `　${item.postName}俸禄（灵石+${item.salary}）` : '');
            case 'TREASURE':
                return `宝物加持：修为 ${gain > 0 ? '+' : ''}${gain}`;
            case 'STAGE':
                return `突破！${this.#realm.name(realm)} ${stage} 层`;
            case 'REALM':
                return `大境界突破！踏入【${name}】`;
            case 'STUCK':
                return `修为已圆满，但缺少【${pillName}】，无法突破`;
            case 'POST':
                return `晋升！你成为【${name}】，每年俸禄灵石+${item.salary}`;
            case 'TLT':
                return name;
            case 'EVT':
                return (category ? `[${category}] ` : '')
                    + description + this.formatEffect(effect)
                    + (postEvent ? ` ${postEvent}` : '');
            case 'BATTLE':
                return `⚔ ${description}`;
            case 'CHOICE':
                return `${prompt}（${options.map((o, i) => `${i}:${o.label}`).join(' / ')}）`;
            case 'WIN':
            case 'END':
                return description;
            default:
                return description || '';
        }
    }

    /** 把 effect 对象格式化为 （灵石+5 气血-10） */
    formatEffect(effect) {
        if (!effect) return '';
        const parts = [];
        for (const key in effect) {
            const value = effect[key];
            if(typeof value !== 'number') continue; // 列表型不进 diff
            if(key === 'ART') { // 宝物：显示名称而非 id
                parts.push(`宝物【${this.#realm.treasure(value)?.name || value}】`);
                continue;
            }
            if(key === 'SKL') { // 功法：显示名称而非 id
                parts.push(`功法【${this.#battle.skill(value)?.name || value}】`);
                continue;
            }
            const name = PROP_NAMES[key] || key;
            parts.push(`${name}${value > 0 ? '+' : ''}${value}`);
        }
        return parts.length ? `（${parts.join(' ')}）` : '';
    }

    talentReplace(talents) {
        const result = this.#talent.replace(talents);
        const contents = [];
        for(const id in result) {
            talents.push(result[id]);
            const source = this.#talent.get(id);
            const target = this.#talent.get(result[id]);
            contents.push({
                type: 'talentReplace',
                source, target
            });
        }
        return contents;
    }

    doTalent(talents) {
        if(talents) this.#property.change(this.PropertyTypes.TLT, talents);
        talents = this.#property.get(this.PropertyTypes.TLT)
            .filter(talentId => this.getTalentCurrentTriggerCount(talentId) < this.#talent.get(talentId).max_triggers);

        const contents = [];
        for(const talentId of talents) {
            const result = this.#talent.do(talentId);
            if(!result) continue;
            this.#triggerTalents[talentId] = this.getTalentCurrentTriggerCount(talentId) + 1;
            const { effect, name, description, grade, gradeName } = result;
            contents.push({
                type: this.PropertyTypes.TLT,
                name,
                grade,
                gradeName,
                description: this.format(description),
                effect,
            })
            if(!effect) continue;
            this.#property.effect(effect);
        }
        return contents;
    }

    doEvent(eventId) {
        const T = this.PropertyTypes;
        const {
            effect, next, description, postEvent,
            grade, category, battle, choice, dynamic,
        } = this.#event.do(eventId);
        this.#property.change(T.EVT, eventId);

        // 动态效果（闭关：消耗50%灵石，按 1:1+心境加成 转修为）
        let finalEffect = effect;
        if(dynamic === 'seclusion') {
            const stone = this.#property.get(T.STONE);
            const cost = Math.floor(stone * 0.5);
            finalEffect = {
                STONE: -cost,
                CULT: Math.round(cost * (1 + this.#property.get(T.MOOD) / 100)),
            };
        }

        // 重复宝物：折算为灵石（不卖第一件）
        const sellNotes = [];
        if(finalEffect && finalEffect.ART != null) {
            const artId = finalEffect.ART;
            if(this.#property.get(T.ART).includes(artId)) {
                const sell = this.#realm.treasure(artId)?.sell ?? 20;
                delete finalEffect.ART;
                finalEffect.STONE = (finalEffect.STONE || 0) + sell;
                sellNotes.push(`你已有相同的宝物，折算为 ${sell} 灵石。`);
            }
        }
        // 多余丹药：折算为灵石（身上已有同款丹药时，按市价五折）
        for(const [pill, sell] of [['PILL2', 250], ['PILL3', 1500]]) {
            if(finalEffect && finalEffect[pill] > 0
                && this.#property.get(T[pill]) >= finalEffect[pill]) {
                const total = sell * finalEffect[pill];
                delete finalEffect[pill];
                finalEffect.STONE = (finalEffect.STONE || 0) + total;
                sellNotes.push(`你身上已备有丹药，多余的丹药折算为 ${total} 灵石。`);
            }
        }
        if(finalEffect) this.#property.effect(finalEffect);

        if(finalEffect?.SKL != null)
            this.#event.resetSkillPity(this.#property.get(T.REALM));

        if(eventId === 2303 || eventId === 2305 || eventId === 3061)
            this.#property.set(T.CULT, 0);

        // 传送符保命语义：消耗传送符后若气血耗尽，保留 1 点（死里逃生）
        if(finalEffect?.TELE < 0 && this.#property.get(T.HP) <= 0)
            this.#property.set(T.HP, 1);

        const contents = [{
            type: T.EVT,
            description: this.format(description),
            postEvent: postEvent && this.format(postEvent),
            grade,
            category,
            effect: finalEffect,
        }];
        if(eventId === 2303 || eventId === 3061)
            contents[0].breakthroughFailure = true;
        for(const note of sellNotes)
            contents.push({
                type: T.EVT,
                description: note,
                grade: 1,
            });

        // 战斗：自动回合制；触发事件与胜负结果合并为一条概括，回合明细收进 battleLog
        if(battle) {
            const T = this.PropertyTypes;
            // 强敌事件：offset [min,max] 表示敌人境界比主角高 min~max 层，属性按境界曲线生成
            const enemy = battle.offset
                ? { ...battle, ...this.#scaledEnemy(battle) }
                : battle;
            const { win, draw, log, hpLost, mpUsed } = this.#battle.run(enemy);
            // 平局（打满回合不分高下）：优先走事件配置的 draw 节点（副本为主动撤离）；
            // 未配置时系统级兜底——无奖励无惩罚的"各自退去"，不会触发 lose 的惩罚/死亡
            let drawOutcome = null;
            let follow;
            let pillDropNote = null;
            // 人形BOSS丹药掉落机制：胜利后按概率掉落突破丹药
            if(win && enemy.human && battle.pillDrop) {
                const drop = battle.pillDrop;
                if(Math.random() < (drop.rate || 0)) {
                    const pillKey = drop.pill;
                    const pillNames = { PILL2: '筑基丹', PILL3: '结丹丹', PILL4: '元婴丹' };
                    const pillName = pillNames[pillKey] || pillKey;
                    finalEffect = finalEffect || {};
                    finalEffect[pillKey] = (finalEffect[pillKey] || 0) + 1;
                    pillDropNote = `击败${enemy.name}后在其储物袋中发现一枚${pillName}！`;
                }
            }
            if(win) follow = battle.win;
            else if(draw) {
                if(battle.draw != null) follow = battle.draw;
                else drawOutcome = `${enemy.name}久攻不下，你们不分高下，各自退去。`;
            }
            else follow = battle.lose;

            // 战后服药选择：胜利但气血不足一半且身上有淤血丹时，询问是否服药
            const healPill = win ? this.#battle.bestPill('HP') : null;
            if(healPill && this.#property.get(T.HP) < this.#property.get(T.MHP) * 0.5) {
                contents[0] = { ...contents[0], battleLog: log };
                this.#pendingChoice = {
                    prompt: `战斗结束，你伤势不轻。是否服用【${healPill.name}】疗伤？`,
                    options: [
                        { label: `服用${healPill.name}`, pill: true, next: follow },
                        { label: '不用', next: follow },
                    ],
                };
                contents.push({
                    type: 'CHOICE',
                    prompt: this.#pendingChoice.prompt,
                    options: this.#pendingChoice.options.map(o => ({ label: o.label })),
                    grade,
                });
                return contents.flat();
            }

            const followContents = drawOutcome
                ? [{ type: T.EVT, description: drawOutcome, grade: 1 }]
                : (follow ? this.doEvent(follow) : []);
            const outcome = followContents[0];

            // 展示用合并效果：触发事件效果 + 结果事件效果 + 战斗气血/灵力损耗
            const mergedEffect = { ...(finalEffect || {}) };
            if(outcome?.effect)
                for(const key in outcome.effect) {
                    const v = outcome.effect[key];
                    mergedEffect[key] = typeof v === 'number'
                        ? (mergedEffect[key] || 0) + v
                        : v;
                }
            if(hpLost) mergedEffect.HP = (mergedEffect.HP || 0) - hpLost;
            if(mpUsed) mergedEffect.MP = (mergedEffect.MP || 0) - mpUsed;

            contents[0] = {
                ...contents[0],
                description: contents[0].description + (outcome ? outcome.description : '') + (pillDropNote ? pillDropNote : ''),
                postEvent: outcome?.postEvent || contents[0].postEvent,
                effect: mergedEffect,
                grade: Math.max(grade || 0, outcome?.grade || 0),
                battleLog: log,
            };
            if(followContents.some(item => item.breakthroughFailure))
                contents[0].breakthroughFailure = true;
            contents.push(...followContents.slice(outcome ? 1 : 0));
            return contents.flat();
        }

        // 交互选择：暂停，等待 choose()
        if(choice) {
            this.#pendingChoice = choice;
            contents.push({
                type: 'CHOICE',
                prompt: this.format(choice.prompt),
                options: choice.options.map(o => ({ label: o.label })),
                grade,
            });
            return contents.flat();
        }

        if(next) contents.push(...this.doEvent(next));
        return contents.flat();
    }

    talentRandom() {
        return this.#talent.talentRandom(
            this.lastExtendTalent,
            util.getListValuesMap(
                [this.PropertyTypes.TMS],
                key => this.#property.get(key)
            ),
        );
    }

    talentInformation(talentId) {
        return this.#talent.information(talentId);
    }

    startTemplate({ talents, propertyAllocate = {} }) {
        const selected = talents.map(id => ({ id, ...this.#talent.information(id) }));
        this.remake(selected.map(talent => talent.id));
        $ui.switchView(UI.pages.TRAJECTORY, { propertyAllocate, talents: selected, enableExtend: true });
    }

    talentExtend(talentId) {
        this.#property.set(this.PropertyTypes.EXT, talentId);
    }

    exclude(talents, exclusive) {
        return this.#talent.exclude(talents, exclusive);
    }

    format(discription) {
        return `${discription}`.replaceAll(/\{\s*[0-9a-zA-Z_-]+\s*?\}/g, (match) => this.#format(match));
    }

    #format(key) {
        const T = this.PropertyTypes;
        switch (key.slice(1, -1).trim().toLowerCase()) {
            case 'age': return this.#property.get(T.AGE);
            case 'lsp': return this.#property.get(T.LSP);
            case 'cult': return this.#property.get(T.CULT);
            case 'realm': return this.#realm.name(this.#property.get(T.REALM));
            case 'stage': return this.#property.get(T.STAGE);
            case 'hp': return this.#property.get(T.HP);
            case 'mhp': return this.#property.get(T.MHP);
            case 'mp': return this.#property.get(T.MP);
            case 'mmp': return this.#property.get(T.MMP);
            case 'str': return this.#property.get(T.STR);
            case 'mood': return this.#property.get(T.MOOD);
            case 'stone': return this.#property.get(T.STONE);
            default: return key;
        }
    }

    get lastExtendTalent() {
        return this.#property.get(this.PropertyTypes.EXT);
    }

    /** 结算信息 */
    get summary() {
        this.#achievement.achieve(this.AchievementOpportunity.SUMMARY);
        const T = this.PropertyTypes;
        const realm = this.#property.get(T.REALM);
        return {
            realmName: this.#realm.name(realm),
            stage: this.#property.get(T.STAGE),
            age: this.#property.get(T.AGE),
            lifespan: this.#property.get(T.LSP),
            stone: this.#property.get(T.STONE),
            power: this.#property.get(T.STR),
            mood: this.#property.get(T.MOOD),
            times: this.times,
        };
    }

    get achievements() {
        const ticks = {};
        this.#property
            .get(this.PropertyTypes.ACHV)
            .forEach(([id, tick]) => ticks[id] = tick);
        return this
            .#achievement
            .list()
            .sort((
                {id: a, grade: ag, hide: ah},
                {id: b, grade: bg, hide: bh}
            )=>{
                a = ticks[a];
                b = ticks[b];
                if(a&&b) return b - a;
                if(!a&&!b) {
                    if(ah&&bh) return bg - ag;
                    if(ah) return 1;
                    if(bh) return -1;
                    return bg - ag;
                }
                if(!a) return 1;
                if(!b) return -1;
            });
    }

    get PropertyTypes() { return this.#property.TYPES; }
    get AchievementOpportunity() { return this.#achievement.Opportunity; }
    get talentSelectLimit() { return this.#talentSelectLimit; }
    get propertyAllocateLimit() { return util.clone(this.#propertyAllocateLimit); }

    get propertys() { return this.#property.getPropertys(); }
    get times() { return this.#property.get(this.PropertyTypes.TMS) || 0; }
    set times(v) {
        this.#property.set(this.PropertyTypes.TMS, v);
        this.#achievement.achieve(this.AchievementOpportunity.END);
    }
}

export default Life;
