import {CacheRules} from "./interfaces";
import Helpers from "./helpers";

export default class CacheRuleEngine {

    constructor(private _rules: CacheRules, private scan: boolean = true) {}

    addMaxAgeRule(regex: RegExp, maxAge:number) {
        Helpers.isNotUndefined(regex, maxAge);
        Helpers.isRegexRule({regex: regex});
        Helpers.hasMaxAge({regex: maxAge});
        if(this.scan) {
            const found = this.findRegex(regex);
            if (found!== null) {
                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        this._rules.maxAge.push({regex: regex, maxAge: maxAge});
    }

    addNeverRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule({regex: regex});
        if(this.scan){
            const found = this.findRegex(regex);
            if (found!== null) {
                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        this._rules.never.push({regex: regex});
    }

    addAlwaysRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule({regex: regex});
        if(this.scan) {
            const found = this.findRegex(regex);
            if (found!== null) {
                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        this._rules.never.push({regex: regex});
    }

    mergeWith(rules: CacheRules) {
        //TODO
    }

    setDefault(strategy: string) {
        Helpers.isStringIn(strategy, ['always', 'never']);
        this._rules.default = strategy;
    }

    removeRule(regex: RegExp) {
        Helpers.isNotUndefined(regex);
        Helpers.isRegexRule({regex: regex});
        const found = this.findRegex(regex);
        if (found === null) {
            throw new Error('trying to remove a regex that is not there already');
        }
        this._rules[found.type].splice(found.index, 1);
    }

    removeAllMaxAgeRules(): void {
        this._rules.maxAge = [];
    }

    removeAllNeverRules(): void {
        this._rules.never = [];
    }

    removeAllAlwaysRules(): void {
        this._rules.always = [];
    }

    getRules(): CacheRules {
        return this._rules;
    }

    private findRegex( regex: RegExp ) {
        ['always', 'never', 'maxAge'].forEach((type) => {
            this._rules[type].forEach( (rule, index) => {
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
