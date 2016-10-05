import {RedisStorageConfig, parsedURL} from './interfaces';
import * as nodeurl from 'url';
import CacheEngine from "./cacheEngine/CacheEngine";

export default class Helpers {

    static isRedis(storageConfig:RedisStorageConfig): storageConfig is RedisStorageConfig {
        return typeof (<RedisStorageConfig>storageConfig).host !== 'undefined';
    }

    static isStringDefined(input: string) {
        if(typeof input !== 'string' || input.length === 0) {
            Helpers.invalidParameterError('this should be a non empty string', input);
        }
    }

    static isStringIn(input: string, values: string[]) {
        if(typeof input !== 'string') {
            return false;
        }
        let valid = false
        values.forEach(value=> {
            if (value === input) {
                valid = true;
            }
        });
        if(!valid) {
            Helpers.invalidParameterError('This string should contain only these values : ' + values.join(', '), input);
        }
    }

    static parseURL(url: string): parsedURL {
        Helpers.isStringDefined(url);

        const parsedURL = nodeurl.parse(url);
        let relativeURL = parsedURL.path;
        if (!/\//.test(relativeURL)) {
            relativeURL = '/' + relativeURL;
        }
        parsedURL.pathname = null;
        parsedURL.path = null;
        parsedURL.hash = null;
        parsedURL.query = null;
        parsedURL.search = null;

        let domain = nodeurl.format(parsedURL);
        if (domain === relativeURL) {
            Helpers.invalidParameterError('invalid URL ',url);
        }
        return {
            domain: domain,
            relativeURL: relativeURL
        };
    }

    static isNotUndefined( ...input: any[] ) {
        if(input.length = 0){
            Helpers.invalidParameterError('No parameters required', input);
        }
        for(var i in input) {
            if (typeof input === 'undefined') {
                Helpers.invalidParameterError('Undefined paraneter provided at index ',i);
            }
        }
    }

    static isArray(data:Array<any>) {
        if((data instanceof Array) === false) {
            Helpers.invalidParameterError('This should be an array', data);
        }
    }

    static hasMaxAge(data:any) {
        if (typeof data.maxAge !== 'number'){
            Helpers.invalidParameterError('This rule misses a maxAge property', data);
        }
    }

    static isBoolean(data: boolean) {
        if(typeof data !== 'boolean') {
            Helpers.invalidParameterError('This is not a boolean probably the force param missing', data);
        }
    }

    static isOptionalBoolean(data: boolean) {
        if (typeof data !== 'undefined' && typeof data !== 'boolean') {
            Helpers.invalidParameterError('You provided an optional boolean but this is not a boolean', data);
        }
    }

    static SameRegex(r1: RegExp, r2: RegExp): boolean {
        if (r1 instanceof RegExp && r2 instanceof RegExp) {
            var props = ["global", "multiline", "ignoreCase", "source"];
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (r1[prop] !== r2[prop]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }


    static isMaxAgeRegexRule(rule: any) {
        Helpers.isConfigRegexRule(rule);
        if( typeof rule.maxAge !== 'number') {
            Helpers.invalidParameterError('This isnt a valid MaxAge RegexRule - one of the rule misses maxAge prop', rule);
        }
    }

    static isConfigRegexRule(rule: any) {

        if((rule.regex instanceof  RegExp) === false) {
            Helpers.invalidParameterError('This isnt a valid RegexRule - the rule is not a regex', rule);
        }
        if( typeof rule.ignoreQuery !== 'boolean') {
            Helpers.invalidParameterError('This isnt a valid RegexRule - the rule misses ignoreQuery prop', rule);
        }

    }

    static validateCacheConfig(cacheRules) {
        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
        ['always', 'never', 'maxAge'].forEach((type) => {
            for(var key in cacheRules[type]) {
                if(typeof cacheRules[type][key].domain !== 'string' && (cacheRules[type][key].domain instanceof RegExp) === false ) {
                    Helpers.invalidParameterError('Domain must be either a regex or a string', cacheRules[type][key].domain);
                }
                Helpers.isArray(cacheRules[type][key].rules);
                cacheRules[type][key].rules.forEach(rule => {
                    if (type === 'maxAge') {
                        Helpers.isMaxAgeRegexRule(rule);
                    } else {
                        Helpers.isConfigRegexRule(rule);
                    }
                });
            }
        });
    }

    // from http://stackoverflow.com/questions/12075927/serialization-of-regexp
    static JSONRegExpReplacer(key, value) {
        if (value instanceof RegExp) {
            return ("__REGEXP " + value.toString());
        }
        else {
            return value;
        }
    }

    static JSONRegExpReviver(key, value) {
        if (value.toString().indexOf("__REGEXP ") == 0) {
            var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
            return new RegExp(m[1], m[2] || "");
        } else {
            return value;
        }
    }

    static getConfigKey() {
        return 'url-cache:ruleconfig';
    }

    static validateRedisStorageConfig(data: any) {
        //todo
        return false;
    }

    static invalidParameterError(name, value) {
        throw new TypeError('Invalid parameter: ' + name + '. Value received: ' + JSON.stringify(value));
    }

    static RedisError(description: string, msg: string) {
        throw new Error('Redis: ' + description + '. Error received: ' + msg);
    }
}
