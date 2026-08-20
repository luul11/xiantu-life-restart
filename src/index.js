import App from './app.js';
import Life from './modules/life.js';

globalThis.$$eventMap = new Map();
globalThis.$$event = (tag, data) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.forEach(fn=>fn(data));
}
globalThis.$$on = (tag, fn) => {
    let listener = $$eventMap.get(tag);
    if(!listener) {
        listener = new Set();
        $$eventMap.set(tag, listener);
    }
    listener.add(fn);
}
globalThis.$$off = (tag, fn) => {
    const listener = $$eventMap.get(tag);
    if(listener) listener.delete(fn);
}

globalThis.$$copy = async text => {
    const result = await navigator.permissions.query({ name: "clipboard-write" })
    if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(text)
        return true;
    }
    const input = document.createElement('input');
    input.setAttribute('style', 'opacity: 0;');
    document.body.appendChild(input);
    input.value = text;
    input.select();
    const r = document.execCommand("copy");
    document.body.removeChild(input);
    return r;
}

globalThis.$$read = async ()=>{
    const result = await navigator.permissions.query({ name: "clipboard-read" })
    if (result.state == "granted" || result.state == "prompt") {
        return await navigator.clipboard.readText();
    }
    const input = document.createElement('input');
    input.setAttribute('style', 'opacity: 0;');
    document.body.appendChild(input);
    input.focus();
    const r = document.execCommand("paste");
    const text = input.value;
    document.body.removeChild(input);
    return r?text:r;
};

const core = new Life();
const game = new App();
globalThis.core = core;
globalThis.game = game;

const query = {};
location.search.substr(1).split('&').forEach(item => {
    const parts = item.split('=');
    query[parts[0]] = parts[1];
});

core.config({
    defaultPropertyPoints: 20, // 开局可分配的属性点
    talentSelectLimit: 3, // 最多可选天赋数
    propertyAllocateLimit: [0, 20], // 单项属性分配范围
    defaultPropertys: {}, // 默认属性（初始值见 modules/property.js）
    talentConfig: { // 天赋抽取配置
        talentPullCount: 10, // 天赋 10 连抽
        talentRate: { 0:15, 1:75, 2:8, 3:2, total: 100 },
        additions: { // 重开次数越多，绿色天赋概率越高
            TMS: [
                [ 10, { 2: 1 }],
                [ 30, { 2: 2 }],
                [ 50, { 2: 3 }],
                [ 70, { 2: 4 }],
                [100, { 2: 5 }],
            ],
        },
    },
});
game.start(query);
