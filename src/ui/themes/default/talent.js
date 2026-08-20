import { talentDetails, talentSummary } from '../talentInfo.js';

export default class Talent extends ui.view.DefaultTheme.TalentUI {
    constructor() {
        super();
        this.btnDrawCard.on(Laya.Event.CLICK, this, this.onClickDrawCard);
        this.btnNext.on(Laya.Event.CLICK, this, this.onClickNext);
        this.listTalents.renderHandler = Laya.Handler.create(this, this.renderTalent, null, false);
        this.listTalents.scrollBar.elasticDistance = 150;
        this.createRedrawButton();
    }

    #selected = new Set();
    #detailBox;
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
        this.listTalents.bottom = 590;
        this.listTalents.array = core.talentRandom();
        this.btnRedraw.visible = true;
        this.createTalentDetail();
    }

    onClickNext() {
        if(this.#selected.size < core.talentSelectLimit) {
            return $$event('message', ['F_TalentSelectNotComplect', core.talentSelectLimit]);
        }

        const talents = [...this.#selected].map(index => this.listTalents.array[index]);
        $ui.switchView(UI.pages.PROPERTY, { talents, enableExtend: true });
    }

    createRedrawButton() {
        this.btnRedraw = new Laya.Button();
        this.btnRedraw.label = '重抽';
        this.btnRedraw.labelSize = 48;
        this.btnRedraw.width = 220;
        this.btnRedraw.height = 90;
        this.btnRedraw.right = 40;
        this.btnRedraw.top = 110;
        $_.deepMapSet(this.btnRedraw, $ui.common.card[0].normal);
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

        const blank = box.getChildByName('blank');
        box.label = $_.format($lang.F_TalentSelection, dataSource);

        const style = $ui.common.card[dataSource.grade];
        const changeStyle = () => {
            const selected = this.#selected.has(index);
            blank.pause = !selected;
            $_.deepMapSet(box, selected? style.selected: style.normal);
        }
        changeStyle();

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
        box.top = 1836;
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
        name.font = 'SimHei';
        name.fontSize = 50;
        name.color = '#ffffff';
        name.wordWrap = true;
        name.height = 62;
        box.addChild(name);
        const effect = new Laya.Label();
        effect.name = 'effect';
        effect.left = 24;
        effect.right = 24;
        effect.top = 86;
        effect.font = 'SimHei';
        effect.fontSize = 44;
        effect.leading = 10;
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
        background.graphics.drawRect(0, 0, this.#detailBox.width, this.#detailBox.height, '#252525', '#777777', 2);
    }

    applyDisplayScale(scale) {
        if(!this.#detailBox) return;
        this.#detailBox.getChildByName('name').fontSize = scale >= 1.4 ? 56 : 50;
        this.#detailBox.getChildByName('effect').fontSize = scale >= 1.4 ? 50 : 44;
    }

    updateTalentDetail(dataSource = null) {
        if(!this.#detailBox) return;
        const name = this.#detailBox.getChildByName('name');
        const effect = this.#detailBox.getChildByName('effect');
        name.text = dataSource ? dataSource.name : '天赋详情';
        effect.text = dataSource
            ? talentSummary(talentDetails(dataSource))
            : '点击天赋卡片查看详情';
        name.color = dataSource ? '#ffffff' : '#aaaaaa';
        effect.color = dataSource ? '#ffffff' : '#aaaaaa';
    }
}
