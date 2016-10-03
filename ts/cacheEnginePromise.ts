import {Promise} from 'es6-promise';
import {RedisStorageConfig} from './interfaces';
import Helpers from './helpers';
import * as dbug from 'debug';
import {CachePromise} from './cache';
import CacheEngine from "./CacheEngine";
import RedisStorageInstancePromise from "./redis/instancePromise";
import Instance from "./instance";

const debug = dbug('simple-url-cache');

class CacheEnginePromise extends CacheEngine{

    private storageInstance: RedisStorageInstancePromise;

    constructor(defaultDomain:string, instance: Instance) {
        super(defaultDomain, instance);
        this.storageInstance = new RedisStorageInstancePromise(instance);
    }

    //Instance helpers
    clearDomain(domain:string):Promise<boolean> {
        if (typeof domain === 'undefined') {
            domain = this.defaultDomain;
        }
        Helpers.isStringDefined(domain);
        return new Promise((resolve, reject) => {
            this.storageInstance.clearDomain(domain).then(() => {
                resolve(true);
            }, err => {
                reject(err);
            });
        });
    }

    clearInstance():Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.storageInstance.clearCache().then( () => {
                //delete CacheEngine.pool[storageType][instanceName];
                resolve(true);
            }, err => {
                reject(err);
            });
        });
    }

    getStoredHostnames():Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.storageInstance.getCachedDomains().then(domains => {
                resolve(domains);
            }, err => {
                reject(err);
            });
        });
    }

    getStoredURLs(domain?:string):Promise<string[]> {
        if (typeof domain === 'undefined') {
            domain = this.defaultDomain;
        }
        Helpers.isStringDefined(domain);

        return new Promise((resolve, reject) => {
            this.storageInstance.getCachedURLs(domain).then(urls => {
                resolve(urls)
            }, err => {
                reject(err)
            });
        });
    }

    /**
     *
     * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
     * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
     * @returns {Cache}
     */
    url(url:string):CachePromise {

        const parsedURL = Helpers.parseURL(url);

        if (parsedURL.domain.length === 0) {
            //debug('This url', url, ' has no domain, using defaultDomain = ', this.defaultDomain);
            parsedURL.domain = this.defaultDomain;
        }
        
        const cache = new CachePromise(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
        this.addUrl(cache);
        return cache;
    }
}

export default CacheEnginePromise;