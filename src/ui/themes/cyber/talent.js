import { talentDetails, talentSummary } from '../talentInfo.js';

export default class CyberTalent extends ui.view.CyberTheme.CyberTalentUI {
    constructor() {
        super();
        this.btnDrawCard.on(Laya.Event.CLICK, this, this.onClickDrawCard);
        this.btnNext.on(Laya.Event.CLICK, this, this.onClickNext);
        this.listTalents.renderHandler = Laya.Handler.create(this, this.renderTalent, null, false);
        this.listTalents.scrollBar.elasticDistance = 150;
        this.createRedrawButton();
        this.on(Laya.Event.RESIZE, this, () => {
            const renderWidth = this.listTalents?._itemRender?.props?.width;
            if(renderWidth) {
                const col = Math.max(Math.floor((this.width - 40) / renderWidth), 1);
                this.listTalents.width = col * renderWidth + (col - 1) * (this.listTalents.spaceY || 0);
            }
        });
    }

    #selected = new Set();
    #detailBox;
    static load() {
        return ['images/background/background_2@3x.png'];
    }

    init() {
        this.pageDrawCard.visible = true;
        this.pageResult.visible = false;
        this.btnNext.label = 'UI_Talent_Select_Uncomplete';
        this.#selected.clear();
        this.btnRedraw.visible = false;
        this.updateTalentDetail();
    }

    close() {}

    onClickDrawCard() {
        this.pageDrawCard.visible = false;
        this.pageResult.visible = true;
        this.listTalents._itemRender.height = 460;
        this.listTalents.spaceY = 20;
        this.listTalents.bottom = 690;
        this.listTalents.array = core.talentRandom();
        this.btnRedraw.visible = true;
        this.createTalentDetail();
    }

    onClickNext() {
        if(this.#selected.size < core.talentSelectLimit) {
            return $$event('message', ['F_TalentSelectNotComplect', core.talentSelectLimit]);
        }

        const talents = [...this.#selected].map(index => this.listTalents.array[index]);
        $ui.switchView(UI.pages.PROPERTY, { talents, enableExtend: true});
    }

    createRedrawButton() {
        this.btnRedraw = new Laya.Button();
        this.btnRedraw.label = '重抽';
        this.btnRedraw.labelSize = 48;
        this.btnRedraw.width = 220;
        this.btnRedraw.height = 90;
        this.btnRedraw.right = 40;
        this.btnRedraw.top = 210;
        this.btnRedraw.skin = 'images/button/button_small@3x.png';
        this.btnRedraw.on(Laya.Event.CLICK, this, this.onClickRedraw);
        this.pageResult.addChild(this.btnRedraw);
    }

    onClickRedraw() {
        this.#selected.clear();
        this.btnNext.label = 'UI_Talent_Select_Uncomplete';
        this.listTalents.array = core.talentRandom();
        this.listTalents.refresh();
        this.updateTalentDetail();
    }

    renderTalent(box, index) {
        const dataSource = box.dataSource;

        const hboxTitle = box.getChildByName("hboxTitle");
        const labTitle = hboxTitle.getChildByName("labTitle");
        const grades = hboxTitle.getChildByName("grades");
        const grade1 = grades.getChildByName("grade1");
        const grade2 = grades.getChildByName("grade2");
        const grade3 = grades.getChildByName("grade3");
        const labDescription = box.getChildByName("labDescription");
        const unselected = box.getChildByName("unselected");
        const selected = box.getChildByName("selected");
        const grade = Math.min(Math.max(Number(dataSource.grade) || 0, 0), 3);
        const gradeColors = [
            { background: '#111111', hover: '#252525', text: '#f5f5f5', border: '#8a8a8a' },
            { background: '#ffffff', hover: '#e6e6e6', text: '#111111', border: '#777777' },
            { background: '#238636', hover: '#3fb950', text: '#ffffff', border: '#d8ffe3' },
            { background: '#ff9800', hover: '#ffb74d', text: '#321900', border: '#6b3500' },
        ];
        const palette = gradeColors[grade];

        grade1.getChildAt(0).getChildAt(0).fillColor = gradeColors[1].text;
        grade2.getChildAt(0).getChildAt(0).fillColor = gradeColors[2].border;
        grade3.getChildAt(0).getChildAt(0).fillColor = gradeColors[3].hover;

        switch (grade) {
            case 1:
                grades.x = 0;
                labTitle.x = 1;
                grade1.visible = true;
                grade2.visible = false;
                grade3.visible = false;
                break;
            case 2:
                grades.x = 0;
                labTitle.x = 1;
                grade1.visible = false;
                grade2.visible = true;
                grade3.visible = false;
                break;
            case 3:
                grades.x = 0;
                labTitle.x = 1;
                grade1.visible = false;
                grade2.visible = false;
                grade3.visible = true;
                break;
            default:
                grades.x = 1;
                labTitle.x = 0;
                grade1.visible = false;
                grade2.visible = false;
                grade3.visible = false;
                break;
        }
        labTitle.text = dataSource.name;
        labTitle.color = palette.text;
        labDescription.color = palette.text;
        let gradeBackground = box.getChildByName('gradeBackground');
        if(!gradeBackground) {
            gradeBackground = new Laya.Sprite();
            gradeBackground.name = 'gradeBackground';
            box.addChildAt(gradeBackground, 0);
        }
        const selectedState = this.#selected.has(index);
        const background = selectedState ? palette.hover : palette.background;
        const border = selectedState ? '#66ffff' : palette.border;
        gradeBackground.graphics.clear();
        gradeBackground.graphics.drawRect(2, 2, box.width - 4, box.height - 4, background, border, selectedState ? 6 : 3);
        gradeBackground.zOrder = -100;
        let gradeGlow = box.getChildByName('gradeGlow');
        if(!gradeGlow) {
            gradeGlow = new Laya.Sprite();
            gradeGlow.name = 'gradeGlow';
            box.addChild(gradeGlow);
        }
        gradeGlow.graphics.clear();
        gradeGlow.graphics.drawRect(2, 2, box.width - 4, box.height - 4, null, palette.border, 3);
        gradeGlow.zOrder = 100;
        labTitle.event(Laya.Event.RESIZE);
        labDescription.visible = false;
        box.height = 460;
        unselected.visible = !( selected.visible = selectedState );
        const updateHover = hovered => {
            const active = this.#selected.has(index);
            gradeBackground.graphics.clear();
            gradeBackground.graphics.drawRect(2, 2, box.width - 4, box.height - 4,
                hovered || active ? palette.hover : palette.background,
                active ? '#66ffff' : palette.border,
                active ? 6 : 3);
        };
        box.offAll(Laya.Event.MOUSE_OVER);
        box.offAll(Laya.Event.MOUSE_OUT);
        box.on(Laya.Event.MOUSE_OVER, this, updateHover, [true]);
        box.on(Laya.Event.MOUSE_OUT, this, updateHover, [false]);
        box.offAll(Laya.Event.CLICK);
        box.on(Laya.Event.CLICK, this, () => {
            if(this.#selected.has(index)) {
                this.#selected.delete(index);
                this.updateTalentDetail();
            } else {
                if(this.#selected.size >= core.talentSelectLimit) {
                    this.listTalents.refresh();
                    return $$event('message', ['F_TalentSelectLimit', core.talentSelectLimit]);
                }
                const exclusive = core.exclude(
                    [...this.#selected].map(index => this.listTalents.array[index].id),
                    this.listTalents.array[index].id
                );
                if(exclusive != null) {
                    for(const {name, id} of this.listTalents.array) {
                        if(exclusive == id) {
                            this.listTalents.refresh();
                            return $$event('message', ['F_TalentConflict', name]);
                        }
                    }
                    this.listTalents.refresh();
                    return;
                }
                this.#selected.add(index);
                this.updateTalentDetail(dataSource);
            }

            this.btnNext.label = this.#selected.size === core.talentSelectLimit
                ? 'UI_Next'
                : 'UI_Talent_Select_Uncomplete';
            this.listTalents.refresh();
        });
    }

    createTalentDetail() {
        if(this.#detailBox) return;
        const box = this.#detailBox = new Laya.Box();
        box.name = 'talentDetail';
        box.top = 1776;
        box.left = 40;
        box.right = 40;
        box.height = 330;
        const background = new Laya.Sprite();
        background.name = 'background';
        box.addChild(background);
        const name = new Laya.Label();
        name.name = 'name';
        name.left = 24;
        name.right = 24;
        name.top = 18;
        name.font = '方正像素12';
        name.fontSize = 52;
        name.color = '#ffffff';
        name.wordWrap = true;
        name.height = 64;
        box.addChild(name);
        const effect = new Laya.Label();
        effect.name = 'effect';
        effect.left = 24;
        effect.right = 24;
        effect.top = 88;
        effect.font = '方正像素12';
        effect.fontSize = 46;
        effect.leading = 12;
        effect.color = '#ffffff';
        effect.wordWrap = true;
        effect.height = 220;
        box.addChild(effect);
        this.pageResult.addChild(box);
        this.applyDisplayScale($ui.displayScale);
        this.updateTalentDetailBackground();
        this.updateTalentDetail();
    }

    updateTalentDetailBackground() {
        if(!this.#detailBox) return;
        const background = this.#detailBox.getChildByName('background');
        background.graphics.clear();
        background.graphics.drawRect(0, 0, this.#detailBox.width, this.#detailBox.height, '#04131f', '#55fffe', 2);
    }

    applyDisplayScale(scale) {
        if(!this.#detailBox) return;
        this.#detailBox.getChildByName('name').fontSize = scale >= 1.4 ? 58 : 52;
        this.#detailBox.getChildByName('effect').fontSize = scale >= 1.4 ? 52 : 46;
    }

    updateTalentDetail(dataSource = null) {
        if(!this.#detailBox) return;
        const name = this.#detailBox.getChildByName('name');
        const effect = this.#detailBox.getChildByName('effect');
        name.text = dataSource ? dataSource.name : '天赋详情';
        effect.text = dataSource
            ? talentSummary(talentDetails(dataSource))
            : '点击天赋卡片查看详情';
        name.color = dataSource ? '#ffffff' : '#76979d';
        effect.color = dataSource ? '#ffffff' : '#76979d';
    }
}
