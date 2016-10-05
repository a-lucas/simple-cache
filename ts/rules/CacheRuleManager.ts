import {CacheRules, option_on_existing_regex, RegexRule, MaxAgeRegexRule, DomainRule} from "../interfaces";
import Helpers from "../helpers";
const debug = require('debug')('simple-url-cache');

export default class CacheRuleManager {
    
    constructor(public cacheRules: CacheRules, private on_existing_regex: option_on_existing_regex) {}

    addMaxAgeRule( domain: string | RegExp, regex: RegExp, maxAge: number, ignoreQuery?:boolean) {
        Helpers.isNotUndefined(domain, regex, maxAge);
        const regexRule = { regex: regex, maxAge: maxAge, ignoreQuery: ignoreQuery ? ignoreQuery : false};
        Helpers.isMaxAgeRegexRule(regexRule);
        const found = this.findRegex(domain, regexRule);
        this.add(domain, regexRule, 'maxAge', found);
    }

    addNeverRule(domain: string | RegExp, regex: RegExp, ignoreQuery?: boolean) {
        Helpers.isNotUndefined(regex);
        const regexRule = { regex: regex, ignoreQuery: ignoreQuery ? ignoreQuery : false};
        Helpers.isConfigRegexRule(regexRule);
        const found = this.findRegex(domain, regexRule);
        this.add(domain, regexRule, 'never', found);
    }

    addAlwaysRule(domain: string | RegExp, regex: RegExp, ignoreQuery?: boolean) {
        Helpers.isNotUndefined(regex);
        const regexRule = { regex: regex, ignoreQuery: ignoreQuery ? ignoreQuery : false};
        Helpers.isConfigRegexRule(regexRule);
        const found = this.findRegex(domain, regexRule);
        this.add(domain, regexRule, 'always', found);
    }

    getRules(): CacheRules {
        return this.cacheRules;
    }

    setDefault(strategy: string) {
        Helpers.isStringIn(strategy, ['always', 'never']);
        this.cacheRules.default = strategy;
    }

    removeRule(domain:string | RegExp, rule: RegexRule) {
        Helpers.isNotUndefined(rule);
        Helpers.isConfigRegexRule(rule);
        const found = this.findRegex(domain, rule);
        if (found !== null) {
            this.cacheRules[found.type][found.index].rules.splice(found.subIndex, 1);
            if (this.cacheRules[found.type][found.index].rules.length === 0) {
                this.cacheRules[found.type].splice(found.index, 1);
            }
        }
    }

    removeAllMaxAgeRules(): void {
        this.cacheRules.maxAge = {};
    }

    removeAllNeverRules(): void {
        this.cacheRules.never = {};
    }

    removeAllAlwaysRules(domain?:string): void {
        this.cacheRules.always = {};
    }

    //internal method made public for access out of scope (CacheRuleEngine)
    updateRules(cacheRules: CacheRules) {
        this.cacheRules = cacheRules;
    }

    private checkDomainMatch(stored: RegExp | string, input: RegExp | string) {
        if( typeof stored === 'string' && typeof input === 'string') {
            return stored === input;
        } else if ( stored instanceof RegExp && input instanceof RegExp) {
            return Helpers.SameRegex(stored, input);
        } else {
            return false;
        }
    }

    private findRegex( domain: string | RegExp, rule: RegexRule  ) {
        let  info = null,
            index,
            subIndex;

        ['always', 'never', 'maxAge'].forEach((type: string) => {
            for( index = 0; index < this.cacheRules[type].length; index++) {
                if (this.checkDomainMatch(this.cacheRules[type][index].domain, domain)) {
                    for (subIndex = 0; subIndex < this.cacheRules[type][index].rules.length; subIndex++) {
                        if  (Helpers.SameRegex(rule.regex, this.cacheRules[type][index].rules[subIndex].regex)) {
                            info = {
                                type: type,
                                index: index,
                                subIndex: subIndex
                            };
                            break;
                        }
                    }
                }
            }
        });
        return info;
    }

    private add(domain: string | RegExp, rule: RegexRule, where: string, found) {
        debug('adding rule ', domain, rule, where, found);
        debug('before: ', this.cacheRules);

        if (found !== null) {
            switch(this.on_existing_regex) {
                case 'ignore':
                    return;
                case 'replace':
                    debug('replacing: ', this.cacheRules[found.type][found.index].rules, found.subIndex);
                    this.cacheRules[found.type][found.index].rules.splice(found.subIndex, 1);
                    break;
                case 'error':
                    throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
            }
        }
        if(found !== null && found.type === where) {
            this.cacheRules[where][found.index].rules.push(rule);
        } else {
            let index2update,
                index;
            for(index = 0; index < this.cacheRules[where].length ; index++) {
                if (this.checkDomainMatch(this.cacheRules[where][index].domain, domain)) {
                    index2update = index;
                }
            }
            if(typeof index2update === 'number') {
                debug('A domain already exists, so pusing rules at index ', index2update, this.cacheRules[where][index2update]);
                this.cacheRules[where][index2update].rules.push(rule);
            } else {
                this.cacheRules[where].push({
                    domain: domain,
                    rules: [ rule ]
                });
            }
        }

        return;
    }

}
