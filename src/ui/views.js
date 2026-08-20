const pages = {
    LOADING: 'LOADING',
    MAIN: 'MAIN',
    TALENT: 'TALENT',
    PROPERTY: 'PROPERTY',
    TRAJECTORY: 'TRAJECTORY',
    SUMMARY: 'SUMMARY',
    ACHIEVEMENT: 'ACHIEVEMENT',
    THANKS: 'THANKS',
    THEMES: 'THEMES',
    SAVELOAD: 'SAVELOAD',
    MODE: 'MODE',
    CELEBRITY: 'CELEBRITY',
}

const popups = {
    ACHIEVEMENT: 'POPUP_ACHIEVEMENT',
    MESSAGE: 'POPUP_MESSAGE',
}

const cyber = {
    pages: {
        [pages.LOADING]: 'loading',
        [pages.MAIN]: 'cyber/main',
        [pages.TALENT]: 'cyber/talent',
        [pages.PROPERTY]: 'cyber/property',
        [pages.TRAJECTORY]: 'cyber/trajectory',
        [pages.SUMMARY]: 'cyber/summary',
        [pages.ACHIEVEMENT]: 'cyber/achievement',
        [pages.THANKS]: 'default/thanks',
        [pages.THEMES]: 'themes',
        [pages.SAVELOAD]: 'saveload',
        [pages.MODE]: 'cyber/mode',
        [pages.CELEBRITY]: 'cyber/celebrity',
    },
    popups: {
        [popups.ACHIEVEMENT]: 'cyber/popup/achievementPopup',
        [popups.MESSAGE]: 'message',
    },
    configs: {
        bgColor: '#04131f',
        common: {
            topSupportItem: {
                defaultColor: '#ffa500',
                defaultStroke: '#ffa500',
                hoverColor: '#ffc500',
                hoverStroke: '#ffa500',
            },
            defaultFontColor: '#cccccc',
            grade: ['#cccccc', '#55fffe', '#b17cff', '#ffce45'],
            filter: ['#ccccccff', '#55fffeff', '#b17cffff', '#ffce45ff'],
            gradeBlk: [
                {
                    visible: false,
                },
                {
                    defaultColor: '#55fffe',
                    hoverColor: '#55fffe',
                    visible: true,
                },
                {
                    defaultColor: '#b17cff',
                    hoverColor: '#b17cff',
                    visible: true,
                },
                {
                    defaultColor: '#ffce45',
                    hoverColor: '#ffce45',
                    visible: true,
                },
            ],
        },
        pages: {
            [pages.MAIN]: {
                vars: {
                    btnThemes: {
                        defaultColor: '#cccccc',
                        radius: 100,
                    },
                    btnSaveLoad: {
                        defaultColor: '#5865f2',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#1160b0',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#eeeeee',
                        lineWidth: 0,
                        radius: 100,
                    },
                },
            },
            [pages.THANKS]: {
                vars: {
                    btnBack: {
                        defaultColor: '#5865f2',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#1160b0',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#eeeeee',
                        lineWidth: 0,
                        radius: 4,
                    },
                    btnAFD: {
                        defaultColor: '#8764de',
                        defaultStroke: '#8764de',
                        defaultLabel: '#ffffff',
                        hoverColor: '#9774ee',
                        hoverStroke: '#9774ee',
                        hoverLabel: '#ffffff',
                        radius: 4,
                    },
                    btnDDF: {
                        defaultColor: '#cc6699',
                        defaultStroke: '#cc6699',
                        defaultLabel: '#ffffff',
                        hoverColor: '#dc76a9',
                        hoverStroke: '#dc76a9',
                        hoverLabel: '#ffffff',
                        radius: 4,
                    },
                },
            },
            [pages.THEMES]: {
                vars: {
                    btnOK: {
                        defaultColor: '#28b070',
                        defaultLabel: '#ffffff',
                        hoverColor: '#00ff00',
                        hoverLabel: '#ffffff',
                        radius: 80,
                    },
                    btnClose: {
                        defaultColor: '#eb3941',
                        defaultLabel: '#ffffff',
                        hoverColor: '#ff0000',
                        hoverLabel: '#ffffff',
                        radius: 80,
                    },
                },
            },
            [pages.SAVELOAD]: {
                vars: {
                    btnClose: {
                        defaultColor: '#eb3941',
                        hoverColor: '#ff0000',
                    },
                    btnSave: {
                        defaultColor: '#007046',
                        hoverColor: '#76f190',
                    },
                    btnRead: {
                        defaultColor: '#007046',
                        hoverColor: '#76f190',
                    },
                    btnLoad: {
                        defaultColor: '#fc5531',
                        hoverColor: '#f28b54',
                    },
                    btnWrite: {
                        defaultColor: '#fc5531',
                        hoverColor: '#f28b54',
                    },
                    btnBackup: {
                        defaultColor: '#9c30cd',
                        hoverColor: '#bf50fd',
                        radius: 8,
                        defaultLabel: '#ffffff',
                        hoverLabel: '#ffffff',
                    },
                },
                names: {
                    btnSmall: {
                        radius: 80,
                        defaultLabel: '#ffffff',
                        hoverLabel: '#ffffff',
                    },
                },
            },
        },
    },
}

const dark = {
    pages: {
        [pages.LOADING]: 'loading',
        [pages.MAIN]: 'default/main',
        [pages.TALENT]: 'default/talent',
        [pages.PROPERTY]: 'default/property',
        [pages.TRAJECTORY]: 'default/trajectory',
        [pages.SUMMARY]: 'default/summary',
        [pages.ACHIEVEMENT]: 'default/achievement',
        [pages.THANKS]: 'default/thanks',
        [pages.THEMES]: 'themes',
        [pages.SAVELOAD]: 'saveload',
        [pages.MODE]: 'default/mode',
        [pages.CELEBRITY]: 'default/celebrity',
    },
    popups: {
        [popups.ACHIEVEMENT]: 'default/popup/achievementPopup',
        [popups.MESSAGE]: 'message',
    },
    configs: {
        bgColor: '#222831',
        common: {
            defaultFontColor: '#eeeeee',
            trajectoryItem: {
                box: {
                    // 羊皮纸风格边框
                    defaultStroke: '#c9b58a',
                    hoverStroke: '#c9b58a',
                    lineWidth: 2,
                },
                grade: [
                    // 羊皮纸深黄系（白字）
                    {
                        defaultColor: '#6e5630',
                        hoverColor: '#7d6538',
                    },
                    {
                        defaultColor: '#6d7034',
                        hoverColor: '#7d8040',
                    },
                    {
                        defaultColor: '#7a5c28',
                        hoverColor: '#8a6c32',
                    },
                    {
                        defaultColor: '#7d4a2a',
                        hoverColor: '#8d5834',
                    },
                    {
                        defaultColor: '#a8821f',
                        hoverColor: '#bd9628',
                    },
                ],
                ageColor: '#ffe9b0',
                contentColor: '#f5efdc',
            },
            topSupportItem: {
                defaultColor: '#ffa500',
                defaultStroke: '#ffa500',
                hoverColor: '#ffc500',
                hoverStroke: '#ffa500',
            },
            grade: ['#cccccc', '#55fffe', '#b17cff', '#ffce45'],
            filter: ['#ccccccff', '#55fffeff', '#b17cffff', '#ffce45ff'],
            card: [
                {
                    normal: {
                        defaultColor: '#464646',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#c0c0c0',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#c0c0c0',
                        defaultStroke: '#a5ff88',
                        defaultLabel: '#3b3b3b',
                        hoverColor: '#c0c0c0',
                        hoverStroke: '#a5ff88',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
                {
                    normal: {
                        defaultColor: '#6495ed',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#87cefa',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#87cefa',
                        defaultStroke: '#a5ff88',
                        defaultLabel: '#3b3b3b',
                        hoverColor: '#87cefa',
                        hoverStroke: '#a5ff88',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
                {
                    normal: {
                        defaultColor: '#e2a7ff',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#e7beff',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#e7beff',
                        defaultStroke: '#a5ff88',
                        defaultLabel: '#3b3b3b',
                        hoverColor: '#e7beff',
                        hoverStroke: '#a5ff88',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
                {
                    normal: {
                        defaultColor: '#ffa07a',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#f7a989',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#f7a989',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#3b3b3b',
                        hoverColor: '#f7a989',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#3b3b3b',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
            ],
            summary: [
                {
                    defaultColor: '#464646',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#c0c0c0',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 2,
                    radius: 0,
                },
                {
                    defaultColor: '#6495ed',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#87cefa',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 2,
                    radius: 0,
                },
                {
                    defaultColor: '#e2a7ff',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#e7beff',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 2,
                    radius: 0,
                },
                {
                    defaultColor: '#ffa07a',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#f7a989',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 2,
                    radius: 0,
                },
            ],
            achievement: [
                {
                    defaultColor: '#464646',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#c0c0c0',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
                {
                    defaultColor: '#6495ed',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#87cefa',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
                {
                    defaultColor: '#e2a7ff',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#e7beff',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
                {
                    defaultColor: '#ffa07a',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#f7a989',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
            ],
            characterItem: {
                name: {
                    defaultColor: '#393e46',
                    defaultStroke: '#eeeeee',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#ff7878',
                    hoverStroke: '#eeeeee',
                    hoverLabel: '#eeeeee',
                    lineWidth: 2,
                },
                state: {
                    defaultColor: '#393e46',
                    defaultStroke: '#eeeeee',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#393e46',
                    hoverStroke: '#eeeeee',
                    hoverLabel: '#eeeeee',
                    lineWidth: 2,
                },
                propertyColor: '#000000',
            },
        },
        class: {
            btn_main: {
                defaultColor: '#393e46',
                defaultStroke: '#eeeeee',
                defaultLabel: '#eeeeee',
                hoverColor: '#ff7878',
                hoverStroke: '#eeeeee',
                hoverLabel: '#eeeeee',
                lineWidth: 2,
                radius: 4,
            },
            btn_main2: {
                defaultColor: '#ffa07a',
                defaultStroke: '#f8f8f8',
                defaultLabel: '#3b3b3b',
                hoverColor: '#ff7878',
                hoverStroke: '#f8f8f8',
                hoverLabel: '#eeeeee',
                lineWidth: 2,
                radius: 4,
            },
            btn_small: {
                defaultColor: '#5865f2',
                defaultStroke: '#eeeeee',
                defaultLabel: '#eeeeee',
                hoverColor: '#1160b0',
                hoverStroke: '#eeeeee',
                hoverLabel: '#eeeeee',
                lineWidth: 0,
                radius: 4,
            },
            title: {
                color: '#ffffff',
            },
            font_default: {
                color: '#eeeeee',
            },
        },
        pages: {
            [pages.MAIN]: {
                vars: {
                    btnRemake: 'btn_main',
                    btnThemes: {
                        defaultColor: '#cccccc',
                        radius: 100,
                    },
                    btnSaveLoad: {
                        defaultColor: '#5865f2',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#1160b0',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#eeeeee',
                        lineWidth: 0,
                        radius: 100,
                    },
                },
                names: {
                    title: 'title',
                    btnSmall: 'btn_small',
                },
            },
            [pages.TALENT]: {
                vars: {
                    btnDrawCard: 'btn_main',
                    btnNext: 'btn_main',
                    title: 'title',
                },
            },
            [pages.PROPERTY]: {
                vars: {
                    btnRandomAllocate: 'btn_main',
                    btnNext: 'btn_main2',
                    title: 'title',
                },
                names: {
                    font_default: 'font_default',
                    property: {
                        colorFilter: '#eeeeeeff',
                    },
                },
            },
            [pages.TRAJECTORY]: {
                vars: {
                    btnSummary: 'btn_main',
                    boxTrajectory: {
                        defaultColor: '#393e46',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#393e46',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#eeeeee',
                        lineWidth: 2,
                        radius: 4,
                    },
                    boxSpeed: {
                        colorFilter: '#ffffffff',
                    },
                },
                names: {
                    propertyBox: {
                        defaultColor: '#222831',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#222831',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#eeeeee',
                        lineWidth: 2,
                        radius: 4,
                    },
                    propertyValue: {
                        defaultColor: '#eeeeee',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#222831',
                        hoverColor: '#eeeeee',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#222831',
                        lineWidth: 0,
                        radius: 4,
                    },
                },
            },
            [pages.SUMMARY]: {
                vars: {
                    btnAgain: 'btn_main',
                    title: 'title',
                },
                names: {
                    font_default: 'font_default',
                },
            },
            [pages.ACHIEVEMENT]: {
                vars: {
                    btnBack: 'btn_small',
                    btnRank: 'btn_small',
                },
                names: {
                    font_default: 'font_default',
                    title: 'title',
                },
            },
            [pages.THANKS]: {
                vars: {
                    btnBack: 'btn_small',
                    btnAFD: {
                        defaultColor: '#8764de',
                        defaultStroke: '#8764de',
                        defaultLabel: '#ffffff',
                        hoverColor: '#9774ee',
                        hoverStroke: '#9774ee',
                        hoverLabel: '#ffffff',
                        radius: 4,
                    },
                    btnDDF: {
                        defaultColor: '#cc6699',
                        defaultStroke: '#cc6699',
                        defaultLabel: '#ffffff',
                        hoverColor: '#dc76a9',
                        hoverStroke: '#dc76a9',
                        hoverLabel: '#ffffff',
                        radius: 4,
                    },
                },
            },
            [pages.THEMES]: {
                vars: {
                    btnOK: {
                        defaultColor: '#28b070',
                        defaultLabel: '#ffffff',
                        hoverColor: '#00ff00',
                        hoverLabel: '#ffffff',
                        radius: 80,
                    },
                    btnClose: {
                        defaultColor: '#eb3941',
                        defaultLabel: '#ffffff',
                        hoverColor: '#ff0000',
                        hoverLabel: '#ffffff',
                        radius: 80,
                    },
                },
            },
            [pages.SAVELOAD]: {
                vars: {
                    btnClose: {
                        defaultColor: '#eb3941',
                        hoverColor: '#ff0000',
                    },
                    btnSave: {
                        defaultColor: '#007046',
                        hoverColor: '#76f190',
                    },
                    btnRead: {
                        defaultColor: '#007046',
                        hoverColor: '#76f190',
                    },
                    btnLoad: {
                        defaultColor: '#fc5531',
                        hoverColor: '#f28b54',
                    },
                    btnWrite: {
                        defaultColor: '#fc5531',
                        hoverColor: '#f28b54',
                    },
                    btnBackup: {
                        defaultColor: '#9c30cd',
                        hoverColor: '#bf50fd',
                        radius: 8,
                        defaultLabel: '#ffffff',
                        hoverLabel: '#ffffff',
                    },
                },
                names: {
                    btnSmall: {
                        radius: 80,
                        defaultLabel: '#ffffff',
                        hoverLabel: '#ffffff',
                    },
                },
            },
            [pages.MODE]: {
                names: {
                    font_default: 'font_default',
                    btn: 'btn_main',
                },
            },
            [pages.CELEBRITY]: {
                vars: {
                    btnRetry: 'btn_main',
                    btnNext: 'btn_main2',
                },
            },
        },
        popups: {
            [popups.ACHIEVEMENT]: {
                vars: {
                    bg1: {
                        defaultColor: '#292a28',
                        defaultStroke: '#84ff55',
                        hoverColor: '#292a28',
                        hoverStroke: '#84ff55',
                    },
                },
            },
        },
    },
}

const light = {
    pages: {
        [pages.LOADING]: 'loading',
        [pages.MAIN]: 'default/main',
        [pages.TALENT]: 'default/talent',
        [pages.PROPERTY]: 'default/property',
        [pages.TRAJECTORY]: 'default/trajectory',
        [pages.SUMMARY]: 'default/summary',
        [pages.ACHIEVEMENT]: 'default/achievement',
        [pages.THANKS]: 'default/thanks',
        [pages.THEMES]: 'themes',
        [pages.SAVELOAD]: 'saveload',
        [pages.MODE]: 'default/mode',
        [pages.CELEBRITY]: 'default/celebrity',
    },
    popups: {
        [popups.ACHIEVEMENT]: 'default/popup/achievementPopup',
        [popups.MESSAGE]: 'message',
    },
    configs: {
        bgColor: '#ffffff',
        common: {
            defaultFontColor: '#000000',
            trajectoryItem: {
                box: {
                    // 羊皮纸风格边框
                    defaultStroke: '#b1a179',
                    hoverStroke: '#b1a179',
                    lineWidth: 2,
                },
                grade: [
                    // 羊皮纸浅黄系（深褐字）
                    {
                        defaultColor: '#e9dcbc',
                        hoverColor: '#dfcfa6',
                    },
                    {
                        defaultColor: '#dde0b5',
                        hoverColor: '#d0d4a0',
                    },
                    {
                        defaultColor: '#e3cf9f',
                        hoverColor: '#d8c08c',
                    },
                    {
                        defaultColor: '#e0bfa0',
                        hoverColor: '#d5ad8c',
                    },
                    {
                        defaultColor: '#f0d184',
                        hoverColor: '#e5c46e',
                    },
                ],
                ageColor: '#6b5320',
                contentColor: '#4a3f28',
            },
            topSupportItem: {
                defaultColor: '#ffa500',
                defaultStroke: '#ffa500',
                hoverColor: '#ffc500',
                hoverStroke: '#ffa500',
            },
            grade: ['#000000', '#55fffe', '#b17cff', '#ffce45'],
            filter: ['#000000ff', '#55fffeff', '#b17cffff', '#ffce45ff'],
            card: [
                {
                    normal: {
                        defaultColor: '#ededed',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#666666',
                        hoverColor: '#666666',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#666666',
                        defaultStroke: '#a5ff88',
                        defaultLabel: '#ffffff',
                        hoverColor: '#666666',
                        hoverStroke: '#a5ff88',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
                {
                    normal: {
                        defaultColor: '#87cefa',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#666666',
                        hoverColor: '#6495ed',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#6495ed',
                        defaultStroke: '#a5ff88',
                        defaultLabel: '#ffffff',
                        hoverColor: '#6495ed',
                        hoverStroke: '#a5ff88',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
                {
                    normal: {
                        defaultColor: '#e7beff',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#666666',
                        hoverColor: '#e2a7ff',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#e2a7ff',
                        defaultStroke: '#a5ff88',
                        defaultLabel: '#ffffff',
                        hoverColor: '#e2a7ff',
                        hoverStroke: '#a5ff88',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
                {
                    normal: {
                        defaultColor: '#f7a989',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#666666',
                        hoverColor: '#ffa07a',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                    selected: {
                        defaultColor: '#ffa07a',
                        defaultStroke: '#f8f8f8',
                        defaultLabel: '#ffffff',
                        hoverColor: '#ffa07a',
                        hoverStroke: '#f8f8f8',
                        hoverLabel: '#ffffff',
                        lineWidth: 4,
                        radius: 4,
                    },
                },
            ],
            summary: [
                {
                    defaultColor: '#ededed',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#666666',
                    hoverColor: '#666666',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#ffffff',
                    lineWidth: 4,
                    radius: 4,
                },
                {
                    defaultColor: '#6495ed',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#ffffff',
                    hoverColor: '#87cefa',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#666666',
                    lineWidth: 4,
                    radius: 4,
                },
                {
                    defaultColor: '#e2a7ff',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#ffffff',
                    hoverColor: '#e7beff',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#666666',
                    lineWidth: 4,
                    radius: 4,
                },
                {
                    defaultColor: '#ffa07a',
                    defaultStroke: '#f8f8f8',
                    defaultLabel: '#ffffff',
                    hoverColor: '#f7a989',
                    hoverStroke: '#f8f8f8',
                    hoverLabel: '#666666',
                    lineWidth: 4,
                    radius: 4,
                },
            ],
            achievement: [
                {
                    defaultColor: '#ededed',
                    defaultStroke: '#cccccc',
                    defaultLabel: '#000000',
                    hoverColor: '#eeeeee',
                    hoverStroke: '#cccccc',
                    hoverLabel: '#efefef',
                    lineWidth: 4,
                    radius: 0,
                },
                {
                    defaultColor: '#6495ed',
                    defaultStroke: '#cccccc',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#87cefa',
                    hoverStroke: '#cccccc',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
                {
                    defaultColor: '#e2a7ff',
                    defaultStroke: '#cccccc',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#e7beff',
                    hoverStroke: '#cccccc',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
                {
                    defaultColor: '#ffa07a',
                    defaultStroke: '#cccccc',
                    defaultLabel: '#eeeeee',
                    hoverColor: '#f7a989',
                    hoverStroke: '#cccccc',
                    hoverLabel: '#3b3b3b',
                    lineWidth: 4,
                    radius: 0,
                },
            ],
            characterItem: {
                name: {
                    defaultColor: '#ffffff',
                    defaultStroke: '#cccccc',
                    defaultLabel: '#000000',
                    hoverColor: '#ff7878',
                    hoverStroke: '#cccccc',
                    hoverLabel: '#ffffff',
                    lineWidth: 2,
                },
                state: {
                    defaultColor: '#ffffff',
                    defaultStroke: '#cccccc',
                    defaultLabel: '#000000',
                    hoverColor: '#ffffff',
                    hoverStroke: '#cccccc',
                    hoverLabel: '#000000',
                    lineWidth: 2,
                },
                propertyColor: '#000000',
            },
        },
        class: {
            btn_main: {
                defaultColor: '#ffffff',
                defaultStroke: '#cccccc',
                defaultLabel: '#000000',
                hoverColor: '#ff7878',
                hoverStroke: '#cccccc',
                hoverLabel: '#ffffff',
                lineWidth: 2,
                radius: 4,
            },
            btn_main2: {
                defaultColor: '#f7a989',
                defaultStroke: '#f8f8f8',
                defaultLabel: '#ffffff',
                hoverColor: '#ff7878',
                hoverStroke: '#f8f8f8',
                hoverLabel: '#ffffff',
                lineWidth: 2,
                radius: 4,
            },
            btn_small: {
                defaultColor: '#5865f2',
                defaultStroke: '#eeeeee',
                defaultLabel: '#eeeeee',
                hoverColor: '#1160b0',
                hoverStroke: '#eeeeee',
                hoverLabel: '#eeeeee',
                lineWidth: 0,
                radius: 4,
            },
            title: {
                color: '#000000',
            },
            font_default: {
                color: '#000000',
            },
        },
        pages: {
            [pages.MAIN]: {
                vars: {
                    btnRemake: 'btn_main',
                    btnThemes: {
                        defaultColor: '#cccccc',
                        radius: 100,
                    },
                    btnSaveLoad: {
                        defaultColor: '#5865f2',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#1160b0',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#eeeeee',
                        lineWidth: 0,
                        radius: 100,
                    },
                },
                names: {
                    title: 'title',
                    btnSmall: 'btn_small',
                },
            },
            [pages.TALENT]: {
                vars: {
                    btnDrawCard: 'btn_main',
                    btnNext: 'btn_main',
                    title: 'title',
                },
            },
            [pages.PROPERTY]: {
                vars: {
                    btnRandomAllocate: 'btn_main',
                    btnNext: 'btn_main2',
                    title: 'title',
                },
                names: {
                    font_default: 'font_default',
                    property: {
                        colorFilter: '#000000ff',
                    },
                },
            },
            [pages.TRAJECTORY]: {
                vars: {
                    btnSummary: 'btn_main',
                    boxTrajectory: {
                        defaultColor: '#ffffff',
                        defaultStroke: '#9b9b9b',
                        defaultLabel: '#eeeeee',
                        hoverColor: '#ffffff',
                        hoverStroke: '#9b9b9b',
                        hoverLabel: '#eeeeee',
                        lineWidth: 1,
                        radius: 4,
                    },
                    boxSpeed: {
                        colorFilter: '#666666ff',
                    },
                },
                names: {
                    propertyBox: {
                        defaultColor: '#8d8d8d',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#ffffff',
                        hoverColor: '#8d8d8d',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#ffffff',
                        lineWidth: 2,
                        radius: 4,
                    },
                    propertyValue: {
                        defaultColor: '#ffffff',
                        defaultStroke: '#eeeeee',
                        defaultLabel: '#222831',
                        hoverColor: '#ffffff',
                        hoverStroke: '#eeeeee',
                        hoverLabel: '#222831',
                        lineWidth: 0,
                        radius: 4,
                    },
                },
            },
            [pages.SUMMARY]: {
                vars: {
                    btnAgain: 'btn_main',
                    title: 'title',
                },
                names: {
                    font_default: 'font_default',
                },
            },
            [pages.ACHIEVEMENT]: {
                vars: {
                    btnBack: 'btn_small',
                    btnRank: 'btn_small',
                },
                names: {
                    font_default: 'font_default',
                    title: 'title',
                },
            },
            [pages.THANKS]: {
                vars: {
                    btnBack: 'btn_small',
                    btnAFD: {
                        defaultColor: '#8764de',
                        defaultStroke: '#8764de',
                        defaultLabel: '#ffffff',
                        hoverColor: '#9774ee',
                        hoverStroke: '#9774ee',
                        hoverLabel: '#ffffff',
                        radius: 4,
                    },
                    btnDDF: {
                        defaultColor: '#cc6699',
                        defaultStroke: '#cc6699',
                        defaultLabel: '#ffffff',
                        hoverColor: '#dc76a9',
                        hoverStroke: '#dc76a9',
                        hoverLabel: '#ffffff',
                        radius: 4,
                    },
                },
            },
            [pages.THEMES]: {
                vars: {
                    btnOK: {
                        defaultColor: '#28b070',
                        defaultLabel: '#ffffff',
                        hoverColor: '#00ff00',
                        hoverLabel: '#ffffff',
                        radius: 80,
                    },
                    btnClose: {
                        defaultColor: '#eb3941',
                        defaultLabel: '#ffffff',
                        hoverColor: '#ff0000',
                        hoverLabel: '#ffffff',
                        radius: 80,
                    },
                },
            },
            [pages.SAVELOAD]: {
                vars: {
                    btnClose: {
                        defaultColor: '#eb3941',
                        hoverColor: '#ff0000',
                    },
                    btnSave: {
                        defaultColor: '#007046',
                        hoverColor: '#76f190',
                    },
                    btnRead: {
                        defaultColor: '#007046',
                        hoverColor: '#76f190',
                    },
                    btnLoad: {
                        defaultColor: '#fc5531',
                        hoverColor: '#f28b54',
                    },
                    btnWrite: {
                        defaultColor: '#fc5531',
                        hoverColor: '#f28b54',
                    },
                    btnBackup: {
                        defaultColor: '#9c30cd',
                        hoverColor: '#bf50fd',
                        radius: 8,
                        defaultLabel: '#ffffff',
                        hoverLabel: '#ffffff',
                    },
                },
                names: {
                    btnSmall: {
                        radius: 80,
                        defaultLabel: '#ffffff',
                        hoverLabel: '#ffffff',
                    },
                },
            },
            [pages.MODE]: {
                names: {
                    font_default: 'font_default',
                    btn: 'btn_main',
                },
            },
            [pages.CELEBRITY]: {
                vars: {
                    btnRetry: 'btn_main',
                    btnNext: 'btn_main2',
                },
            },
        },
        popups: {
            [popups.ACHIEVEMENT]: {
                vars: {
                    bg1: {
                        defaultColor: '#ffffff',
                        defaultStroke: '#84ff55',
                        hoverColor: '#ffffff',
                        hoverStroke: '#84ff55',
                        lineWidth: 1,
                    },
                },
            },
        },
    },
}

function toFiveGrades(common, green) {
    if(common.grade) common.grade[1] = green.text;
    if(common.filter) common.filter[1] = green.filter;
    if(common.gradeBlk) common.gradeBlk[1] = green.gradeBlk;
    if(common.card && green.card) common.card[1] = green.card;
    if(common.summary && green.summary) common.summary[1] = green.summary;
    if(common.achievement && green.achievement) common.achievement[1] = green.achievement;
}

function applyTalentGradeVisuals(common) {
    const colors = [
        ['#111111', '#252525', '#f5f5f5', '#ffffff', '#8a8a8a'],
        ['#238636', '#3fb950', '#ffffff', '#d8ffe3', '#0b2414'],
        ['#ffffff', '#e6e6e6', '#111111', '#111111', '#777777'],
        ['#ff9800', '#ffb74d', '#321900', '#321900', '#6b3500'],
    ];
    common.grade = colors.map(color => color[2]);
    common.filter = colors.map(color => `${color[2]}ff`);
    if(!common.card) return;
    common.card = colors.map((color, grade) => ({
        normal: {
            defaultColor: color[0], defaultStroke: color[4],
            defaultLabel: color[2], hoverColor: color[1], hoverStroke: color[4],
            hoverLabel: grade === 0 ? '#ffffff' : color[4], lineWidth: grade === 3 ? 6 : 4, radius: 4,
        },
        selected: {
            defaultColor: color[1], defaultStroke: color[4],
            defaultLabel: grade === 0 ? '#ffffff' : color[4], hoverColor: color[1], hoverStroke: color[4],
            hoverLabel: grade === 0 ? '#ffffff' : color[4], lineWidth: 4, radius: 4,
        },
    }));
}

toFiveGrades(dark.configs.common, {
    text: '#7dff7d',
    filter: '#7dff7dff',
    box: { defaultColor: '#3cb371', hoverColor: '#66cdaa' },
    card: {
        normal: {
            defaultColor: '#3cb371', defaultStroke: '#f8f8f8', defaultLabel: '#eeeeee',
            hoverColor: '#66cdaa', hoverStroke: '#f8f8f8', hoverLabel: '#3b3b3b',
            lineWidth: 4, radius: 4,
        },
        selected: {
            defaultColor: '#66cdaa', defaultStroke: '#a5ff88', defaultLabel: '#3b3b3b',
            hoverColor: '#66cdaa', hoverStroke: '#a5ff88', hoverLabel: '#3b3b3b',
            lineWidth: 4, radius: 4,
        },
    },
    summary: {
        defaultColor: '#3cb371', defaultStroke: '#f8f8f8', defaultLabel: '#eeeeee',
        hoverColor: '#66cdaa', hoverStroke: '#f8f8f8', hoverLabel: '#3b3b3b',
        lineWidth: 2, radius: 0,
    },
    achievement: {
        defaultColor: '#3cb371', defaultStroke: '#f8f8f8', defaultLabel: '#eeeeee',
        hoverColor: '#66cdaa', hoverStroke: '#f8f8f8', hoverLabel: '#3b3b3b',
        lineWidth: 4, radius: 0,
    },
});

toFiveGrades(light.configs.common, {
    text: '#2e8b57',
    filter: '#2e8b57ff',
    box: { defaultColor: '#66cdaa', hoverColor: '#3cb371' },
    card: {
        normal: {
            defaultColor: '#66cdaa', defaultStroke: '#f8f8f8', defaultLabel: '#666666',
            hoverColor: '#3cb371', hoverStroke: '#f8f8f8', hoverLabel: '#ffffff',
            lineWidth: 4, radius: 4,
        },
        selected: {
            defaultColor: '#3cb371', defaultStroke: '#a5ff88', defaultLabel: '#ffffff',
            hoverColor: '#3cb371', hoverStroke: '#a5ff88', hoverLabel: '#ffffff',
            lineWidth: 4, radius: 4,
        },
    },
    summary: {
        defaultColor: '#3cb371', defaultStroke: '#f8f8f8', defaultLabel: '#ffffff',
        hoverColor: '#66cdaa', hoverStroke: '#f8f8f8', hoverLabel: '#666666',
        lineWidth: 4, radius: 4,
    },
    achievement: {
        defaultColor: '#3cb371', defaultStroke: '#cccccc', defaultLabel: '#eeeeee',
        hoverColor: '#66cdaa', hoverStroke: '#cccccc', hoverLabel: '#3b3b3b',
        lineWidth: 4, radius: 0,
    },
});

toFiveGrades(cyber.configs.common, {
    text: '#7dff7d',
    filter: '#7dff7dff',
    gradeBlk: { defaultColor: '#7dff7d', hoverColor: '#7dff7d', visible: true },
});

applyTalentGradeVisuals(dark.configs.common);
applyTalentGradeVisuals(light.configs.common);

const themes = { default: dark, cyber, dark, light }

export default { themes, pages, popups }
