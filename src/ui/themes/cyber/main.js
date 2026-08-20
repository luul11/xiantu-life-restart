export default class CyberMain extends ui.view.CyberTheme.CyberMainUI {
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
        info.font = '方正像素12';
        info.fontSize = 24;
        info.color = '#828c95';
        info.align = 'right';
        info.leading = 8;
        info.right = 50;
        info.bottom = 350;
        info.mouseEnabled = false;
        this.addChild(info);
        this.on(Laya.Event.RESIZE, this, () => {
            const scale = Math.max(
                this.width / this.imgBg.width,
                this.height / this.imgBg.height
            );
            this.imgBg.scale(scale, scale);
        });
    }

    static load() {
        return [
            "fonts/方正像素12.ttf",
            "images/atlas/images/accessories.atlas",
            "images/atlas/images/border.atlas",
            "images/atlas/images/button.atlas",
            "images/atlas/images/icons.atlas",
            "images/atlas/images/progress.atlas",
            "images/atlas/images/slider.atlas",
        ]
    }

    init() {
        this.banner.visible =
        this.btnDiscord.visible =
        this.btnAchievement.visible =
        this.btnThanks.visible = !!core.times;
    }
}
