import {StorageInstance, CacheRules, RedisStorageConfig} from "./../interfaces";
import {RedisPool} from './pool'
import * as debg from 'debug';
const debug = debg('simple-url-cache-REDIS');
import {Promise} from 'es6-promise';
import RedisStorageInstanceCB from "./instanceCB";

export default class RedisStorageInstance extends StorageInstance {

    private _conn:RedisPool;
    private hashKey;
    private cbInstance;
    public type = 'promise';

    constructor(instanceName, private config:RedisStorageConfig, private rules:CacheRules) {
        super(instanceName, config);
        this.hashKey = 'simple-url-cache:' + this.instanceName;
        this.cbInstance = new RedisStorageInstanceCB(instanceName, config, rules);
    }

    clearCache():Promise<boolean> {
        return new Promise((resolve, reject) => {
            
            this.cbInstance.clearCache( (err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);    
                }
            });
        });
    }

    clearDomain(domain: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            
            this.cbInstance.clearDomain(domain, (err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    getCachedDomains(): Promise<string[]> {
        return new Promise((resolve, reject)=> {
            debug('getAllCachedDomains called');
            this.cbInstance.getCachedDomains((err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    getCacheRules():CacheRules {
        return this.rules;
    }

    getCachedURLs(domain: string): Promise<string[]> {
        return new Promise((resolve, reject)=> {
            this.cbInstance.getCachedURLs(domain, (err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     *
     * DEL domain:instance:key
     * HMDEL domain:instance key
     *
     */
    delete(domain: string, url: string, category, ttl):Promise<boolean> {
        debug('removing url cache: ', domain, url);
        return new Promise((resolve, reject) => {
            this.cbInstance.delete(domain, url, category, ttl, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    destroy() {
        this._conn.kill();
    }

    /**
     * This is how internally stuff are trieved in REDIS
     *
     * HMGET domain:instance key
     * -> if not set, not cached
     * -> if set
     *      GET domain:instance:key
     *      -> if set, cached
     *      -> if not set, not cached
     *          HMDEL domain:instance key
     */
    get(domain: string, url:string, category, ttl):Promise<string> {
        debug('Retrieving url cache: ', domain, url);
        return new Promise((resolve, reject) => {
            this.cbInstance.get(domain, url, category, ttl, (err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     * GET domain:instance:key
     *  -> if not set
 *      HDEL domain:instance key
     */
    has(domain, url, category, ttl):Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.cbInstance.has(domain, url, category, ttl, (err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     * HMSET simple-url-cache:instance domain "domain:instance"
     * HMSET domain:instance key value
     * -> if 0, then resolve(true)
     *      HGET domain:instance:key
     *      -> if set, don't update the ttl neither the creation time
     *      -> if not set
     *          HSET domain:instance:key timestamp
     *          if (ttl)
     *          HEXPIRE domain:instance:key ttl
     *
     */
    set(domain, url, value, category, ttl, force):Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.cbInstance.set(domain, url, value, category, ttl, force, (err, results) => {
                if (err) {
                    debug(err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

}
