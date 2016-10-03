import {StorageInstancePromise, CacheRules} from "./../interfaces";
import * as debg from 'debug';
import {Promise} from 'es6-promise';
import RedisStorageInstanceCB from "./instanceCB";
import Instance from "../instance";
const debug = debg('simple-url-cache-REDIS');

export default class RedisStorageInstancePromise extends StorageInstancePromise {

    private hashKey;
    private cbInstance;

    constructor(private instance: Instance) {
        super();
        this.hashKey = 'simple-url-cache:' + instance.getInstanceName();
        this.cbInstance = new RedisStorageInstanceCB(instance);
        this.method = 'promise';
    }

    getCacheRules(): CacheRules {
        return this.instance.getCacheRuleEngine().getManager().getRules();
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
            //debug('getAllCachedDomains called');
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
        //debug('removing url cache: ', domain, url);
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
        this.cbInstance.destroy();
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
        //debug('Retrieving url cache: ', domain, url);
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
