// Type definitions for simple-url-cache
// Project: https://github.com/a-lucas/simple-url-cache
// Definitions by: Antoine LUCAS <https://github.com/a-lucas>

declare module "redis-url-cache" {
    import 'es6-promise';

    interface RegexRule {
        regex:RegExp
    }

    interface MaxAgeRegexRule extends RegexRule {
        maxAge:number
    }

    interface CacheRules {
        maxAge:MaxAgeRegexRule[],
        always:RegexRule[],
        never:RegexRule[],
        default:string
    }

    interface RedisStorageConfig {
        host:string;
        port:number;
        path?:string;
        url?:string;
        socket_keepalive?:boolean;
        password?:string;
        db?:string;
    }


    interface CallBackBooleanParam {
        (err: string, res: boolean): any
    }

    interface CallBackStringParam {
        (err: string, res: string): any
    }

    interface CallBackStringArrayParam {
        (err: string, res: string[]): any
    }

    export class CachePromise {
        getDomain(): string
        getCategory(): string
        getInstanceName(): string
        getStorageType(): string
        getUrl(): string
        getTTL(): number
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
        get():Promise<string>;

        set(html:string):Promise<boolean>;
        /**
         * Resolve to true if cached, false if lready cached, and rejects an Error if any
         * @param html
         * @param force
         */
        set(html:string, force:boolean):Promise<boolean>;
    }

    export class CacheCB {
        getDomain(): string
        getCategory(): string
        getInstanceName(): string
        getStorageType(): string
        getUrl(): string
        getTTL(): number

        has(cb: CallBackBooleanParam):void;

        /**
         * returns to true if deleted, false if not there, and an Error if any
         */
        delete(cb: CallBackBooleanParam):void

        /**
         * Resolves to the html, Rejects undefined if not cached
         */
        get(cb: CallBackStringParam): void;

        /**
         * Resolve to true if cached, false if lready cached, and rejects an Error if any
         * @param html
         * @param force
         */
        set(html:string, force:boolean, cb: CallBackBooleanParam):void
    }

    export class CacheEnginePromise {
        /**
         *
         * @param defaultDomain This is the default domain when the url doesn't contain any host information.
         * It can be of any form, usually http:   // user:pass @ host.com : 8080
         * @param storageConfig: Either a FileStorageConfig or a RedisStorageConfig
         * @param cacheRules
         */
        constructor(defaultDomain:string, instance:string, storageConfig:RedisStorageConfig, cacheRules:CacheRules);

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
        constructor(defaultDomain:string, instance:string, storageConfig:RedisStorageConfig, cacheRules:CacheRules);

        /**
         *
         * @param domain If no domain is provided, then the default domain will be cleared
         */
        clearDomain(cb: CallBackBooleanParam):void

        clearDomain(domain:string, cb: CallBackBooleanParam): void

        clearInstance(cb:CallBackBooleanParam): void

        getStoredHostnames(cb: CallBackStringArrayParam): void

        getStoredURLs(cb: CallBackStringArrayParam):void

        getStoredURLs(domain:string, cb: CallBackStringArrayParam): void

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


}

//}