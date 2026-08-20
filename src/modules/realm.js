/**
 * 境界系统
 * 负责每年的修炼结算、小境界突破、大境界突破（需对应丹药）
 *
 * 大境界：1 练气 -> 2 筑基 -> 3 金丹 -> 4 元婴（通关）
 * 每个大境界有 10 个小境界（STAGE 1~10）
 */
class Realm {

    /**
     * 大境界配置表
     * base:  每层小境界所需修为 = base + 10 × 层数（各大境界基础值不同）
     *        练气：50+10n（1层60 → 10层150）；筑基：200+10n（210 → 300）
     * gain:  修炼速度倍率（每年修为 = (2 + 心境/10×2) × gain + 随机(1~5)）
     *        心境 50 时约 15/年 × gain
     * stageBonus: 每次小境界突破的属性奖励
     */
    REALMS = {
        1: {
            name: '练气',
            base: 50,
            gain: 1,
            stageBonus: { LSP: 2, MHP: 8, HP: 8, STR: 1, MMP: 4 },
        },
        2: {
            name: '筑基',
            base: 200,
            gain: 2,
            stageBonus: { LSP: 2, MHP: 15, HP: 15, STR: 3, MMP: 8 },
        },
        3: {
            name: '金丹',
            base: 500,
            gain: 3,
            stageBonus: { LSP: 2, MHP: 25, HP: 25, STR: 5, MMP: 15 },
        },
        4: {
            name: '元婴',
            base: 0,
            gain: 0,
            stageBonus: {},
        },
    };

    /**
     * 大境界突破配置（key = 目标大境界）
     * pill: 所需丹药的属性键；bonus: 突破成功的属性奖励
     */
    BREAKTHROUGH = {
        2: {
            name: '筑基',
            pill: 'PILL2',
            pillName: '筑基丹',
            bonus: { LSP: 60, MHP: 50, HP: 50, STR: 10, MMP: 30 },
        },
        3: {
            name: '金丹',
            pill: 'PILL3',
            pillName: '结金丹',
            bonus: { LSP: 100, MHP: 150, HP: 150, STR: 25, MMP: 100,
                JIN: 8, MU: 8, SHUI: 8, HUO: 8, TU: 8, MOOD: 100, ART: 5010 },
        },
        4: {
            name: '元婴',
            pill: 'PILL4',
            pillName: '元婴丹',
            bonus: { LSP: 200, MHP: 200, HP: 200, STR: 40, MMP: 120 },
        },
    };

    /** 气血/灵力 每年的自然恢复比例 */
    REGEN = { HP: 0.25, MP: 0.5 };

    /** 心境每年自然波动幅度 */
    MOOD_FLUCTUATION = 5;

    MOOD_TARGET = 60;
    MOOD_RETURN = 3;

    constructor(system) {
        this.#system = system;
    }

    #system;
    #treasures = {}; // 宝物表 { id: { cultPerYear, ... } }

    /** 加载宝物表 */
    initial({ treasures }) {
        this.#treasures = treasures || {};
    }

    /** 查询宝物 */
    treasure(id) {
        return this.#treasures[id];
    }

    get #prop() {
        return this.#system.request(this.#system.Module.PROPERTY);
    }

    name(realmId) {
        return this.REALMS[realmId]?.name || '未知';
    }

    /** 当前小境界突破所需修为（基础值 + 10 × 层数） */
    cultNeed() {
        const T = this.#prop.TYPES;
        const realm = this.#prop.get(T.REALM);
        const stage = this.#prop.get(T.STAGE);
        return this.REALMS[realm].base + 10 * stage;
    }

    /** 宝物每年固定修为修正之和 */
    treasureBonus() {
        const T = this.#prop.TYPES;
        let bonus = 0;
        for(const id of this.#prop.get(T.ART))
            bonus += Number(this.#treasures[id]?.cult) || 0;
        return bonus;
    }

    /**
     * 宗门身份与年俸（身份随境界自动晋升，只升不降）
     * 晋升门槛：练气3层→外门弟子；练气7层→内门弟子；筑基→亲传弟子
     */
    POSTS = [
        { name: '杂役',     salary: 2 },
        { name: '外门弟子', salary: 6 },
        { name: '内门弟子', salary: 12 },
        { name: '亲传弟子', salary: 25 },
        { name: '长老', salary: 100 },
    ];

    /** 当前身份名 */
    postName() {
        return this.POSTS[this.#prop.get(this.#prop.TYPES.POST)].name;
    }

    rollbackBreakthrough(realm) {
        const T = this.#prop.TYPES;
        this.#prop.set(T.REALM, realm);
        this.#prop.set(T.STAGE, 10);
    }

    /**
     * 每年修炼结算
     * 返回本年的修炼/突破结果列表：
     *   { type:'CULT',  gain }                  修为增长
     *   { type:'STAGE', realm, stage }          小境界突破
     *   { type:'REALM', realm, name }           大境界突破
     *   { type:'STUCK', pillName }              修为圆满但缺丹药
     *   { type:'POST',  post, name, salary }    身份晋升
     *   { type:'INCOME', amount }               身份年俸（灵石）
     */
    settle() {
        const T = this.#prop.TYPES;
        const results = [];
        const realm = this.#prop.get(T.REALM);
        const config = this.REALMS[realm];

        if(!config || !config.gain) return results;

        const mood = this.#prop.get(T.MOOD);
        const direction = Math.sign(this.MOOD_TARGET - mood);
        const fluctuation = direction * Math.min(this.MOOD_RETURN, Math.abs(this.MOOD_TARGET - mood))
            + Math.floor(Math.random() * (this.MOOD_FLUCTUATION * 2 + 1)) - this.MOOD_FLUCTUATION;
        if(fluctuation) this.#prop.change(T.MOOD, fluctuation);

        // 1. 气血/灵力自然恢复
        this.#prop.change(T.HP, Math.ceil(this.#prop.get(T.MHP) * this.REGEN.HP));
        this.#prop.change(T.MP, Math.ceil(this.#prop.get(T.MMP) * this.REGEN.MP));

        // 2. 修为增长：(2 + 心境/10×2) × 境界倍率 + 随机(1~5)，再叠加宝物固定修正
        const settledMood = this.#prop.get(T.MOOD);
        const gain = Math.max(1, Math.round((2 + settledMood / 10 * 2) * config.gain))
            + (1 + Math.floor(Math.random() * 5));
        this.#prop.change(T.CULT, gain);
        results.push({ type: 'CULT', gain });

        const bonus = this.treasureBonus();
        if(bonus) {
            this.#prop.change(T.CULT, bonus);
            // 宝物加成并入"修为增长"一行展示
            results.find(r => r.type === 'CULT').treasure = bonus;
        }

        // 3. 突破判定（修为足够时可连续突破）
        while(true) {
            if(!this.REALMS[this.#prop.get(T.REALM)]?.gain) break; // 结丹后不再突破
            const need = this.cultNeed();
            if(this.#prop.get(T.CULT) < need) break;

            const currentRealm = this.#prop.get(T.REALM);
            const stage = this.#prop.get(T.STAGE);

            if(stage < 10) {
                // 小境界突破
                this.#prop.change(T.CULT, -need);
                this.#prop.change(T.STAGE, 1);
                this.#prop.effect(this.REALMS[currentRealm].stageBonus);
                results.push({
                    type: 'STAGE',
                    realm: currentRealm,
                    stage: stage + 1,
                });
                continue;
            }

            // 大境界突破：需要对应丹药
            const next = this.BREAKTHROUGH[currentRealm + 1];
            if(!next) break;

            if(!next.pill || this.#prop.get(next.pill) > 0) {
                this.#prop.change(T.CULT, -need);
                if(next.pill) this.#prop.change(next.pill, -1);
                this.#prop.change(T.REALM, 1);
                this.#prop.set(T.STAGE, 1);
                this.#prop.effect(next.bonus);
                results.push({
                    type: 'REALM',
                    realm: currentRealm + 1,
                    name: next.name,
                });
                continue;
            }

            // 修为圆满但没有丹药：修为封顶，等待丹药
            this.#prop.set(T.CULT, need);
            results.push({ type: 'STUCK', pillName: next.pillName });
            break;
        }

        // 4. 身份晋升（只升不降）+ 每年俸禄
        const stageNow = this.#prop.get(T.STAGE);
        const realmNow = this.#prop.get(T.REALM);
        const targetPost = realmNow >= 3 ? 4 : realmNow >= 2 ? 3 : stageNow >= 7 ? 2 : stageNow >= 3 ? 1 : 0;
        if(targetPost > this.#prop.get(T.POST)) {
            this.#prop.set(T.POST, targetPost);
            const post = this.POSTS[targetPost];
            results.push({ type: 'POST', post: targetPost, name: post.name, salary: post.salary });
        }
        const salary = this.POSTS[this.#prop.get(T.POST)].salary;
        this.#prop.change(T.STONE, salary);
        // 俸禄并入"修为增长"一行展示
        const cultItem = results.find(r => r.type === 'CULT');
        if(cultItem) {
            cultItem.salary = salary;
            cultItem.postName = this.POSTS[this.#prop.get(T.POST)].name;
        }

        return results;
    }
}

export default Realm;
