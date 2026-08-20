export default class CyberProperty extends ui.view.CyberTheme.CyberPropertyUI {
    constructor() {
        super();

        const rows = { CHR: 'STR', INT: 'MHP', STR: 'MMP', MNY: 'RDM' };
        this.#types = rows;

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

    #types;
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
        this.#propertyAllocate = {
            [this.#types.CHR]: 0,
            [this.#types.INT]: 0,
            [this.#types.STR]: 0,
            [this.#types.MNY]: 0,
        }
        this.updateAllocate();
    }

    next() {
        const left = this.#propertyPoints - this.total;
        if (left > 0) {
            return $$event('message', ['F_PropertyPointLeft', left]);
        }
        const { STR, MHP, MMP, RDM } = this.#propertyAllocate;
        const propertyAllocate = { STR, MHP: MHP * 10, HP: MHP * 10, MMP: MMP * 5, MP: MMP * 5 };
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
        return this.#propertyAllocate.STR + this.#propertyAllocate.MHP
            + this.#propertyAllocate.MMP + this.#propertyAllocate.RDM;
    }

    updateAllocate() {
        const charm = this.#propertyAllocate.STR;
        const intelligence = this.#propertyAllocate.MHP;
        const strength = this.#propertyAllocate.MMP;
        const money = this.#propertyAllocate.RDM;

        this.inputCharm.text = ''+charm;
        this.inputIntelligence.text = ''+intelligence;
        this.inputStrength.text = ''+strength;
        this.inputMoney.text = ''+money;

        this.labLeftPropertyPoint.text = this.#propertyPoints - this.total;

        this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = false;
        this.btnCharmReduce.disabled = this.btnCharmReduce.gray = false;
        this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = false;
        this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = false;
        this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = false;
        this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = false;
        this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = false;
        this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = false;

        if (this.total >= this.#propertyPoints) {
            this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = true;
            this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = true;
            this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = true;
            this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = true;
        } else if (this.total <= 0) {
            this.btnCharmReduce.disabled = this.btnCharmReduce.gray = true;
            this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = true;
            this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = true;
            this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = true;
        }

        if (charm <= this.#propertyAllocateLimit[0]) {
            this.btnCharmReduce.disabled = this.btnCharmReduce.gray = true;
        } else if (charm >= this.#propertyAllocateLimit[1]) {
            this.btnCharmIncrease.disabled = this.btnCharmIncrease.gray = true;
        }

        if (intelligence <= this.#propertyAllocateLimit[0]) {
            this.btnIntelligenceReduce.disabled = this.btnIntelligenceReduce.gray = true;
        } else if (intelligence >= this.#propertyAllocateLimit[1]) {
            this.btnIntelligenceIncrease.disabled = this.btnIntelligenceIncrease.gray = true;
        }

        if (strength <= this.#propertyAllocateLimit[0]) {
            this.btnStrengthReduce.disabled = this.btnStrengthReduce.gray = true;
        } else if (strength >= this.#propertyAllocateLimit[1]) {
            this.btnStrengthIncrease.disabled = this.btnStrengthIncrease.gray = true;
        }

        if (money <= this.#propertyAllocateLimit[0]) {
            this.btnMoneyReduce.disabled = this.btnMoneyReduce.gray = true;
        } else if (money >= this.#propertyAllocateLimit[1]) {
            this.btnMoneyIncrease.disabled = this.btnMoneyIncrease.gray = true;
        }
    }

    check(left, right, value) {
        if (value < left) return false;
        if (value > right) return false;
        return true;
    }

    random() {
        let t = this.#propertyPoints;
        const arr = new Array(4).fill(this.#propertyAllocateLimit[1]);

        while (t > 0) {
            const sub = Math.round(Math.random() * (Math.min(t, this.#propertyAllocateLimit[1]) - 1)) + 1;
            while(true) {
                const select = Math.floor(Math.random() * 4) % 4;
                if(arr[select] - sub <0) continue;
                arr[select] -= sub;
                t -= sub;
                break;
            }
        }
        this.#propertyAllocate.STR = this.#propertyAllocateLimit[1] - arr[0];
        this.#propertyAllocate.MHP = this.#propertyAllocateLimit[1] - arr[1];
        this.#propertyAllocate.MMP = this.#propertyAllocateLimit[1] - arr[2];
        this.#propertyAllocate.RDM = this.#propertyAllocateLimit[1] - arr[3];

        this.updateAllocate();
    }

    createTemplates() {
        const templates = [
            ['力大砖飞', '力量 20', '#082d3b', '#55fffe', { STR: 20, MHP: 0, MMP: 0, RDM: 0 }],
            ['魔武双修', '力量 10 · 灵力 10', '#291a4a', '#b17cff', { STR: 10, MHP: 0, MMP: 10, RDM: 0 }],
            ['铁皮人', '力量 5 · 体质 15', '#3f3010', '#ffce45', { STR: 5, MHP: 15, MMP: 0, RDM: 0 }],
        ];
        const selectedTalents = this.getChildByName('selectedTalents');
        selectedTalents.y = 1550;
        selectedTalents.height = 460;
        const box = new Laya.Box();
        box.left = 40;
        box.right = 40;
        box.top = 1210;
        box.height = 330;
        const title = new Laya.Label();
        title.text = '快捷加点';
        title.font = '方正像素12';
        title.fontSize = 48;
        title.color = '#55fffe';
        title.left = 0;
        title.top = 0;
        box.addChild(title);
        templates.forEach(([label, summary, background, border, allocation], index) => {
            const card = new Laya.Box();
            card.width = 325;
            card.height = 230;
            card.left = index * 345;
            card.top = 70;
            const panel = new Laya.Sprite();
            panel.graphics.drawRect(0, 0, card.width, card.height, background, border, 3);
            card.addChild(panel);
            const name = new Laya.Label();
            name.text = label;
            name.font = '方正像素12';
            name.fontSize = 48;
            name.color = border;
            name.left = 16;
            name.right = 16;
            name.top = 20;
            name.align = 'center';
            card.addChild(name);
            const detail = new Laya.Label();
            detail.text = summary;
            detail.font = '方正像素12';
            detail.fontSize = 32;
            detail.color = '#ffffff';
            detail.left = 14;
            detail.right = 14;
            detail.top = 108;
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

        const labTitle = box.getChildByName("labTitle");
        const grade1 = box.getChildByName("grade1");
        const grade2 = box.getChildByName("grade2");
        const grade3 = box.getChildByName("grade3");
        const labDescription = box.getChildByName("labDescription");

        labTitle.text = dataSource.name;
        labDescription.text = dataSource.description;
        switch (dataSource.grade) {
            case 1:
                grade1.visible = true;
                grade2.visible = false;
                grade3.visible = false;
                break;
            case 2:
                grade1.visible = false;
                grade2.visible = true;
                grade3.visible = false;
                break;
            case 3:
                grade1.visible = false;
                grade2.visible = false;
                grade3.visible = true;
                break;
            default:
                grade1.visible = false;
                grade2.visible = false;
                grade3.visible = false;
                break;
        }
    }
}
