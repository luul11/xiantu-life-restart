export default class Property extends ui.view.DefaultTheme.PropertyUI {
    static #ROW_MAP = {
        CHR: 'STR',
        INT: 'MHP',
        STR: 'MMP',
        MNY: 'RDM',
    };

    constructor() {
        super();

        const rows = Property.#ROW_MAP;

        this.btnCharmIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.CHR, 1]);
        this.btnCharmReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.CHR, -1]);

        this.btnIntelligenceIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.INT, 1]);
        this.btnIntelligenceReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.INT, -1]);

        this.btnStrengthIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.STR, 1]);
        this.btnStrengthReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.STR, -1]);

        this.btnMoneyIncrease.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.MNY, 1]);
        this.btnMoneyReduce.on(Laya.Event.CLICK, this, this.onPropertyAllocate, [rows.MNY, -1]);

        this.inputCharm.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [rows.CHR]);
        this.inputIntelligence.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [rows.INT]);
        this.inputStrength.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [rows.STR]);
        this.inputMoney.on(Laya.Event.INPUT, this, this.onPropertyAllocateInput, [rows.MNY]);

        const selectAll = ({currentTarget: item}) => { item.text=''; };
        this.inputCharm.on(Laya.Event.MOUSE_DOWN, this, selectAll);
        this.inputIntelligence.on(Laya.Event.MOUSE_DOWN, this, selectAll);
        this.inputStrength.on(Laya.Event.MOUSE_DOWN, this, selectAll);
        this.inputMoney.on(Laya.Event.MOUSE_DOWN, this, selectAll);

        this.btnRandomAllocate.on(Laya.Event.CLICK, this, this.random);
        this.btnNext.on(Laya.Event.CLICK, this, this.next);

        this.listSelectedTalents.renderHandler = Laya.Handler.create(this, this.renderTalent, null, false);
        this.createTemplates();
    }

    #propertyPoints;
    #propertyAllocate;
    #propertyAllocateLimit;

    init({talents}) {
        this.listSelectedTalents.array = talents;
        const replace = core.remake(talents.map(talent => talent.id));
        if(replace.length > 0) {
            $$event('message', [replace.map(v => ['F_TalentReplace', v])]);
        }
        this.#propertyPoints = core.getPropertyPoints();
        this.#propertyAllocateLimit = core.propertyAllocateLimit;
        this.labLeftPropertyPoint.text = this.#propertyPoints;
        this.#propertyAllocate = { STR: 0, MHP: 0, MMP: 0, RDM: 0 };
        this.updateAllocate();
    }

    next() {
        const left = this.#propertyPoints - this.total;
        if (left > 0) {
            return $$event('message', ['F_PropertyPointLeft', left]);
        }

        const { STR, MHP, MMP, RDM } = this.#propertyAllocate;
        const propertyAllocate = {
            STR,
            MHP: MHP * 10,
            HP: MHP * 10,
            MMP: MMP * 5,
            MP: MMP * 5,
        };
        const elements = ['JIN', 'MU', 'SHUI', 'HUO', 'TU'];
        for(let i = 0; i < RDM; i++) {
            const elem = elements[Math.floor(Math.random() * elements.length)];
            propertyAllocate[elem] = (propertyAllocate[elem] || 0) + 1;
        }

        $ui.switchView(
            UI.pages.TRAJECTORY,
            {
                propertyAllocate,
                talents: this.listSelectedTalents.array,
                enableExtend: true,
            }
        );
    }

    get total() {
        return this.#propertyAllocate.STR
            +  this.#propertyAllocate.MHP
            +  this.#propertyAllocate.MMP
            +  this.#propertyAllocate.RDM;
    }

    updateAllocate() {
        this.inputCharm.text = ''+this.#propertyAllocate.STR;
        this.inputIntelligence.text = ''+this.#propertyAllocate.MHP;
        this.inputStrength.text = ''+this.#propertyAllocate.MMP;
        this.inputMoney.text = ''+this.#propertyAllocate.RDM;

        this.labLeftPropertyPoint.text = this.#propertyPoints - this.total;

        this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = false;
        this.btnCharmReduce.disabled = this.btnCharmReduce.gray = false;
        this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = false;
        this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = false;
        this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = false;
        this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = false;
        this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = false;
        this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = false;
    }

    check(left, right, value) {
        if (value < left) return false;
        if (value > right) return false;
        return true;
    }

    random() {
        let t = this.#propertyPoints;
        const keys = ['STR', 'MHP', 'MMP', 'RDM'];
        for(const key of keys) this.#propertyAllocate[key] = 0;
        while (t > 0) {
            const key = keys[Math.floor(Math.random() * keys.length)];
            if(this.#propertyAllocate[key] >= this.#propertyAllocateLimit[1]) continue;
            this.#propertyAllocate[key]++;
            t--;
        }
        this.updateAllocate();
    }

    createTemplates() {
        const templates = [
            ['力大砖飞', '力量 20', '#334e68', '#7ec8ff', { STR: 20, MHP: 0, MMP: 0, RDM: 0 }],
            ['魔武双修', '力量 10 · 灵力 10', '#4b3b63', '#d5a8ff', { STR: 10, MHP: 0, MMP: 10, RDM: 0 }],
            ['铁皮人', '力量 5 · 体质 15', '#5a4327', '#ffd166', { STR: 5, MHP: 15, MMP: 0, RDM: 0 }],
        ];
        const box = new Laya.Box();
        box.left = 40;
        box.right = 40;
        box.top = 1340;
        box.height = 330;
        const title = new Laya.Label();
        title.text = '快捷加点';
        title.font = 'SimHei';
        title.fontSize = 52;
        title.color = '#ffffff';
        title.left = 0;
        title.top = 0;
        box.addChild(title);
        templates.forEach(([label, summary, background, border, allocation], index) => {
            const card = new Laya.Box();
            card.width = 325;
            card.height = 230;
            card.left = index * 345;
            card.top = 82;
            const panel = new Laya.Sprite();
            panel.graphics.drawRect(0, 0, card.width, card.height, background, border, 3);
            card.addChild(panel);
            const name = new Laya.Label();
            name.text = label;
            name.font = 'SimHei';
            name.fontSize = 48;
            name.color = '#ffffff';
            name.left = 20;
            name.right = 20;
            name.top = 24;
            name.align = 'center';
            card.addChild(name);
            const detail = new Laya.Label();
            detail.text = summary;
            detail.font = 'SimHei';
            detail.fontSize = 32;
            detail.color = '#ffffff';
            detail.left = 16;
            detail.right = 16;
            detail.top = 112;
            detail.height = 100;
            detail.align = 'center';
            detail.wordWrap = true;
            card.addChild(detail);
            card.on(Laya.Event.CLICK, this, this.applyTemplate, [allocation]);
            box.addChild(card);
        });
        this.addChild(box);
    }

    applyTemplate(template) {
        const allocation = {};
        let left = this.#propertyPoints;
        for(const type of ['STR', 'MHP', 'MMP', 'RDM']) {
            const value = Math.min(template[type], this.#propertyAllocateLimit[1], left);
            allocation[type] = Math.max(value, this.#propertyAllocateLimit[0]);
            left -= allocation[type];
        }
        for(const type of ['STR', 'MHP', 'MMP', 'RDM']) {
            if(left <= 0) break;
            const value = Math.min(this.#propertyAllocateLimit[1] - allocation[type], left);
            allocation[type] += value;
            left -= value;
        }
        this.#propertyAllocate = allocation;
        this.updateAllocate();
    }

    onPropertyAllocate(type, value) {
        if (!this.check(
                this.#propertyAllocateLimit[0],
                this.#propertyAllocateLimit[1],
                this.#propertyAllocate[type] + value
        )) {
            return;
        }
        if (!this.check(
            0,
            this.#propertyPoints,
            this.total + value
        )) {
            return;
        }
        this.#propertyAllocate[type] += value;
        this.updateAllocate();
    }

    onPropertyAllocateInput(type, inputItem) {
        let value = parseInt(inputItem.text) || 0;
        const total = this.total;
        if (total + value < 0) {
            value = this.#propertyAllocateLimit[0] * 4 - total;
        } else if (total + value > this.#propertyPoints) {
            value = this.#propertyPoints - total;
        }

        if (value < this.#propertyAllocateLimit[0]) {
            value = this.#propertyAllocateLimit[0];
        } else if (value > this.#propertyAllocateLimit[1]) {
            value = this.#propertyAllocateLimit[1];
        }


        const alter = value - this.#propertyAllocate[type];
        if (alter) {
            this.onPropertyAllocate(type, alter);
        } else {
            this.updateAllocate();
        }
    }

    renderTalent(box) {
        const dataSource = box.dataSource;

        box.label = $_.format($lang.F_TalentSelection, dataSource);
        const style = $ui.common.card[dataSource.grade].normal;

        $_.deepMapSet(box, style);
    }
}
