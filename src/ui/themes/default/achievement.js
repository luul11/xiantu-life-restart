export default class Achievement extends ui.view.DefaultTheme.AchievementUI {
    constructor() {
        super();
        this.btnBack.on(Laya.Event.CLICK, this, () => $ui.switchView(UI.pages.MAIN));
        this.btnRank.on(Laya.Event.CLICK, this, $$event, ['message', ['M_NoRank']]);
        this.listAchievements.renderHandler = new Laya.Handler(this, this.onRenderAchievement);
        this.listAchievements.scrollBar.elasticDistance = 150;
    }

    init() {

        const achievements = core.achievements;
        this.listAchievements.array = achievements;
        const achievedCount = achievements.filter(a => a.isAchieved).length;

        this.labRemakeTimes.text = $_.format($lang.F_RemakeTimes, core.times);
        this.labRemakeTimesJudge.text = '';

        this.labAchievementCount.text = $_.format($lang.F_AchievementCount, achievedCount);
        this.labAchievementCountJudge.text = '';

        // 事件/天赋收集率统计已随旧属性体系移除，隐藏
        this.boxEventRate.visible = this.boxTalentRate.visible = false;
    }

    onRenderAchievement(box) {
        const dataSource = box.dataSource;

        const name = box.getChildByName('name');
        const description = box.getChildByName('description');
        const boxMask = box.getChildByName('boxMask');

        $_.deepMapSet(box, $ui.common.achievement[dataSource.grade]);
        name.color = description.color = $ui.common.defaultFontColor;

        if(dataSource.isAchieved) {
            name.text = dataSource.name;
            description.text = dataSource.description;
            boxMask.visible = false;
        } else {
            name.text = dataSource.hide? '???': dataSource.name;
            description.text = dataSource.hide? '???': dataSource.description;
            boxMask.visible = true;
        }
    }
}