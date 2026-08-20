export default class Summary extends ui.view.DefaultTheme.SummaryUI {
    constructor() {
        super();
        this.listSummary.renderHandler = Laya.Handler.create(this, this.renderSummary, null, false);
        this.listSelectedTalents.renderHandler = Laya.Handler.create(this, this.renderTalent, null, false);
        this.btnAgain.on(Laya.Event.CLICK, this, this.onAgain);

        // 「导出日志」按钮（编程创建，避免改动 .ui 文件）
        const btn = new Laya.runtime.ColorfulBox();
        btn.size(400, 110);
        const label = new Laya.Label('导出日志');
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
            lineWidth: 4,
            radius: 8,
        });
        btn.right = 60;
        btn.bottom = 60;
        btn.on(Laya.Event.CLICK, this, this.onExport);
        this.addChild(btn);
    }

    #selectedTalent;
    #enableExtend;

    /** 导出人生日志 txt */
    onExport() {
        const text = core.exportLog();
        const blob = new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `修仙人生日志_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    onAgain() {
        core.talentExtend(this.#selectedTalent);
        core.times ++;
        $ui.switchView(UI.pages.MAIN);
    }

    init({talents, enableExtend}) {
        const {summary, lastExtendTalent} = core;
        this.#enableExtend = enableExtend;

        // 境界品级：练气1 筑基2 结丹3
        const realmGrade = summary.realmName === '元婴' ? 4
            : summary.realmName === '金丹' ? 3
            : summary.realmName === '筑基' ? 2 : 1;

        this.listSummary.array = [
            { label: `最终境界${$lang.UI_Colon} ${summary.realmName} ${summary.stage} 层`, grade: realmGrade },
            { label: `${$lang.UI_Final_Age}${$lang.UI_Colon} ${summary.age} / 寿元 ${summary.lifespan}`, grade: 0 },
            { label: `力量${$lang.UI_Colon} ${summary.power}`, grade: 0 },
            { label: `心境${$lang.UI_Colon} ${summary.mood}`, grade: 0 },
            { label: `灵石${$lang.UI_Colon} ${summary.stone}`, grade: 0 },
            { label: `${$lang.UI_Remake_Times}${$lang.UI_Colon} ${summary.times}`, grade: 0 },
        ];

        talents.sort(({id:a, grade:ag}, {id:b, grade:bg},)=>{
            if(a == lastExtendTalent) return -1;
            if(b == lastExtendTalent) return 1;
            return bg - ag;
        });
        if(this.#enableExtend) {
            this.#selectedTalent = talents[0].id;
        } else {
            this.#selectedTalent = lastExtendTalent;
        }
        this.listSelectedTalents.array = talents;
    }
    renderSummary(box) {
        const {label, grade} = box.dataSource;
        box.label = label;
        $_.deepMapSet(box, $ui.common.summary[grade]);
    }
    renderTalent(box) {
        const dataSource = box.dataSource;
        box.label = $_.format($lang.F_TalentSelection, dataSource);
        const style = $ui.common.card[dataSource.grade];
        $_.deepMapSet(box, dataSource.id == this.#selectedTalent? style.selected: style.normal);
        box.getChildByName('blank').pause = dataSource.id != this.#selectedTalent;
        box.off(Laya.Event.CLICK, this, this.onSelectTalent);
        box.on(Laya.Event.CLICK, this, this.onSelectTalent, [dataSource.id]);
    }

    onSelectTalent(talentId) {
        if(!this.#enableExtend) {
            return $$event('message', ['M_DisableExtendTalent']);
        }
        if(talentId == this.#selectedTalent) {
            this.#selectedTalent = null;
        } else {
            this.#selectedTalent = talentId;
        }

        this.listSelectedTalents.refresh();
    }
}
