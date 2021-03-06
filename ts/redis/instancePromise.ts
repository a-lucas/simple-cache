import {CacheRules, IGetResults} from "./../interfaces";
import * as debg from 'debug';
import {Promise} from 'es6-promise';
import RedisStorageInstanceCB from "./instanceCB";
import Instance from "../instance";
import {StoragePromise} from "../abstract/storage";
const debug = debg('redis-url-cache-REDIS');

export default class RedisStoragePromise extends StoragePromise {

    private hashKey;
    private cbInstance;

    constructor(private instance: Instance) {
        super();
        this.hashKey = 'redis-url-cache:' + instance.getInstanceName();
        this.cbInstance = new RedisStorageInstanceCB(instance);
        this.method = 'promise';
    }

    getCacheRules(): CacheRules {
        return this.instance.getManager().getRules();
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
    get(domain: string, url:string, category, ttl):Promise<IGetResults> {
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
     * HMSET debug-url-cache:instance domain "domain:instance"
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
    set(domain: string, url: string, value: Object, extra: Object, category: string, ttl: number, force: boolean):Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.cbInstance.set(domain, url, value, extra, category, ttl, force, (err, results) => {
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
