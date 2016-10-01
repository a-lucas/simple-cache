import {Promise} from 'es6-promise';
import Helpers from './helpers';

export interface RegexRule {
    regex: RegExp
}

export interface MaxAgeRegexRule extends RegexRule{
    maxAge: number
}

export interface CacheRules{
    maxAge: MaxAgeRegexRule[],
    always: RegexRule[],
    never: RegexRule[],
    default: string
}

export interface RedisStorageConfig{
    host: string;
    port: number;
    path?: string;
    url?: string;
    socket_keepalive?: boolean;
    password?: string;
    db?: string;
}

export interface parsedURL {
    domain: string,
    relativeURL: string
}

export interface CallBackBooleanParam {
    (err: string, res: boolean): any
}

export interface CallBackStringParam {
    (err: string, res: string): any
}

export interface CallBackStringArrayParam {
    (err: string, res: string[]): any
}

export abstract class StorageInstance {
    
    abstract destroy(): void;
    abstract delete(domain: string, url: string, category: string, ttl: number): Promise<boolean>;
    abstract get(domain: string, url: string, category: string, ttl: number): Promise<string>;
    abstract has(domain: string, url: string, category: string, ttl: number): Promise<boolean>;
    abstract set(domain: string, url: string, value: string, category: string,  ttl: number, force: boolean): Promise<boolean>;

    abstract clearCache(): Promise<boolean>;
    abstract clearDomain(domain: string): Promise<boolean>;
    abstract getCachedDomains(): Promise <string[]>;
    abstract getCachedURLs(domain: string): Promise <string[]>;
}

export abstract class StorageInstanceCB {

    abstract destroy(cb: CallBackBooleanParam): void;
    abstract delete(domain: string, url: string, category: string, ttl: number, cb: CallBackBooleanParam): void;
    abstract get(domain: string, url: string, category: string, ttl: number, cb: CallBackStringParam): void;
    abstract has(domain: string, url: string, category: string, ttl: number, cb: CallBackBooleanParam): void;
    abstract set(domain: string, url: string, value: string, category: string,  ttl: number, force: boolean, cb: CallBackBooleanParam): void;
    abstract clearCache(cb: CallBackBooleanParam): void;
    abstract clearDomain(domain: string, cb: CallBackBooleanParam): void;
    abstract getCachedDomains(cb: CallBackStringArrayParam): void;
    abstract getCachedURLs(domain: string, cb: CallBackStringArrayParam): void;
}
