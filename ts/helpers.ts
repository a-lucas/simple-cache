import {RedisStorageConfig} from './interfaces';

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

    static isArray(data:any) {
        if((data instanceof Array) === false) {
            Helpers.invalidParameterError('This should be an array', data);
        }
    }

    static isRegexRule(data:any) {
        if ((data.regex instanceof RegExp) === false) {
            Helpers.invalidParameterError('This should be a Regexp', data);
        }
    }

    static hasMaxAge(data:any) {
        if (typeof data.maxAge !== 'number'){
            Helpers.invalidParameterError('This rule misses a maxAge property', data);
        }
    }

    static isBoolean(data: any) {
        if(typeof data !== 'boolean') {
            Helpers.invalidParameterError('This is not a boolean probably the force param missing', data);
        }
    }

    static isOptionalBoolean(data: any) {
        if (typeof data !== 'undefined' && typeof data !== 'boolean') {
            Helpers.invalidParameterError('You provided an optional boolean but this is not a boolean', data);
        }
    }

    static validateCacheConfig(cacheRules) {
        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
        ['always', 'never', 'maxAge'].forEach((type) => {
            Helpers.isArray(cacheRules[type]);

            cacheRules[type].forEach(rule => {
                Helpers.isRegexRule(rule);
                if (type === 'maxAge') {
                    Helpers.hasMaxAge(rule);
                }
            });
        });
    }


    static validateRedisStorageConfig(data: any) {
        //todo
    }

    static invalidParameterError(name, value) {
        throw new TypeError('Invalid parameter: ' + name + '. Value received: ' + JSON.stringify(value));
    }
}
