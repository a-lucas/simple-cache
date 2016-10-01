import { RegexRule, StorageInstance, StorageInstanceCB, StorageType, CacheRules} from './interfaces';
import Helpers from  './helpers';
import {Promise} from 'es6-promise';


export class CacheCommon {
    private _category:string = '';
    private _maxAge:number = 0;

    constructor( private _domain: string, private _config: CacheRules,  private _url: string, private _instanceName, private _storageType) {
        this.setCacheCategory();
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
    getStorageType(): string {
        return this._storageType;
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

        for (i in this._config.maxAge) {
            if (this.getRegexTest (this._config.maxAge[i]) === true) {
                this._category = 'maxAge';
                this._maxAge = this._config.maxAge[i].maxAge;
            }
        }

        for (i in this._config.always) {
            if (this.getRegexTest (this._config.always[i]) === true) {
                this._category = 'always';
            }
        }

        for (i in this._config.never) {
            if (this.getRegexTest (this._config.never[i]) === true) {
                this._category = 'never';
            }
        }
        if(this._category.length === 0) {
            this._category = this._config.default;
        }
    };

}

export class Cache extends CacheCommon {

    constructor( _domain,  private _storageInstance: StorageInstance,  _url: string) {
        super(_domain, _storageInstance.getCacheRules(), _url, _storageInstance.getInstanceName(), _storageInstance.getStorageType());
        this._storageInstance = _storageInstance;
    }

    delete = (): Promise<boolean> => {
        return this._storageInstance.delete(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());

    };

    get = (): Promise<string> => {
        return this._storageInstance.get(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());
    };


    has = (): Promise<boolean> => {
        return this._storageInstance.has(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL());
    };

    set = (html : string, force?: boolean): Promise<boolean> => {
        Helpers.isStringDefined(html);
        Helpers.isOptionalBoolean(force);
        
        if(typeof force === 'undefined') {
            force = false;
        }
        return this._storageInstance.set(this.getDomain(), this.getUrl(), html, this.getCategory(), this.getTTL(), force);
    };
}

export class CacheCB extends CacheCommon{

    constructor( _domain,  private _storageInstance: StorageInstanceCB ,  _url: string) {
        super(_domain, _storageInstance.getCacheRules(), _url, _storageInstance.getInstanceName(), _storageInstance.getStorageType());
    }

    delete = (cb): void => {
        this._storageInstance.delete(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    get = (cb): void => {
        this._storageInstance.get(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    has = (cb): void => {
        this._storageInstance.has(this.getDomain(), this.getUrl(), this.getCategory(), this.getTTL(), cb);
    };

    set = (html : string, force: boolean, cb): void => {
        Helpers.isStringDefined(html);
        Helpers.isBoolean(force);
        this._storageInstance.set(this.getDomain(), this.getUrl(), html, this.getCategory(), this.getTTL(), force, cb);
    };
}

