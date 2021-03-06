import { CallBackBooleanParam, CallBackStringArrayParam} from '../interfaces';
import RedisStorageInstanceCB from "../redis/instanceCB";

import Helpers from '../helpers';
import {UrlCB} from './cache';
import CacheEngine from "./CacheEngine";
import Instance from "../instance";

import * as dbug from 'debug';
const debug = dbug('redis-url-cache');

class CacheEngineCB extends CacheEngine{

    private storageInstance: RedisStorageInstanceCB;

    constructor(defaultDomain:string, instance: Instance) {
        super(defaultDomain, instance);
        this.storageInstance = new RedisStorageInstanceCB(instance);
    }

    clearDomain(domain:string, cb: CallBackBooleanParam):void {
        Helpers.isStringDefined(domain);
        this.storageInstance.clearDomain(domain, cb);
    }

    clearInstance(cb: CallBackBooleanParam) {
        this.storageInstance.clearCache(cb);
    }

    getStoredHostnames(cb: CallBackStringArrayParam) {
        this.storageInstance.getCachedDomains(cb);
    }

    getStoredURLs(domain:string, cb: CallBackStringArrayParam): void {
        Helpers.isStringDefined(domain);
        this.storageInstance.getCachedURLs(domain, cb)
    }

    /**
     *
     * @param url Takes the URL, and split it in two, left side is http:   // user:pass @ host.com : 8080, right side is the relative path. Prepend forward slash is missing to the relatve path
     * The left side is used to create a subdirectory for File storage, or a collection for Redis. The Redis collection naming convention is [db_]domain if any db parameter is provided. If no db is provided, then the default domain is used to store url without hostnames.
     * @returns {CacheStorage}
     */
    url(url:string):UrlCB {

        const parsedURL = Helpers.parseURL(url);

        if (parsedURL.domain.length === 0) {
            //debug('This url', url, ' has no domain, using defaultDomain = ', this.defaultDomain);
            parsedURL.domain = this.defaultDomain;
        }

        let cache  = new UrlCB(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
        this.addUrl(cache);
        return cache;
    }

}

export default CacheEngineCB;