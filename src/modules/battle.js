/**
 * 自动回合制战斗
 *
 * 五行克制：金克木、木克土、土克水、水克火、火克金
 *
 * 技能伤害 = 基础伤害 + 攻击方对应五行值 × 稀有度系数
 *   （无属性技能用力量代替五行值）
 * 普攻伤害 = 力量（不耗 MP）
 * 有效抗性 = 防御方[该系] + 0.5 × 防御方[克制该系的属性]
 *   例：火系伤害 -> 抗性 = 防御方火 + 0.5 × 防御方水（水克火）
 * 最终伤害 = max(1, 伤害 - 有效抗性)
 *
 * 每回合我方先手，遍历已学技能选伤害最大化的可用技能，MP 不足则普攻。
 * 最多 20 回合；打满回合双方均未倒下 = 不分高下（平局），
 * 走事件的 draw 节点（副本中为"主动撤离"），不会误判重伤战死。
 *
 * 丹药（战斗内自动使用，服药回合空门大开被白打一轮）：
 *   淤血丹 YXD1/2/3：气血 <30% 时自动服用，固定恢复 200/100/40（一品最好）
 *   回气丹 HQD1/2/3：灵力 <30% 时自动服用，固定恢复 80/45/20
 *   玩家不限制次数；人类敌人（配置 human:true）残血时 40% 概率服药，
 *   每场最多 3 次，恢复 30% 气血且当回合不攻击。
 */
class Battle {
    /** 丹药表（一品最好，按优先级从高到低检索；heal 为固定回复量） */
    static PILLS = {
        HP: [
            { key: 'YXD1', name: '一品淤血丹', heal: 200 },
            { key: 'YXD2', name: '二品淤血丹', heal: 100 },
            { key: 'YXD3', name: '三品淤血丹', heal: 40 },
        ],
        MP: [
            { key: 'HQD1', name: '一品回气丹', heal: 80 },
            { key: 'HQD2', name: '二品回气丹', heal: 45 },
            { key: 'HQD3', name: '三品回气丹', heal: 20 },
        ],
    };

    /** NPC 每场战斗最多服药次数 / 服药概率 / 恢复比例 */
    static NPC_PILL = { max: 3, chance: 0.4, rate: 0.3 };
    /** 克制该系的属性：X系伤害 -> 克X的元素 */
    static COUNTER = {
        JIN: 'HUO',  // 火克金
        MU: 'JIN',   // 金克木
        SHUI: 'TU',  // 土克水
        HUO: 'SHUI', // 水克火
        TU: 'MU',    // 木克土
    };

    /** 稀有度系数：白/绿/蓝/紫/橙 */
    static GRADE_COEF = [0.5, 1.0, 1.5, 2.0, 3.0];

    static MAX_ROUNDS = 20;

    constructor(system) {
        this.#system = system;
    }

    #system;
    #skills = {}; // 技能表 { id: { name, elem, mp, base, grade } }

    /** 加载技能表 */
    initial({ skills }) {
        this.#skills = skills || {};
    }

    /** 查询技能 */
    skill(id) {
        return this.#skills[id];
    }

    get #prop() {
        return this.#system.request(this.#system.Module.PROPERTY);
    }

    /** 查询身上最好的可用丹药（kind: 'HP' | 'MP'），无则 null */
    bestPill(kind) {
        const T = this.#prop.TYPES;
        return Battle.PILLS[kind].find(p => this.#prop.get(T[p.key]) > 0) || null;
    }

    /** 服用指定丹药：扣库存并固定回复，返回恢复量 */
    usePill(pill, kind) {
        const T = this.#prop.TYPES;
        this.#prop.change(T[pill.key], -1);
        this.#prop.change(T[kind], pill.heal);
        return pill.heal;
    }

    /** 有效抗性：def[X] + 0.5 × def[克X]；无属性伤害无抗性 */
    resist(def, elem) {
        if(!elem || elem === 'NONE') return 0;
        return (Number(def[elem]) || 0)
            + 0.5 * (Number(def[Battle.COUNTER[elem]]) || 0);
    }

    /** 技能面板伤害（未扣抗性） */
    skillDamage(skill, attacker) {
        const scale = skill.elem === 'NONE'
            ? attacker.STR
            : attacker[skill.elem] || 0;
        return skill.base + scale * Battle.GRADE_COEF[skill.grade || 0];
    }

    /**
     * 执行一场战斗
     * enemy: { name, hp, atk, elem, res }
     *   elem 敌方攻击的五行属性（NONE 为无属性）
     *   res  敌方五行抗性 { JIN: n, ... }（可缺省）
     * 返回 { win, draw, log, hpLost, mpUsed }（损耗用于事件概括展示；
     * draw=true 表示打满回合不分高下）
     */
    run(enemy) {
        const T = this.#prop.TYPES;
        const log = [];

        const hpStart = this.#prop.get(T.HP);
        const mpStart = this.#prop.get(T.MP);
        let enemyHp = enemy.hp;
        const mySkills = this.#prop.get(T.SKL)
            .map(id => this.#skills[id])
            .filter(Boolean);

        const attacker = {
            STR: this.#prop.get(T.STR),
            JIN: this.#prop.get(T.JIN),
            MU: this.#prop.get(T.MU),
            SHUI: this.#prop.get(T.SHUI),
            HUO: this.#prop.get(T.HUO),
            TU: this.#prop.get(T.TU),
        };
        const enemyRes = enemy.res || {};

        let win = false;
        let npcPills = 0; // 敌方已服药次数
        for(let round = 1; round <= Battle.MAX_ROUNDS; round++) {
            const turn = `【回合${round}】`; // 回合数标识
            // ---- 我方行动 ----
            // 自动服药（伤势/灵力不足时）：服药回合空门大开，不攻击
            let acted = false;
            if(this.#prop.get(T.HP) < this.#prop.get(T.MHP) * 0.3) {
                const pill = this.bestPill('HP');
                if(pill) {
                    const healed = this.usePill(pill, 'HP');
                    log.push(`${turn}你服下【${pill.name}】，气血恢复 ${healed}，空门大开！（你 HP ${this.#prop.get(T.HP)}/${this.#prop.get(T.MHP)}）`);
                    acted = true;
                }
            }
            if(!acted && this.#prop.get(T.MP) < this.#prop.get(T.MMP) * 0.3) {
                const pill = this.bestPill('MP');
                if(pill) {
                    const restored = this.usePill(pill, 'MP');
                    log.push(`${turn}你服下【${pill.name}】，灵力恢复 ${restored}，空门大开！（你 MP ${this.#prop.get(T.MP)}/${this.#prop.get(T.MMP)}）`);
                    acted = true;
                }
            }

            if(!acted) {
                // 选伤害最大化的可用技能，MP 不足则普攻
                let best = { dmg: Math.max(1, Math.round(attacker.STR)), skill: null };
                for(const skill of mySkills) {
                    if(this.#prop.get(T.MP) < skill.mp) continue;
                    const dmg = Math.max(1, Math.round(
                        this.skillDamage(skill, attacker) - this.resist(enemyRes, skill.elem)
                    ));
                    if(dmg > best.dmg) best = { dmg, skill };
                }

                enemyHp -= best.dmg;
                // 每回合日志附带双方当前状态：HP/MP
                const enemyState = `${enemy.name} HP ${Math.max(0, enemyHp)}/${enemy.hp}`;
                if(best.skill) {
                    this.#prop.change(T.MP, -best.skill.mp);
                    log.push(`${turn}你施展【${best.skill.name}】，对${enemy.name}造成 ${best.dmg} 点伤害（${enemyState}）`);
                } else {
                    log.push(`${turn}你挥剑普攻，对${enemy.name}造成 ${best.dmg} 点伤害（${enemyState}）`);
                }

                if(enemyHp <= 0) {
                    win = true;
                    log.push(`${turn}${enemy.name}被你击败！`);
                    break;
                }
            }

            // ---- 敌方行动：人类敌人残血时概率服药（每场限 3 次，当回合不攻击） ----
            if(enemy.human && npcPills < Battle.NPC_PILL.max
                && enemyHp < enemy.hp * 0.3
                && Math.random() < Battle.NPC_PILL.chance) {
                npcPills++;
                const healed = Math.ceil(enemy.hp * Battle.NPC_PILL.rate);
                enemyHp = Math.min(enemy.hp, enemyHp + healed);
                log.push(`${turn}${enemy.name}服下一枚疗伤丹药，伤势恢复！（${enemy.name} HP ${enemyHp}/${enemy.hp}）`);
                continue;
            }

            const enemyDmg = Math.max(1, Math.round(
                enemy.atk - this.resist(attacker, enemy.elem)
            ));
            this.#prop.change(T.HP, -enemyDmg);
            log.push(`${turn}${enemy.name}反击，你受到 ${enemyDmg} 点伤害（你 HP ${this.#prop.get(T.HP)}/${this.#prop.get(T.MHP)}，MP ${this.#prop.get(T.MP)}/${this.#prop.get(T.MMP)}）`);

            if(this.#prop.get(T.HP) < 1) {
                log.push(`${turn}你重伤倒地……`);
                break;
            }
        }

        // 打满回合且双方均未倒下：平局（不分高下），不算战败
        const draw = !win && this.#prop.get(T.HP) >= 1;
        if(draw) log.push(`激战 ${Battle.MAX_ROUNDS} 回合不分高下，${enemy.name}收手退去。`);

        return {
            win,
            draw,
            log,
            hpLost: Math.max(0, hpStart - this.#prop.get(T.HP)),
            mpUsed: Math.max(0, mpStart - this.#prop.get(T.MP)),
        };
    }
}

export default Battle;
