export default class Themes extends ui.view.ThemesUI {
    constructor() {
        super();
        this.height = 820;
        this.btnClose.on(Laya.Event.CLICK, this, ()=>this.close());
        this.btnOK.on(Laya.Event.CLICK, this, async ()=>{
            const selected = this.selected;
            if(selected === $ui.theme) return this.close();
            $ui.theme = selected;
            await this.close();
            $ui.switchView(UI.pages.MAIN);
        });
        const title = new Laya.Label('显示大小');
        title.fontSize = 32;
        title.color = '#ffffff';
        title.centerX = 0;
        title.y = 445;
        this.addChild(title);
        const options = [
            ['普通 1.0x', 'normal'],
            ['大字 1.5x', 'large'],
            ['超大字 2.0x', 'extraLarge'],
        ];
        this.displayScaleButtons = [];
        options.forEach(([label, value], index) => {
            const button = new Laya.Button();
            button.width = 260;
            button.height = 70;
            button.centerX = 0;
            button.y = 495 + index * 85;
            button.label = label;
            button.labelSize = 28;
            button.labelColors = '#ffffff,#ffffff,#ffffff';
            button.bgColor = '#444444';
            button.on(Laya.Event.CLICK, this, () => {
                $ui.displayScaleLevel = value;
                this.displayScale = value;
            });
            button._displayLabel = label;
            button._displayValue = value;
            this.displayScaleButtons.push(button);
            this.addChild(button);
        });
    }

    static load() {
        return ["images/atlas/images/radio.atlas"];
    }

    init() {
        this.selected = localStorage.getItem('theme');
        this.displayScale = $ui.displayScaleLevel;
    }

    get selected() {
        switch(this.radioTheme.selectedIndex) {
            case 0: return 'cyber';
            case 1: return 'dark';
            case 2: return 'light';
            default: return 'default';
        }
    }
    set selected(v) {
        let index;
        switch(v) {
            case 'cyber': index = 0; break;
            case 'dark': index = 1; break;
            case 'light': index = 2; break;
            default: index = -1; break;
        }
        this.radioTheme.selectedIndex = index;
    }

    set displayScale(v) {
        this._displayScale = v;
        this.displayScaleButtons?.forEach(button => {
            const selected = button._displayValue === v;
            button.label = selected ? `✓ ${button._displayLabel}` : button._displayLabel;
            button.bgColor = selected ? '#267a68' : '#444444';
        });
    }
}
