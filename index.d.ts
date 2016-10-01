// Type definitions for simple-url-cache
// Project: https://github.com/a-lucas/simple-url-cache
// Definitions by: Antoine LUCAS <https://github.com/a-lucas>

//declare module "simple-url-cache" {


export interface RegexRule {
    regex:RegExp
}

export interface MaxAgeRegexRule extends RegexRule {
    maxAge:number
}

export interface CacheRules {
    maxAge:MaxAgeRegexRule[],
    always:RegexRule[],
    never:RegexRule[],
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

declare class Cache {
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

    getDomain(): string;
    getCategory(): string;
    getInstanceName(): string;
    getStorageType(): string;
    getUrl(): string;
    /**
     * Resolve to true if cached, false if lready cached, and rejects an Error if any
     * @param html
     * @param force
     */
    set(html:string, force:boolean):Promise<boolean>;
}


declare class CacheEngine {
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
    clearDomain(domain?:string):Promise<boolean>;

    clearInstance(): Promise<boolean>

    getStoredHostnames(): Promise<string[]>

    getStoredURLs(): Promise<string[]>

    /**
     *
     * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
     * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
     * @returns {CacheStorage}
     */
    url(url:string):Cache;
}
//}