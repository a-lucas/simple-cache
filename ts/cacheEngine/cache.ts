import { RegexRule, CallBackBooleanParam, CallBackStringParam} from '../interfaces';
import Helpers from  '../helpers';
import {Promise} from 'es6-promise';
import RedisStoragePromise from "../redis/instancePromise";
import RedisStorageCB from "../redis/instanceCB";

var debug = require('debug')('simple-url-cache');

export class UrlCommon {

    private _category:string = '';
    private _maxAge:number = 0;
    protected _storageCB: RedisStorageCB;
    protected _storagePromise: RedisStoragePromise;
    protected _storage: RedisStorageCB | RedisStoragePromise;

    constructor( private _domain: string, _storageInstance: RedisStorageCB | RedisStoragePromise, protected _instanceName: string,  private _url: string ) {
        if(this.hasPromise(_storageInstance)) {
            this._storagePromise = _storageInstance;
            this._storage = _storageInstance;
        } else {
            this._storageCB = _storageInstance;
            this._storage = _storageInstance;
        }
        this.setCacheCategory();
    }

    protected hasPromise(storage: RedisStorageCB | RedisStoragePromise): storage is RedisStoragePromise {
        return (<RedisStoragePromise>storage).getMethod() === 'promise';
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

    public setCacheCategory(): void  {
        let i;
        const config = this._storage.getCacheRules();

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

    private getRegexTest = (u: RegexRule): boolean => {
        return u.regex.test(this._url);
    };

}

export class UrlPromise extends UrlCommon {

    delete = (): Promise<boolean> => {
        return this._storagePromise.delete(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());

    };

    get = (): Promise<string> => {
        return this._storagePromise.get(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());
    };


    has = (): Promise<boolean> => {
        return this._storagePromise.has(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());
    };

    set = (html : string, force?: boolean): Promise<boolean> => {
        Helpers.isStringDefined(html);
        Helpers.isOptionalBoolean(force);
        
        if(typeof force === 'undefined') {
            force = false;
        }
        return this._storagePromise.set(this.getDomain(), this.getUrl(), html, this.getCategory(), this.getTTL(), force);
    };
}

export class UrlCB extends UrlCommon{

    delete = (cb: CallBackBooleanParam): void => {
        this._storageCB.delete(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    get = (cb: CallBackStringParam): void => {
        this._storageCB.get(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    has = (cb: CallBackBooleanParam): void => {
        this._storageCB.has(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    set = (html : string, force: boolean, cb: CallBackBooleanParam): void => {
        Helpers.isStringDefined(html);
        Helpers.isBoolean(force);
        this._storageCB.set(this.getDomain(), this.getUrl(), html, this.getCategory(), this.getTTL(), force, cb);
    };
}

