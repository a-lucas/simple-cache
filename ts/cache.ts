import { RegexRule, StorageInstance, StorageInstanceCB, CacheRules, CallBackBooleanParam, CallBackStringParam} from './interfaces';
import Helpers from  './helpers';
import {Promise} from 'es6-promise';
import CacheEngine from "./CacheEngine";
import Instance from "./instance";
import RedisStorageInstancePromise from "./redis/instancePromise";
import RedisStorageInstanceCB from "./redis/instanceCB";

export class CacheCommon {

    private _category:string = '';
    private _maxAge:number = 0;
    protected _storageInstanceCB: RedisStorageInstanceCB;
    protected _storageInstancePromise: RedisStorageInstancePromise;

    constructor( private _domain: string, _storageInstance: RedisStorageInstanceCB | RedisStorageInstancePromise, protected _instanceName: string,  private _url: string ) {
        if(this.isRedisCB(_storageInstance)) {
            this._storageInstanceCB = _storageInstance;
        } else {
            this._storageInstancePromise = _storageInstance;
        }
        this.setCacheCategory();
    }

    private isRedisCB(storageInstance: RedisStorageInstanceCB | RedisStorageInstancePromise): storageInstance is RedisStorageInstanceCB {
        return (<RedisStorageInstanceCB>storageInstance).type === 'cb';
    }

    getDomain(): string {
        return this._domain;
    }

    getCategory(): string  {
        return this._category;
    }

    getInstanceName(): string {
        return this._instanceName;
    }

    getUrl(): string {
        return this._url;
    }

    getTTL(): number {
        return this._maxAge;
    }

    private getRegexTest = (u: RegexRule): boolean => {
        return u.regex.test(this._url);
    };

    private setCacheCategory(): void  {
        let i;

        const config = CacheEngine.instances[this._instanceName].getCacheRuleEngine().getRules();

        for (i in config.maxAge) {
            if (this.getRegexTest (config.maxAge[i]) === true) {
                this._category = 'maxAge';
                this._maxAge = config.maxAge[i].maxAge;
            }
        }

        for (i in config.always) {
            if (this.getRegexTest (config.always[i]) === true) {
                this._category = 'always';
            }
        }

        for (i in config.never) {
            if (this.getRegexTest (config.never[i]) === true) {
                this._category = 'never';
            }
        }
        if(this._category.length === 0) {
            this._category = config.default;
        }
    };

}

export class CachePromise extends CacheCommon {


    delete = (): Promise<boolean> => {
        return this._storageInstancePromise.delete(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());

    };

    get = (): Promise<string> => {
        return this._storageInstancePromise.get(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());
    };


    has = (): Promise<boolean> => {
        return this._storageInstancePromise.has(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());
    };

    set = (html : string, force?: boolean): Promise<boolean> => {
        Helpers.isStringDefined(html);
        Helpers.isOptionalBoolean(force);
        
        if(typeof force === 'undefined') {
            force = false;
        }
        return this._storageInstancePromise.set(this.getDomain(), this.getUrl(), html, this.getCategory(), this.getTTL(), force);
    };
}

export class CacheCB extends CacheCommon{

    delete = (cb: CallBackBooleanParam): void => {
        this._storageInstanceCB.delete(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    get = (cb: CallBackStringParam): void => {
        this._storageInstanceCB.get(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    has = (cb: CallBackBooleanParam): void => {
        this._storageInstanceCB.has(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    set = (html : string, force: boolean, cb: CallBackBooleanParam): void => {
        Helpers.isStringDefined(html);
        Helpers.isBoolean(force);
        this._storageInstanceCB.set(this.getDomain(), this.getUrl(), html, this.getCategory(), this.getTTL(), force, cb);
    };
}

