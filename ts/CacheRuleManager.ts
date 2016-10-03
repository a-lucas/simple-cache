import {CacheRules} from "./interfaces";
import Helpers from "./helpers";
import * as uuid from 'node-uuid';

export default class CacheRuleManager {
    
    private uuid: string;
    
    constructor(public cacheRules: CacheRules, private scan: boolean) {
        this.uuid = uuid.v1();
    }

    getUUID(): string {
        return this.uuid;
    }

    updateRules(cacheRules: CacheRules) {
        this.cacheRules = cacheRules;
    }
    
    addMaxAgeRule(regex: RegExp, maxAge:number) {
        Helpers.isNotUndefined(regex, maxAge);
        Helpers.isRegexRule(regex);
        Helpers.hasMaxAge({regex: maxAge});
        if(this.scan) {
            const found = this.findRegex(regex);
            if (found!== null) {
                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        this.cacheRules.maxAge.push({regex: regex, maxAge: maxAge});
    }

    addNeverRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule(regex);
        if(this.scan){
            const found = this.findRegex(regex);
            if (found!== null) {
                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        this.cacheRules.never.push({regex: regex});
    }

    addAlwaysRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule(regex);
        if(this.scan) {
            const found = this.findRegex(regex);
            if (found!== null) {
                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        this.cacheRules.never.push({regex: regex});
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
        if (found === null) {
            throw new Error('trying to remove a regex that is not there already');
        }
        this.cacheRules[found.type].splice(found.index, 1);
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

    getRules(): CacheRules {
        return this.cacheRules;
    }

    private findRegex( regex: RegExp ) {
        ['always', 'never', 'maxAge'].forEach((type) => {
            this.cacheRules[type].forEach( (rule, index) => {
                if (Helpers.SameRegex(rule.regex, regex)) {
                    return {
                        type: type,
                        index: index
                    };
                }
            });
        });
        return null;
    }
}
