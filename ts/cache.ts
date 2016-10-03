import { RegexRule, StorageInstancePromise, StorageInstanceCB, CacheRules, CallBackBooleanParam, CallBackStringParam} from './interfaces';
import Helpers from  './helpers';
import {Promise} from 'es6-promise';
import CacheEngine from "./CacheEngine";
import Instance from "./instance";
import RedisStorageInstancePromise from "./redis/instancePromise";
import RedisStorageInstanceCB from "./redis/instanceCB";

var debug = require('debug')('simple-url-cache');

export class CacheCommon {

    private _category:string = '';
    private _maxAge:number = 0;
    protected _storageInstanceCB: RedisStorageInstanceCB;
    protected _storageInstancePromise: RedisStorageInstancePromise;
    protected _storageInstance: RedisStorageInstanceCB | RedisStorageInstancePromise;

    constructor( private _domain: string, _storageInstance: RedisStorageInstanceCB | RedisStorageInstancePromise, protected _instanceName: string,  private _url: string ) {
        if(this.hasPromise(_storageInstance)) {
            this._storageInstancePromise = _storageInstance;
            this._storageInstance = _storageInstance;
        } else {
            this._storageInstanceCB = _storageInstance;
            this._storageInstance = _storageInstance;
        }
        this.setCacheCategory();
    }

    protected hasPromise(storageInstance: RedisStorageInstanceCB | RedisStorageInstancePromise): storageInstance is RedisStorageInstancePromise {
        return (<RedisStorageInstancePromise>storageInstance).getMethod() === 'promise';
    }

    /**
     * recalculate the maxAge and category
     */
    check(): this {
        this.setCacheCategory();
        return this;
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

    public setCacheCategory(): void  {
        let i;
        const config = this._storageInstance.getCacheRules();

        for (i in config.maxAge) {
            if (this.getRegexTest (config.maxAge[i]) === true) {
                this._category = 'maxAge';
                this._maxAge = config.maxAge[i].maxAge;
                return;
            }
        }

        for (i in config.always) {
            if (this.getRegexTest (config.always[i]) === true) {
                this._category = 'always';
                return;
            }
        }

        for (i in config.never) {
            if (this.getRegexTest (config.never[i]) === true) {
                this._category = 'never';
                return;
            }
        }

        this._category = config.default;
        //debug(this.getCategory());
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

