import {CacheRules, option_on_existing_regex} from "../interfaces";
import Helpers from "../helpers";
const debug = require('debug')('simple-url-cache');

export default class CacheRuleManager {
    
    constructor(public cacheRules: CacheRules, private on_existing_regex: option_on_existing_regex) {}

    addMaxAgeRule(regex: RegExp, maxAge:number) {
        Helpers.isNotUndefined(regex, maxAge);
        Helpers.isRegexRule(regex);
        Helpers.hasMaxAge({regex: maxAge});
        const found = this.findRegex(regex);
        this.add({regex: regex, maxAge: maxAge}, 'maxAge', found);
    }

    addNeverRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule(regex);
        const found = this.findRegex(regex);
        this.add({regex: regex}, 'never', found);
    }

    addAlwaysRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule(regex);
        const found = this.findRegex(regex);
        this.add({regex: regex}, 'always', found);
    }

    getRules(): CacheRules {
        return this.cacheRules;
    }


    mergeWith(rules: CacheRules) {
        //TODO
    }

    setDefault(strategy: string) {
        Helpers.isStringIn(strategy, ['always', 'never']);
        this.cacheRules.default = strategy;
    }

    removeRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule(regex);
        const found = this.findRegex(regex);
        if (found !== null) {
            this.cacheRules[found.type].splice(found.index, 1);
        }
    }

    removeAllMaxAgeRules(): void {
        this.cacheRules.maxAge = [];
    }

    removeAllNeverRules(): void {
        this.cacheRules.never = [];
    }

    removeAllAlwaysRules(): void {
        this.cacheRules.always = [];
    }

    //internal method made public for access out of scope (CacheRuleEngine)
    updateRules(cacheRules: CacheRules) {
        this.cacheRules = cacheRules;
    }


    private findRegex( regex: RegExp ) {
        let  info = null,
            index,
            rule;

        ['always', 'never', 'maxAge'].forEach((type: string) => {
            for(index=0; index<this.cacheRules[type].length; index++) {
                if (Helpers.SameRegex(this.cacheRules[type][index].regex, regex)) {
                    info =  {
                        type: type,
                        index: index
                    };
                    break;
                }
            }
        });
        return info;
    }

    private add(rule, where, found) {
        if (found!== null) {
            switch(this.on_existing_regex) {
                case 'ignore':
                    break;
                case 'replace':
                    this.cacheRules[found.type].splice(found.index, 1);
                    this.cacheRules[where].push(rule);
                    break;
                case 'error':
                    throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        } else {
            this.cacheRules[where].push(rule);
        }
    }

}
