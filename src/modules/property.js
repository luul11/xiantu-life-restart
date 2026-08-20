class Property {
    constructor(system) {
        this.#system = system;
    }

    /**
     * 属性类型表
     * 所有可在 事件/天赋 的 effect 中使用的键都在这里定义
     */
    TYPES = {
        // ==== 基础 ====
        AGE: "AGE",     // 年龄
        LSP: "LSP",     // 寿元（寿命上限，年龄达到寿元则坐化）
        CULT: "CULT",   // 修为（用于突破）
        REALM: "REALM", // 大境界：1练气 2筑基 3金丹 4元婴（元婴即通关）
        STAGE: "STAGE", // 小境界：当前大境界的层数 1~10

        // ==== 战斗 ====
        HP: "HP",       // 气血（<=0 则身亡）
        MHP: "MHP",     // 气血上限
        MP: "MP",       // 灵力
        MMP: "MMP",     // 灵力上限
        STR: "STR",     // 力量（基础攻击力）

        // ==== 五行（魔攻/魔抗）====
        JIN: "JIN",     // 金
        MU: "MU",       // 木
        SHUI: "SHUI",   // 水
        HUO: "HUO",     // 火
        TU: "TU",       // 土

        // ==== 资源 ====
        MOOD: "MOOD",   // 心境（1~100，影响修炼速度；低于50触发消费/历练事件）
        STONE: "STONE", // 灵石（货币）
        PILL2: "PILL2", // 筑基丹（练气10层 -> 筑基 必需）
        PILL3: "PILL3", // 结金丹（筑基10层 -> 结丹 必需）
        PILL4: "PILL4",
        TELE: "TELE",   // 传送符（副本重伤时保命退出）
        POST: "POST",   // 宗门身份（0杂役 1外门 2内门 3亲传；决定每年俸禄）
        // 消耗丹药（一品最好；战斗内自动使用/战后可选择使用）
        YXD1: "YXD1",   // 一品淤血丹（气血+50%上限）
        YXD2: "YXD2",   // 二品淤血丹（+35%）
        YXD3: "YXD3",   // 三品淤血丹（+20%）
        HQD1: "HQD1",   // 一品回气丹（灵力+50%上限）
        HQD2: "HQD2",   // 二品回气丹（+35%）
        HQD3: "HQD3",   // 三品回气丹（+20%）

        // ==== 收集 ====
        SKL: "SKL",     // 已学技能列表
        ART: "ART",     // 宝物列表（每年固定修正修为）

        // ==== 系统 ====
        TLT: "TLT",     // 天赋列表
        EVT: "EVT",     // 触发过的事件列表
        TMS: "TMS",     // 重开次数（localStorage 持久化）
        ACHV: "ACHV",   // 已达成成就（localStorage 持久化）
        EXT: "EXT",     // 继承天赋（localStorage 持久化）

        // ==== 特殊 ====
        RDM: "RDM",     // 随机五行属性
    };

    // 特殊类型：effect 中使用 RDM 时随机替换为五行之一
    SPECIAL = {
        RDM: [
            this.TYPES.JIN,
            this.TYPES.MU,
            this.TYPES.SHUI,
            this.TYPES.HUO,
            this.TYPES.TU,
        ]
    }

    // 可加减的数值型属性
    #NUMBERS = [
        this.TYPES.AGE, this.TYPES.LSP, this.TYPES.CULT,
        this.TYPES.REALM, this.TYPES.STAGE,
        this.TYPES.HP, this.TYPES.MHP, this.TYPES.MP, this.TYPES.MMP,
        this.TYPES.STR, this.TYPES.MOOD, this.TYPES.STONE,
        this.TYPES.JIN, this.TYPES.MU, this.TYPES.SHUI,
        this.TYPES.HUO, this.TYPES.TU,
        this.TYPES.PILL2, this.TYPES.PILL3, this.TYPES.PILL4, this.TYPES.TELE, this.TYPES.POST,
        this.TYPES.YXD1, this.TYPES.YXD2, this.TYPES.YXD3,
        this.TYPES.HQD1, this.TYPES.HQD2, this.TYPES.HQD3,
    ];

    // 当前值 <= 上限值 的钳制关系
    #CLAMP_TO = {
        [this.TYPES.HP]: this.TYPES.MHP,
        [this.TYPES.MP]: this.TYPES.MMP,
    };

    // 取值范围钳制 [min, max]
    #CLAMP_RANGE = {
        [this.TYPES.MOOD]: [1, 100],
    };

    // 列表型属性
    #LISTS = [this.TYPES.TLT, this.TYPES.EVT, this.TYPES.SKL, this.TYPES.ART];

    #system;
    #data = {};

    get #util() {
        return this.#system.function(this.#system.Function.UTIL);
    }

    initial() {}

    /** 初始属性（开局默认值，可被天赋/点数分配覆盖） */
    restart(data) {
        const T = this.TYPES;
        this.#data = {
            [T.AGE]: 16,    // 16 岁踏入修仙路
            [T.LSP]: 100,   // 凡人底子寿元 100
            [T.CULT]: 0,
            [T.REALM]: 1,   // 练气
            [T.STAGE]: 1,   // 一层
            [T.HP]: 100,
            [T.MHP]: 100,
            [T.MP]: 50,
            [T.MMP]: 50,
            [T.STR]: 5,
            [T.MOOD]: 50,
            [T.STONE]: 0,
            [T.JIN]: 0,
            [T.MU]: 0,
            [T.SHUI]: 0,
            [T.HUO]: 0,
            [T.TU]: 0,
            [T.PILL2]: 0,
            [T.PILL3]: 0,
            [T.PILL4]: 0,
            [T.TELE]: 0,
            [T.POST]: 0,
            [T.YXD1]: 0,
            [T.YXD2]: 0,
            [T.YXD3]: 0,
            [T.HQD1]: 0,
            [T.HQD2]: 0,
            [T.HQD3]: 0,
            [T.SKL]: [],
            [T.ART]: [],
            [T.TLT]: [],
            [T.EVT]: [],
        };
        for(const key in data)
            this.change(key, data[key]);
    }

    get(prop) {
        const util = this.#util;
        // 虚拟键：HPP = 当前气血占上限的百分比（供条件表达式使用，如 HPP<20）
        if(prop === 'HPP') {
            const mhp = this.#data[this.TYPES.MHP] || 1;
            return Math.round(this.#data[this.TYPES.HP] / mhp * 100);
        }
        if(this.#NUMBERS.includes(prop) || this.#LISTS.includes(prop))
            return util.clone(this.#data[prop]);
        switch(prop) {
            case this.TYPES.TMS: return this.lsget('times') || 0;
            case this.TYPES.EXT: return this.lsget('extendTalent') || null;
            case this.TYPES.ACHV: return this.lsget(prop) || [];
            default: return 0;
        }
    }

    set(prop, value) {
        if(this.#NUMBERS.includes(prop)) {
            this.#data[prop] = this.#clamp(prop, Number(value));
            return;
        }
        if(this.#LISTS.includes(prop)) {
            this.#data[prop] = this.#system.clone(value);
            return;
        }
        switch(prop) {
            case this.TYPES.TMS:
                this.lsset('times', parseInt(value) || 0);
                return;
            case this.TYPES.EXT:
                this.lsset('extendTalent', value);
                return;
            default: return;
        }
    }

    change(prop, value) {
        if(Array.isArray(value)) {
            for(const v of value) this.change(prop, Number(v));
            return;
        }
        if(this.#NUMBERS.includes(prop)) {
            this.#data[prop] = this.#clamp(prop, this.#data[prop] + Number(value));
            return;
        }
        if(this.#LISTS.includes(prop)) {
            const v = this.#data[prop];
            if(value < 0) {
                const index = v.indexOf(value);
                if(index != -1) v.splice(index, 1);
            }
            if(!v.includes(value)) v.push(value);
            return;
        }
        switch(prop) {
            case this.TYPES.TMS:
                this.set(prop, this.get(prop) + parseInt(value));
                return;
            default: return;
        }
    }

    /** 当前值不超过上限（HP<=MHP, MP<=MMP），范围值钳制（MOOD 1~100） */
    #clamp(prop, value) {
        const range = this.#CLAMP_RANGE[prop];
        if(range) value = Math.max(range[0], Math.min(range[1], value));
        const maxProp = this.#CLAMP_TO[prop];
        if(maxProp) return Math.min(value, this.#data[maxProp]);
        return value;
    }

    /** 主要属性快照（用于界面展示） */
    getPropertys() {
        const T = this.TYPES;
        return this.#system.clone({
            [T.AGE]: this.get(T.AGE),
            [T.LSP]: this.get(T.LSP),
            [T.CULT]: this.get(T.CULT),
            [T.REALM]: this.get(T.REALM),
            [T.STAGE]: this.get(T.STAGE),
            [T.HP]: this.get(T.HP),
            [T.MHP]: this.get(T.MHP),
            [T.MP]: this.get(T.MP),
            [T.MMP]: this.get(T.MMP),
            [T.STR]: this.get(T.STR),
            [T.MOOD]: this.get(T.MOOD),
            [T.STONE]: this.get(T.STONE),
            [T.JIN]: this.get(T.JIN),
            [T.MU]: this.get(T.MU),
            [T.SHUI]: this.get(T.SHUI),
            [T.HUO]: this.get(T.HUO),
            [T.TU]: this.get(T.TU),
            [T.PILL2]: this.get(T.PILL2),
            [T.PILL3]: this.get(T.PILL3),
            [T.TELE]: this.get(T.TELE),
            [T.POST]: this.get(T.POST),
            [T.YXD1]: this.get(T.YXD1),
            [T.YXD2]: this.get(T.YXD2),
            [T.YXD3]: this.get(T.YXD3),
            [T.HQD1]: this.get(T.HQD1),
            [T.HQD2]: this.get(T.HQD2),
            [T.HQD3]: this.get(T.HQD3),
            [T.SKL]: this.get(T.SKL),
            [T.ART]: this.get(T.ART),
        });
    }

    hookSpecial(prop) {
        switch(prop) {
            case this.TYPES.RDM:
                return this.#util.listRandom(this.SPECIAL.RDM);
            default: return prop;
        }
    }

    /** 应用 effect 对象，如 { CULT: 20, HP: -10, RDM: 1 } */
    effect(effects) {
        for(let prop in effects)
            this.change(
                this.hookSpecial(prop),
                Number(effects[prop])
            );
    }

    /** 年龄 +1，返回新年龄 */
    ageNext() {
        this.change(this.TYPES.AGE, 1);
        return this.get(this.TYPES.AGE);
    }

    /** 成就持久化 */
    achieve(prop, newData) {
        if(prop !== this.TYPES.ACHV) return;
        const lastData = this.lsget(prop);
        this.lsset(
            prop,
            (lastData || []).concat([[newData, Date.now()]])
        );
    }

    lsget(key) {
        const data = localStorage.getItem(key);
        if(data === null || data === 'undefined') return;
        return JSON.parse(data);
    }

    lsset(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }
}

export default Property;
