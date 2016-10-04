import {Promise} from 'es6-promise';

import {CallBackBooleanParam, method, CacheRules, CallBackStringParam, CallBackStringArrayParam} from "../interfaces";

abstract class Storage {
    protected method: method;
    abstract getCacheRules(): CacheRules;
    abstract destroy(): void;

    getMethod(): method {
        return this.method;
    }

}

export abstract class StoragePromise extends Storage{

    abstract delete(domain: string, url: string, category: string, ttl: number): Promise<boolean>;
    abstract get(domain: string, url: string, category: string, ttl: number): Promise<string>;
    abstract has(domain: string, url: string, category: string, ttl: number): Promise<boolean>;
    abstract set(domain: string, url: string, value: string, category: string,  ttl: number, force: boolean): Promise<boolean>;

    abstract clearCache(): Promise<boolean>;
    abstract clearDomain(domain: string): Promise<boolean>;
    abstract getCachedDomains(): Promise <string[]>;
    abstract getCachedURLs(domain: string): Promise <string[]>;
}

export abstract class StorageCB extends Storage{

    abstract delete(domain: string, url: string, category: string, ttl: number, cb: CallBackBooleanParam): void;
    abstract get(domain: string, url: string, category: string, ttl: number, cb: CallBackStringParam): void;
    abstract has(domain: string, url: string, category: string, ttl: number, cb: CallBackBooleanParam): void;
    abstract set(domain: string, url: string, value: string, category: string,  ttl: number, force: boolean, cb: CallBackBooleanParam): void;

    abstract clearCache(cb: CallBackBooleanParam): void;
    abstract clearDomain(domain: string, cb: CallBackBooleanParam): void;
    abstract getCachedDomains(cb: CallBackStringArrayParam): void;
    abstract getCachedURLs(domain: string, cb: CallBackStringArrayParam): void;
}

