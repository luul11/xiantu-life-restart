export default class Main extends ui.view.DefaultTheme.MainUI {
    constructor() {
        super();
        this.btnRemake.on(Laya.Event.CLICK, this, ()=>$ui.switchView(UI.pages.TALENT));
        this.btnAchievement.on(Laya.Event.CLICK, this, ()=>$ui.switchView(UI.pages.ACHIEVEMENT));
        this.btnThanks.on(Laya.Event.CLICK, this, ()=>$ui.switchView(UI.pages.THANKS));
        this.btnGithub.on(Laya.Event.CLICK, this, goto, ['github']);
        this.btnDiscord.on(Laya.Event.CLICK, this, goto, ['discord']);
        this.btnThemes.on(Laya.Event.CLICK, this, ()=>$ui.showDialog(UI.pages.THEMES));
        this.btnSaveLoad.on(Laya.Event.CLICK, this, ()=>$ui.showDialog(UI.pages.SAVELOAD));
        const info = new Laya.Label('V2.0.0\n制作者 伊玛目的门徒');
        info.width = 420;
        info.height = 80;
        info.font = 'SimHei';
        info.fontSize = 24;
        info.color = '#999999';
        info.align = 'right';
        info.leading = 8;
        info.right = 50;
        info.bottom = 350;
        info.mouseEnabled = false;
        this.addChild(info);
    }

    static load() {
        return [
            "images/atlas/images/icons.atlas",
        ]
    }

    init() {
        this.banner.visible =
        this.btnDiscord.visible =
        this.btnAchievement.visible = !!core.times;
        // 感谢页依赖的 specialThanks 数据已移除，隐藏入口
        this.btnThanks.visible = false;
        const text = this.labSubTitle.text;
        this.labSubTitle.text = ' ';
        this.labSubTitle.text = text;
    }
}
