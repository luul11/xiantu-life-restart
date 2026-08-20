/**
 * 事件系统
 * 事件按大境界分池（events_lianqi / events_zhuji / events_jindan）
 * 每年从玩家当前大境界的事件池中，按条件过滤后加权随机抽取一个
 *
 * 事件数据字段：
 *   id        事件 id
 *   category  分类：历练 / 战斗 / 闭关 / 事务 / 突破
 *   event     事件描述
 *   weight    抽取权重（默认 10）
 *   grade     品级 0白 1蓝 2紫 3橙
 *   effect    属性变化，如 { CULT: 20, HP: -10 }
 *   include   触发条件（满足才可能被抽到）
 *   exclude   排除条件（满足则不会被抽到）
 *   branch    分支：["条件:跳转事件id"]，命中则继续执行跳转事件
 *   postEvent 无分支命中时的后续文本
 *   NoRandom  不进入随机池（仅作为分支/选择/副本节点）
 *   once      一次性事件：触发过就不再进入随机池
 *   battle    战斗配置：{ name, hp, atk, elem, res, win, lose }（win/lose 为后续事件id）
 *   choice    交互选择：{ prompt, options: [{ label, next }] }（等待玩家选择后继续）
 *   dynamic   动态效果标识：'seclusion'（闭关：消耗50%灵石按 1:1+心境加成 转修为）
 */
class Event {
    constructor(system) {
        this.#system = system;
    }

    #system;
    #pools = {}; // { [realm]: { [id]: event } }
    #skillPity = {};
    #skillConfig = { chance: 0.18, pity: 10 };

    initial({ eventsByRealm }) {
        for(const realm in eventsByRealm) {
            const events = eventsByRealm[realm];
            this.#pools[realm] = events;
            for(const id in events) {
                const event = events[id];
                event.id = Number(id);
                if(!event.branch) continue;
                event.branch = event.branch.map(b=>{
                    b = b.split(':');
                    b[1] = Number(b[1]);
                    return b;
                });
            }
        }
        return this.count;
    }

    config({ skillConfig = {} } = {}) {
        this.#skillConfig = {
            ...this.#skillConfig,
            ...skillConfig,
        };
    }

    resetSkillPity(realmId) {
        if(realmId == null) this.#skillPity = {};
        else this.#skillPity[realmId] = 0;
    }

    get count() {
        let total = 0;
        for(const realm in this.#pools)
            total += Object.keys(this.#pools[realm]).length;
        return total;
    }

    /** 从指定大境界的事件池中加权随机抽一个 */
    random(realmId) {
        const pool = this.#pools[realmId] || {};
        const T = this.#system.request(this.#system.Module.PROPERTY).TYPES;
        const property = this.#system.request(this.#system.Module.PROPERTY);
        const triggered = this.#system.request(this.#system.Module.PROPERTY).get(T.EVT);
        const candidates = [];
        const skillCandidates = [];
        const pity = this.#skillPity[realmId] || 0;
        for(const id in pool) {
            if(pool[id].NoRandom) continue;
            if(pool[id].once && triggered.includes(Number(id))) continue; // 一次性事件
            if(!this.check(id)) continue;
            const candidate = [Number(id), Number(pool[id].weight) || 10];
            if(pool[id].skill && !property.get(T.SKL).includes(Number(pool[id].skill)))
                skillCandidates.push(candidate);
            else
                candidates.push(candidate);
        }
        if(skillCandidates.length) {
            const shouldLearn = pity >= this.#skillConfig.pity
                || Math.random() < Number(this.#skillConfig.chance);
            if(shouldLearn) {
                const eventId = this.#system
                    .function(this.#system.Function.UTIL)
                    .weightRandom(skillCandidates);
                this.#skillPity[realmId] = 0;
                return eventId;
            }
        }
        if(!candidates.length) {
            if(!skillCandidates.length) return null;
            this.#skillPity[realmId] = 0;
            return this.#system
                .function(this.#system.Function.UTIL)
                .weightRandom(skillCandidates);
        }
        const eventId = this.#system
            .function(this.#system.Function.UTIL)
            .weightRandom(candidates);
        this.#skillPity[realmId] = pity + 1;
        return eventId;
    }

    check(eventId) {
        const { include, exclude } = this.get(eventId);
        if(exclude && this.#system.check(exclude)) return false;
        if(include) return this.#system.check(include);
        return true;
    }

    get(eventId) {
        for(const realm in this.#pools) {
            const event = this.#pools[realm][eventId];
            if(event) return this.#system.clone(event);
        }
        throw new Error(`[ERROR] No Event[${eventId}]`);
    }

    information(eventId) {
        const { event: description, category } = this.get(eventId)
        return { description, category };
    }

    do(eventId) {
        const {
            effect, branch, category,
            event: description,
            postEvent, grade, next: directNext,
            battle, choice, dynamic,
        } = this.get(eventId);
        const extra = { battle, choice, dynamic };
        if(branch)
            for(const [cond, next] of branch)
                if(this.#system.check(cond))
                    return { effect, next, description, category, grade, ...extra };
        // 无分支命中：next 为直连后续事件
        return { effect, postEvent, description, category, grade, next: directNext, ...extra };
    }

}

export default Event;
