// Type definitions for simple-url-cache
// Project: https://github.com/a-lucas/simple-url-cache
// Definitions by: Antoine LUCAS <https://github.com/a-lucas>

export namespace RedisUrlCache {
    interface RegexRule {
        regex:RegExp,
        ignoreQuery?:boolean
    }

    interface MaxAgeRegexRule extends RegexRule {
        maxAge:number
    }

    interface DomainRule<T> {
        domain:string | RegExp,
        rules:T[]
    }

    export interface IGetResults {
        content: string,
        createdOn: number,
        extra: any
    }

    interface CallBackGetResultsParam {
        (err: string | Error, res?: IGetResults): any
    }

    interface CallBackBooleanParam {
        (err:string, res:boolean):any
    }

    interface CallBackStringParam {
        (err:string, res:string):any
    }

    interface CallBackStringArrayParam {
        (err:string, res:string[]):any
    }

    interface CallBackNoParam {
        (err:string):any
    }

    export interface InstanceConfig {
        on_existing_regex?:option_on_existing_regex //when adding a regex , and a similar is found, either replace it, ignore it, or throw an error
        on_publish_update?:boolean // when the cacheEngine.publish( is called, will scann all existing created url objects, and re-calculate the url's category
    }
    
    export interface CacheRules {
        maxAge:DomainRule<MaxAgeRegexRule>[],
        always:DomainRule<RegexRule>[],
        never:DomainRule<RegexRule>[],
        default:string
    }

    export interface RedisStorageConfig {
        host:string;
        port:number;
        path?:string;
        url?:string;
        socket_keepalive?:boolean;
        password?:string;
        db?:string;
    }

    export type option_on_existing_regex = 'replace' | 'ignore' | 'error';

    export class CachePromise {

        getDomain():string

        getCategory():string

        getInstanceName():string

        getUrl():string

        getTTL():number

        setCacheCategory():void

        /**
         * Resolve to true if exists, false if not, and rejects an Error if any
         */
        has():Promise<boolean>;

        /**
         * Resolve to true if deleted, false if not there, and rejects an Error if any
         */
        delete():Promise<boolean>;

        /**
         * Resolves to the html, Rejects undefined if not cached
         */
        get():Promise<IGetResults>;

        set(html:string, extra: Object):Promise<boolean>;

        set(html:string, extra: Object, force:boolean):Promise<boolean>;
    }

    export class CacheCB {

        getDomain():string

        getCategory():string

        getInstanceName():string

        getUrl():string

        getTTL():number

        setCacheCategory():void

        has(cb:CallBackBooleanParam):void;

        /**
         * returns to true if deleted, false if not there, and an Error if any
         */
        delete(cb:CallBackBooleanParam):void

        /**
         * Resolves to the html, Rejects undefined if not cached
         */
        get(cb:CallBackGetResultsParam):void;

        /**
         * Resolve to true if cached, false if lready cached, and rejects an Error if any
         * @param html
         * @param force
         */
        set(html:string, extra: Object, force:boolean, cb:CallBackBooleanParam):void
    }

    export class CacheEnginePromise {
        /**
         *
         * @param defaultDomain This is the default domain when the url doesn't contain any host information.
         * It can be of any form, usually http:   // user:pass @ host.com : 8080
         * @param storageConfig: Either a FileStorageConfig or a RedisStorageConfig
         * @param cacheRules
         */
        constructor(defaultDomain:string, instanceDefinition:Instance)

        /**
         *
         * @param domain If no domain is provided, then the default domain will be cleared
         */
        clearDomain():Promise<boolean>;
        clearDomain(domain:string):Promise<boolean>;

        clearInstance():Promise<boolean>

        getStoredHostnames():Promise<string[]>

        getStoredURLs():Promise<string[]>
        getStoredURLs(domain:string):Promise<string[]>

        /**
         *
         * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
         * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
         *
         *
         * @returns {Cache}
         */
        url(url:string):CachePromise;
    }

    export class CacheEngineCB {
        /**
         *
         * @param defaultDomain This is the default domain when the url doesn't contain any host information.
         * It can be of any form, usually http:   // user:pass @ host.com : 8080
         * @param storageConfig: Either a FileStorageConfig or a RedisStorageConfig
         * @param cacheRules
         */
        constructor(defaultDomain:string, instanceDefinition:Instance)

        /**
         *
         * @param domain If no domain is provided, then the default domain will be cleared
         */
        clearDomain(cb:CallBackBooleanParam):void

        clearDomain(domain:string, cb:CallBackBooleanParam):void

        clearInstance(cb:CallBackBooleanParam):void

        getStoredHostnames(cb:CallBackStringArrayParam):void

        getStoredURLs(cb:CallBackStringArrayParam):void

        getStoredURLs(domain:string, cb:CallBackStringArrayParam):void

        /**
         *
         * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
         * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
         *
         *
         * @returns {Cache}
         */
        url(url:string):CacheCB;
    }

    export class CacheRuleManager {
        addMaxAgeRule(domain:string | RegExp, regex:RegExp, maxAge:number, ignoreQuery?:boolean):void

        addAlwaysRule(domain:string | RegExp, regex:RegExp, ignoreQuery?:boolean):void

        addNeverRule(domain:string | RegExp, regex:RegExp, ignoreQuery?:boolean):void

        getRules():CacheRules

        setDefault(strategy:string):void

        removeRule(domain:string | RegExp, rule:RegexRule):void

        removeAllMaxAgeRules():void

        removeAllNeverRules():void

        removeAllAlwaysRules():void
    }

    export class CacheRulesCreator {
        static createCache(instanceName: string, force: boolean, redisConfig: RedisStorageConfig, rules: CacheRules, cb: Function);
    }

    export class Instance {
        constructor(instanceName:string, redisConfig:RedisStorageConfig, config:InstanceConfig, cb:CallBackNoParam)

        publish():void

        getManager():CacheRuleManager
    }
}