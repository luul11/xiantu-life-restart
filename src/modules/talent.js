class Talent {
    constructor(system) {
        this.#system = system;
    }

    #system;
    #talents;
    #talentPullCount;
    #talentRate;
    #additions;

    initial({talents}) {
        this.#talents = talents;
        const emt = this.#system.function(this.#system.Function.CONDITION).extractMaxTriggers;
        for(const id in talents) {
            const talent = talents[id];
            talent.id= Number(id);
            talent.grade = Math.min(Math.max(Number(talent.grade) || 0, 0), 3);
            talent.max_triggers = emt(talent.condition);
            if(talent.replacement) {
                for(let key in talent.replacement) {
                    const obj = {};
                    for(let value of talent.replacement[key]) {
                        value = `${value}`.split('*');
                        obj[value[0]||0] = Number(value[1]) || 1;
                    }
                    talent.replacement[key] = obj;
                }
            }
        }
        return this.count;
    }

    get count() {
        return Object.keys(this.#talents).length;
    }

    get #prop() {
        return this.#system.request(this.#system.Module.PROPERTY);
    }

    config({
        talentPullCount = 10, // number of talents to pull from the talent pool
        talentRate = { 0:100, 1:10, 2:1, 3:1, total: 1000 }, // rate of talent pull
        additions = {}, // additional additions
    } = {}) {
        this.#talentPullCount = talentPullCount;
        this.#talentRate = talentRate;
        this.#additions = additions;
    }


    check(talentId) {
        const { condition } = this.get(talentId);
        return this.#system.check(this.#prop, condition);
    }

    get(talentId) {
        const talent = this.#talents[talentId];
        if(!talent) throw new Error(`[ERROR] No Talent[${talentId}]`);
        return this.#system.clone(talent);
    }

    information(talentId) {
        const { grade, name, description, effect, condition, max_triggers } = this.get(talentId)
        return { grade, gradeName: this.gradeName(grade), name, description, effect, condition, max_triggers };
    }

    gradeName(grade) {
        return ['黑色', '白色', '绿色', '橙色'][Math.min(Math.max(Number(grade) || 0, 0), 3)];
    }

    exclude(talents, excludeId) {
        const { exclude } = this.get(excludeId);
        for(const talent of talents) {
            if(exclude) {
                for(const e of exclude) {
                    if(talent == e) return talent;
                }
            }
            const excludeReverse = this.get(talent).exclude;
            if(excludeReverse) {
                for (const e of excludeReverse) {
                    if (excludeId == e) return talent
                }
            }
        }
        return null;
    }

    getAddition(type, value) {
        if(!this.#additions[type]) return {};
        for(const [min, addition] of this.#additions[type]) {
            if(value >= min) return addition;
        }
        return {};
    }

    getRate(additionValues = {}) {
        const rate = this.#system.clone(this.#talentRate);
        const addition = { 1:1, 2:1, 3:1, 4:1 };

        Object.keys(additionValues).forEach(key => {
            const addi = this.getAddition(key, additionValues[key])
            for(const grade in addi)
                addition[grade] += addi[grade];
        });

        for(const grade in addition)
            if(rate[grade] !== undefined)
                rate[grade] *= addition[grade];

        return rate;
    }

    talentRandom(include, additionValues) {
        const rate = this.getRate(additionValues);
        const availableCount = Object.values(this.#talents)
            .filter(talent => !talent.exclusive).length;
        if(availableCount < this.#talentPullCount - (include ? 1 : 0))
            throw new Error('[ERROR] Talent pool is smaller than pull count');

        // 按品级从高到低减随机数，减穿即为命中品级
        const grades = Object.keys(rate)
            .filter(g => g !== 'total')
            .map(Number)
            .sort((a, b) => b - a);
        const randomGrade = () => {
            let randomNumber = Math.floor(Math.random() * rate.total);
            for(const grade of grades)
                if((randomNumber -= rate[grade]) < 0) return grade;
            return 0;
        }

        const talentList = {};
        for(const talentId in this.#talents) {
            const { id, grade, name, description, effect, condition, max_triggers, exclusive } = this.#talents[talentId];
            if(!!exclusive) continue;
            if(id == include) {
                include = { grade, gradeName: this.gradeName(grade), name, description, effect, condition, max_triggers, id };
                continue;
            }
            if(!talentList[grade]) talentList[grade] = [{ grade, gradeName: this.gradeName(grade), name, description, effect, condition, max_triggers, id }];
            else talentList[grade].push({ grade, gradeName: this.gradeName(grade), name, description, effect, condition, max_triggers, id });
        }

        return new Array(this.#talentPullCount)
            .fill(1).map((v, i)=>{
                if(!i && include) return include;
                let grade = randomGrade();
            while(grade > 0 && (!talentList[grade] || talentList[grade].length == 0)) grade--;
            // 该品级已抽空时，从剩余任意品级中抽取
            if(!talentList[grade] || talentList[grade].length == 0)
                grade = Object.keys(talentList).find(g=>talentList[g].length);
            const list = talentList[grade];
            const length = list.length;

            const random = Math.floor(Math.random()*length) % length;
            return list.splice(random,1)[0];
            });
    }

    random(count) {
        const talents = Object
            .keys(this.#talents)
            .filter(id=>!this.#talents[id].exclusive);
        return new Array(count)
            .fill(1)
            .map(()=>talents.splice(
                    Math.floor(Math.random()*talents.length)%talents.length,
                    1
                )[0]
            );
    }

    allocationAddition(talents) {
        if(Array.isArray(talents)) {
            let addition = 0;
            for(const talent of talents)
                addition += this.allocationAddition(talent);
            return addition;
        }
        return Number(this.get(talents).status) || 0;
    }

    do(talentId) {
        const { effect, condition, grade, name, description } = this.get(talentId);
        if(condition && !this.#system.check(condition))
            return null;
        return { effect, grade, gradeName: this.gradeName(grade), name, description };
    }

    replace(talents) {
        const getReplaceList = (talent, talents) => {
            const { replacement } = this.get(talent);
            if(!replacement) return null;
            const list = [];
            if(replacement.grade) {
                this.forEach(({id, grade, exclusive})=>{
                    if(exclusive) return;
                    if(!replacement.grade[grade]) return;
                    if(this.exclude(talents, id)) return;
                    list.push([id, replacement.grade[grade]]);
                })
            }
            if(replacement.talent) {
                for(let id in replacement.talent) {
                    id = Number(id);
                    if(this.exclude(talents, id)) continue;
                    list.push([id, replacement.talent[id]]);
                }
            }
            return list;
        }

        const wr = this.#system.function(this.#system.Function.UTIL).weightRandom;
        const replace = (talent, talents) => {
            const replaceList = getReplaceList(talent, talents);
            if(!replaceList) return talent;
            const rand = wr(replaceList);
            return replace(
                rand, talents.concat(rand)
            );
        }

        const newTalents = this.#system.clone(talents);
        const result = {};
        for(const talent of talents) {
            const replaceId = replace(talent, newTalents);
            if(replaceId != talent) {
                result[talent] = replaceId;
                newTalents.push(replaceId);
            }
        }
        return result;
    }

    forEach(callback) {
        if(typeof callback != 'function') return;
        for(const id in this.#talents)
            callback(this.#system.clone(this.#talents[id]), id);
    }

}

export default Talent;
