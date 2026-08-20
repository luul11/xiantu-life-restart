export default class Mode extends ui.view.DefaultTheme.ModeUI {
    constructor() {
        super();
        this.btnCustom.on(Laya.Event.CLICK, this, ()=>$ui.switchView(UI.pages.TALENT));
        this.btnCustom.getChildByName('font_default').text = '自定义开局';
        this.btnCustom.getChildAt(1).text = '抽取天赋并自由分配属性';
        this.btnCustom.offAll(Laya.Event.CLICK);
        this.btnCustom.on(Laya.Event.CLICK, this, () => $ui.switchView(UI.pages.TALENT));
        this.btnCelebrity.getChildByName('font_default').text = '快捷模板';
        this.btnCelebrity.getChildAt(1).text = '力大砖飞 · 魔武双修 · 铁皮人';
        this.btnCelebrity.visible = true;
        this.btnCelebrity.offAll(Laya.Event.CLICK);
        this.btnCelebrity.on(Laya.Event.CLICK, this, () => $ui.switchView(UI.pages.TALENT));
    }
}
