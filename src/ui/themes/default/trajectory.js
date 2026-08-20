export default class Trajectory extends ui.view.DefaultTheme.TrajectoryUI {
    constructor() {
        super();
        let pos1 = [0, 0];
        this.panelTrajectory.on(Laya.Event.MOUSE_DOWN, this, e => pos1 = [e.stageX, e.stageY]);
        this.panelTrajectory.on(Laya.Event.MOUSE_UP, this, e => {
            // 滚动条、战斗明细条目上的操作不触发下一年
            let node = e.target;
            while(node) {
                if(node === this.panelTrajectory.vScrollBar || node.isBattleItem) return;
                node = node.parent;
            }
            const distanceX = e.stageX - pos1[0];
            const distanceY = e.stageY - pos1[1];
            if(Math.sqrt(Math.abs(distanceX) + Math.abs(distanceY)) > 10) {
                return;
            }
            this.onNext();
        });
        this.btnSummary.on(Laya.Event.CLICK, this, this.onSummary);

        this.panelTrajectory.vScrollBar.elasticDistance = 150;
        this.scbSpeed.on(Laya.Event.CHANGE, this, () => this.speed = this.scbSpeed.value);
        this.scbSpeed.on(Laya.Event.MOUSE_UP, this, () => this.onNext());

        // 顶部属性条表头与数值对应（i18n 键被属性分配页共用，这里按页内文本直接改）
        const rename = {
            [$lang.UI_Property_Strength]: '气血',
            [$lang.UI_Property_Money]: '灵石',
            [$lang.UI_Property_Spirit]: '灵力',
        };
        const walk = node => {
            for(const child of node._childs || []) {
                if(child instanceof Laya.Label && rename[child.text])
                    child.text = rename[child.text];
                walk(child);
            }
        };
        walk(this);

        // 顶栏最前插入「境界」槽位（样式对齐其他属性槽；6 槽位均分宽度，避免溢出）
        const header = this.labCharm.parent.parent.parent; // labCharm → propertyValue → propertyBox → HBox
        for(const box of header._childs) {
            box.width = 170;
            box.getChildByName('propertyValue').getChildByName('label').fontSize = 46;
        }
        const realmSlot = new Laya.runtime.ColorfulBox();
        realmSlot.name = 'propertyBox';
        realmSlot.size(170, 120);
        realmSlot.centerY = 0;
        $_.deepMapSet(realmSlot, {
            defaultColor: '#222831', defaultStroke: '#eeeeee',
            hoverColor: '#222831', hoverStroke: '#eeeeee',
            lineWidth: 2, radius: 4,
        });
        const realmTitle = new Laya.Label('境界');
        realmTitle.fontSize = 45;
        realmTitle.color = '#ffffff';
        realmTitle.y = 30;
        realmTitle.centerX = 0;
        realmTitle.anchorX = 0.5;
        realmTitle.anchorY = 0.5;
        realmSlot.addChild(realmTitle);
        const realmValueBox = new Laya.runtime.ColorfulBox();
        realmValueBox.name = 'propertyValue';
        realmValueBox.left = 0;
        realmValueBox.right = 0;
        realmValueBox.height = 60;
        realmValueBox.bottom = 0;
        $_.deepMapSet(realmValueBox, {
            defaultColor: '#eeeeee', defaultStroke: '#eeeeee',
            hoverColor: '#eeeeee', hoverStroke: '#eeeeee',
            lineWidth: 0, radius: 4,
        });
        const realmValue = new Laya.Label('练气1层');
        realmValue.fontSize = 40;
        realmValue.color = '#222831';
        realmValue.centerX = 0;
        realmValue.centerY = 0;
        realmValue.anchorX = 0.5;
        realmValue.anchorY = 0.5;
        realmValueBox.addChild(realmValue);
        realmSlot.addChild(realmValueBox);
        header.addChildAt(realmSlot, 0);
        this.labRealm = realmValue;

        // 「属性」按钮（融入顶部属性条风格）+ 属性/战斗面板 + 交互选择按钮
        this.#btnAttribute = this.#createButton('属性', () => this.toggleAttributePanel());
        this.#btnAttribute.right = 40;
        this.#btnAttribute.top = 20;
        $_.deepMapSet(this.#btnAttribute, {
            defaultColor: '#222831',
            defaultStroke: '#eeeeee',
            defaultLabel: '#eeeeee',
            hoverColor: '#3a4250',
            hoverStroke: '#eeeeee',
            hoverLabel: '#eeeeee',
            lineWidth: 2,
            radius: 4,
        });
        this.addChild(this.#btnAttribute);

        this.#attributePanel = this.#createTextPanel(1300, 1150);
        this.#attributePanel.visible = false;
        this.addChild(this.#attributePanel);

        // 战斗明细面板：羊皮纸配色，显示时停靠右侧栏目；带关闭按钮与滚动条
        this.#battlePanel = this.#createBattlePanel();
        this.#battlePanel.visible = false;
        this.addChild(this.#battlePanel);

        this.#choiceBox = new Laya.HBox();
        this.#choiceBox.space = 40;
        this.#choiceBox.centerX = 0;
        this.#choiceBox.bottom = 180;
        this.#choiceBox.visible = false;
        this.addChild(this.#choiceBox);
    }

    #speed;
    #auto;
    #waiting = false; // 等待玩家做出选择（副本/闭关）
    #btnAttribute;    // 「属性」按钮
    #attributePanel;  // 属性面板
    #battlePanel;     // 战斗明细面板
    #choiceBox;       // 交互选择按钮容器

    static load() {
        return [
            "images/atlas/images/progress.atlas",
            'images/atlas/images/slider.atlas',
        ];
    }

    static #createComponent = Laya.plugin.extractComponents(Trajectory.uiView, ['boxTrajectoryItem']);
    #createTrajectoryItem() {
        const item = Trajectory.#createComponent('boxTrajectoryItem');
        item.labContent = item.getChildByName('labContent');
        item.labAge = item.getChildByName('hboxAge').getChildByName('labAge');
        const config = $ui.common.trajectoryItem;
        $_.deepMapSet(item, config.box);
        item.grade = grade => {
            $_.deepMapSet(item, config.grade[grade || 0]);
        }
        item.getChildByName('hboxAge')._childs.forEach(child => child.color = config.ageColor);
        item.labContent.color = config.contentColor;
        return item;
    }

    /** 创建一个带文字的按钮（设计分辨率 1827×2438，字号对齐原生 UI） */
    #createButton(text, onClick) {
        const btn = new Laya.runtime.ColorfulBox();
        btn.size(360, 110);
        const label = new Laya.Label(text);
        label.name = 'label';
        label.fontSize = 44;
        btn.addChild(label);
        label.centerX = 0;
        label.centerY = 0;
        $_.deepMapSet(btn, {
            defaultColor: '#5865f2',
            defaultStroke: '#eeeeee',
            defaultLabel: '#eeeeee',
            hoverColor: '#1160b0',
            hoverStroke: '#eeeeee',
            hoverLabel: '#eeeeee',
            lineWidth: 2,
            radius: 8,
        });
        btn.on(Laya.Event.CLICK, this, onClick);
        return btn;
    }

    /** 通用文本面板（点击任意处关闭），属性/战斗明细共用；羊皮纸深黄底+米白字 */
    #createTextPanel(width, height, center = true) {
        const panel = new Laya.runtime.ColorfulBox();
        panel.size(width, height);
        if(center) {
            panel.centerX = 0;
            panel.centerY = 0;
        }
        panel.zOrder = 10;
        $_.deepMapSet(panel, {
            defaultColor: '#7d6538',
            defaultStroke: '#c9b58a',
            hoverColor: '#7d6538',
            hoverStroke: '#c9b58a',
            lineWidth: 4,
            radius: 16,
        });
        const label = new Laya.Label();
        label.name = 'label';
        label.fontSize = 42;
        label.leading = 32;
        label.color = '#f5efdc';
        label.pos(50, 50);
        label.width = width - 100;
        label.wordWrap = true;
        panel.addChild(label);
        panel.labText = label;
        panel.on(Laya.Event.CLICK, this, () => panel.visible = false);
        return panel;
    }

    /** 战斗明细面板：标题 + 右上角关闭按钮 + 可滚动内容区 */
    #createBattlePanel() {
        const width = 860, height = 1800;
        const panel = new Laya.runtime.ColorfulBox();
        panel.size(width, height);
        panel.zOrder = 10;
        $_.deepMapSet(panel, {
            defaultColor: '#7d6538',
            defaultStroke: '#c9b58a',
            hoverColor: '#7d6538',
            hoverStroke: '#c9b58a',
            lineWidth: 4,
            radius: 16,
        });

        const title = new Laya.Label('⚔ 战斗明细');
        title.fontSize = 46;
        title.bold = true;
        title.color = '#f5efdc';
        title.pos(50, 36);
        panel.addChild(title);

        // 右上角关闭按钮
        const btnClose = new Laya.Label('✕');
        btnClose.fontSize = 56;
        btnClose.bold = true;
        btnClose.color = '#f5efdc';
        btnClose.size(80, 80);
        btnClose.pos(width - 110, 24);
        btnClose.align = 'center';
        btnClose.valign = 'middle';
        btnClose.on(Laya.Event.CLICK, this, e => {
            e.stopPropagation();
            panel.visible = false;
        });
        panel.addChild(btnClose);

        // 可滚动内容区：可见可拖拽的垂直滚动条（触屏友好）+ 内容拖动/滚轮滚动
        const scroll = new Laya.Panel();
        scroll.size(width - 100, height - 200);
        scroll.pos(50, 130);
        scroll.vScrollBarSkin = 'images/slider/vslider_1@3x.png';
        scroll.scrollType = 2; // ScrollType.Vertical（该 Laya 精简版未导出枚举，2 = 垂直滚动）
        scroll.vScrollBar.elasticDistance = 100;
        scroll.vScrollBar.visible = true;
        const label = new Laya.Label();
        label.fontSize = 42;
        label.leading = 32;
        label.color = '#f5efdc';
        label.width = width - 140;
        label.wordWrap = true;
        scroll.addChild(label);
        panel.addChild(scroll);
        panel.labText = label;
        panel.scrollPanel = scroll;
        // 仅点击面板空白背景时关闭（滚动条/内容区的拖拽与点击不触发）
        panel.on(Laya.Event.CLICK, this, e => {
            if(e.target !== panel) return;
            panel.visible = false;
        });
        return panel;
    }

    toggleAttributePanel() {
        const panel = this.#attributePanel;
        panel.visible = !panel.visible;
        if(!panel.visible) return;
        const p = core.propertys;
        const skills = (p.SKL || []).map(id => core.skill(id)?.name).filter(Boolean);
        const treasures = (p.ART || []).map(id => {
            const t = core.treasure(id);
            return t ? `${t.name}（${t.cult > 0 ? '+' : ''}${t.cult}/年）` : null;
        }).filter(Boolean);
        panel.labText.text = [
            `【境界】${core.realmName()} ${p.STAGE} 层　修为 ${p.CULT}/${core.cultNeed()}`,
            `【身份】${core.postName()}（年俸 ${[2,6,12,25][p.POST]} 灵石）`,
            `【年龄】${p.AGE} 岁 / 寿元 ${p.LSP}`,
            `【气血】${p.HP}/${p.MHP}　【灵力】${p.MP}/${p.MMP}`,
            `【力量】${p.STR}　【心境】${p.MOOD}　【灵石】${p.STONE}`,
            `【五行】金${p.JIN} 木${p.MU} 水${p.SHUI} 火${p.HUO} 土${p.TU}`,
            `【丹符】筑基丹×${p.PILL2}　结金丹×${p.PILL3}　传送符×${p.TELE}`,
            `【丹药】淤血丹 ${p.YXD1}/${p.YXD2}/${p.YXD3}（一/二/三品）　回气丹 ${p.HQD1}/${p.HQD2}/${p.HQD3}`,
            `【技能】${skills.join('、') || '无'}`,
            `【宝物】${treasures.join('、') || '无'}`,
            '',
            '（点击任意处关闭）',
        ].join('\n');
    }

    /** 打开战斗明细面板（停靠右侧栏目） */
    showBattlePanel(battleLog) {
        const panel = this.#battlePanel;
        panel.x = Math.max(0, this.width - panel.width - 60);
        panel.y = Math.max(60, (this.height - panel.height) / 2);
        panel.labText.text = battleLog.join('\n');
        panel.visible = true;
        // 打开时滚动到最新（底部），直接看到战斗结局；布局异步，等 2 帧再滚
        Laya.timer.frameOnce(2, this, () => {
            panel.scrollPanel.refresh();
            panel.scrollPanel.scrollTo(0, panel.scrollPanel.contentHeight);
        });
    }

    #isEnd;
    #trajectoryItems;
    #talents;
    #enableExtend;

    init({propertyAllocate, talents, enableExtend}) {
        this.#enableExtend = enableExtend;
        this.boxParticle.visible = false;
        this.boxSpeed.visible = true;
        this.btnSummary.visible = false;
        this.#choiceBox.visible = false;
        this.#attributePanel.visible = false;
        this.#battlePanel.visible = false;
        this.#waiting = false;
        this.#trajectoryItems = [];
        this.#isEnd = false;
        this.#talents = talents;
        core.start(propertyAllocate);
        this.updateProperty();
        this.onNext();
    }

    close() {
        this.scbSpeed.value = 0;
        this.speed = 0;
        this.#trajectoryItems.forEach(item => {
            item.removeSelf();
            item.destroy();
        });
        this.#trajectoryItems = null;
    }

    updateProperty() {
        const propertys = core.propertys;

        // 6 个属性槽位：境界 / 力量 / 心境 / 气血 / 灵石 / 灵力
        this.labRealm.text = `${core.realmName()}${propertys.STAGE}层`;
        this.labCharm.text = propertys.STR;
        this.labIntelligence.text = propertys.MOOD;
        this.labStrength.text = `${propertys.HP}/${propertys.MHP}`;
        this.labMoney.text = propertys.STONE;
        this.labSpirit.text = `${propertys.MP}/${propertys.MMP}`;
    }

    applyDisplayScale(scale) {
        const header = this.labCharm.parent.parent.parent;
        const slotWidth = scale >= 1.4 ? 165 : 170;
        const titleSize = scale >= 1.4 ? 42 : 45;
        const valueSize = scale >= 1.4 ? 44 : 46;
        for(const box of header._childs || []) {
            box.width = slotWidth;
            const value = box.getChildByName('propertyValue');
            const label = value?.getChildByName('label');
            if(label) label.fontSize = valueSize;
        }
        this.labRealm.fontSize = scale >= 1.4 ? 38 : 40;
        const title = this.labRealm.parent.parent.parent.getChildByName('label');
        if(title) title.fontSize = titleSize;
    }

    onNext() {
        if(this.#isEnd || this.#waiting) return;
        this.#applyResult(core.next());
    }

    /** 玩家做出选择（副本前进/撤离、闭关是/否） */
    onChoice(index) {
        this.#choiceBox.visible = false;
        this.#waiting = false;
        this.#applyResult(core.choose(index));
    }

    /** 渲染一年/一次选择的结果 */
    #applyResult({ age, content, isEnd, needChoice }) {
        this.#isEnd = isEnd;

        // 有选择时为选项按钮预留底部空间（避免与事件列表重叠），否则还原
        this.panelTrajectory.bottom = needChoice ? 320 : 0;

        if(content.length) {
            this.renderTrajectory(age, content);
            // 先渲染本年内容，再滚动到底部（VBox 布局是异步的，等 2 帧确保高度准确）
            Laya.timer.frameOnce(2, this, ()=>{
                this.panelTrajectory.scrollTo(0, this.panelTrajectory.contentHeight);
            });
        }

        // 等待玩家选择：弹出选项按钮，暂停自动播放
        if(needChoice) {
            this.#waiting = true;
            this.#showChoices();
            this.updateProperty();
            return;
        }

        if(isEnd) {
            this.boxSpeed.visible = false;
            this.btnSummary.visible = true;
        }

        if(age >= 100) {
            this.boxParticle.visible = true;
        }
        this.updateProperty();
    }

    /** 弹出交互选择按钮 */
    #showChoices() {
        const pending = core.pendingChoice;
        if(!pending) return;
        this.#choiceBox.removeChildren();
        pending.options.forEach((option, i) => {
            this.#choiceBox.addChild(
                this.#createButton(option.label, () => this.onChoice(i))
            );
        });
        this.#choiceBox.visible = true;
    }

    renderTrajectory(age, content) {
        const item = this.#createTrajectoryItem();
        item.labAge.text = ''+age;
        item.labContent.text = content
            .map(c => core.contentToText(c))
            .filter(Boolean)
            .join('\n');
        // 盒子颜色取本年最高品级的内容
        const gradeOf = c => {
            switch(c.type) {
                case 'REALM': case 'WIN': return 4;
                case 'STAGE': return 3;
                case 'CHOICE': return 2;
                case 'STUCK': case 'TREASURE': return 1;
                case 'POST': return 2;
                case 'BATTLE': case 'EVT': return c.grade || 0;
                default: return 0;
            }
        };
        item.grade(content.reduce((g, c) => Math.max(g, gradeOf(c)), 0));

        // 含战斗的年份：附提示，点击此条打开战斗明细（不触发下一年）
        const battleLog = content.flatMap(c => c.battleLog || []);
        if(battleLog.length) {
            item.labContent.text += '\n⚔ （点击此条查看战斗明细）';
            item.isBattleItem = true;
            item.on(Laya.Event.CLICK, this, () => this.showBattlePanel(battleLog));
        }

        this.vboxTrajectory.addChild(item);
        this.#trajectoryItems.push(item);
        item.y = this.vboxTrajectory.height;
    }

    onSummary() {
        const talents = this.#talents;
        $ui.switchView(UI.pages.SUMMARY, {talents, enableExtend: this.#enableExtend});
    }

    get speed() {
        return this.#speed;
    }

    set speed(speed) {
        this.#speed = speed;
        this.prgSpeed.value = speed / this.scbSpeed.max;
        clearInterval(this.#auto);
        this.#auto = null;
        if(!speed) return;
        this.#auto = setInterval(
            () => this.onNext(),
            3000 * (1 - this.prgSpeed.value) + 300
        );
    }
}
