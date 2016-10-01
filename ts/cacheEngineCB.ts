import {CacheRules, StorageInstanceCB, RedisStorageConfig, StorageType, CallBackBooleanParam, CallBackStringParam, CallBackStringArrayParam} from './interfaces';
import RedisStorageInstanceCB from "./redis/instanceCB";
import Helpers from './helpers';
import * as nodeurl from 'url';
import * as dbug from 'debug';
import {CacheCB} from './cache';

const debug = dbug('simple-url-cache');

class CacheEngineCB {

    static pool:any = {};

    static locks:any = {};

    static helpers = {
        validateRedisStorageConfig: Helpers.validateRedisStorageConfig,
        validateCacheConfig: Helpers.validateCacheConfig
    };

    private type:StorageType;

    /**
     *
     * @param defaultDomain This is the default domain when the url doesn't contain any host information.
     * It can be of any form, usually http:   // user:pass @ host.com : 8080
     * @param instanceName: This allows you to fine tune caching instances when running many servers instances on the same machine
     *
     * example :
     *
     * c1 = new cacheEngine('http://a.com', 'I1', {type: 'file', dir: '/cache/simple-url-cache'}, cacheRules};
     * c2 = new cacheEngine('http://b.com', 'I1', {type: 'file', dir: '/cache/simple-url-cache'}, cacheRules};
     * c3 = new cacheEngine('http://c.com', 'I2', {type: 'file', dir: '/cache/simple-url-cache'}, cacheRules};
     *
     * c1 & c2 will share the same instance of cached URLs, c3 will be independant
     *
     * c1.url('//cdn.com/jquery.js').set();
     * -> resolve(true) never cached before
     *
     * c2.url('//cdn.com/jquery.js').set();
     * -> resolve(false) because it is already cached
     *
     * c3.url('//cdn.com/jquery.js').set();
     * -> resolve(true)
     *
     * For FS storage the resulting folder structure will be
     * /cache/simple-url-cache/I1/cdn.com/jquery.js
     * /cache/simple-url-cache/I2/cdn.com/jquery.js
     *
     * @param storageConfig: Either a FileStorageConfig or a RedisStorageConfig
     * @param cacheRules
     */
    constructor(private defaultDomain:string, private instanceName:string, private storageConfig:RedisStorageConfig, private cacheRules:CacheRules) {

        Helpers.isStringDefined(defaultDomain);
        Helpers.isStringDefined(instanceName);
        Helpers.validateCacheConfig(cacheRules);

        if (Helpers.isRedis(storageConfig)) {
            this.type = 'file';
        } else {
            throw new Error('Only Redis is supported');
        }

        if (typeof CacheEngineCB.pool[this.type] === 'undefined') {
            CacheEngineCB.pool[this.type] = {};
            CacheEngineCB.locks[this.type] = {};
        }
        if (typeof CacheEngineCB.pool[this.type][instanceName] === 'undefined') {
            CacheEngineCB.pool[this.type][instanceName] = {};
            CacheEngineCB.locks[this.type][instanceName] = false;
        }

    }

    clearDomain(domain:string, cb: CallBackBooleanParam):void {
        Helpers.isStringDefined(domain);
        const instance = this.getInstance();
        instance.clearDomain(domain, cb);
    }

    clearInstance(cb: CallBackBooleanParam) {
        const instance = this.getInstance();
        instance.clearCache(cb);
    }

    getStoredHostnames(cb: CallBackStringArrayParam) {
        const instance = this.getInstance();
        instance.getCachedDomains(cb);
    }

    getStoredURLs(domain:string, cb: CallBackStringArrayParam): void {
        Helpers.isStringDefined(domain);
        const instance = this.getInstance();
        instance.getCachedURLs(domain, cb)
    }

    /**
     *
     * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
     * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
     * @returns {CacheStorage}
     */
    url(url:string):CacheCB {

        Helpers.isStringDefined(url);

        let instance:StorageInstanceCB;

        const parsedURL = nodeurl.parse(url);
        let relativeURL = parsedURL.path;
        if (!/\//.test(relativeURL)) {
            relativeURL = '/' + relativeURL;
        }

        parsedURL.pathname = null;
        parsedURL.path = null;
        parsedURL.hash = null;
        parsedURL.query = null;
        parsedURL.search = null;

        let domain = nodeurl.format(parsedURL);

        if (domain === relativeURL) {
            throw new Error('The url ' + url + ' is not valid');
        }

        if (domain.length === 0) {
            debug('This url', url, ' has no domain, using defaultDomain = ', this.defaultDomain);
            domain = this.defaultDomain;
        } else {
            debug('This URL ', url, ' has a domain: ', domain);
        }
        instance = this.getInstance();

        return new CacheCB(domain, instance, relativeURL);
    }

    private getInstance(): RedisStorageInstanceCB{

        if (typeof CacheEngineCB.pool[this.type][this.instanceName] === 'undefined') {
            CacheEngineCB.pool[this.type][this.instanceName] = {};
            CacheEngineCB.locks[this.type][this.instanceName] = {};
        }

        if (Helpers.isRedis(this.storageConfig)) {
            CacheEngineCB.pool[this.type][this.instanceName] = new RedisStorageInstanceCB(this.instanceName, this.storageConfig, this.cacheRules);
        }

        return CacheEngineCB.pool[this.type][this.instanceName];
    }

}

export default CacheEngineCB;