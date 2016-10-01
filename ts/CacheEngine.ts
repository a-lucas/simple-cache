import Helpers from "./helpers";
import {RedisStorageConfig} from "./interfaces";
import RedisStorageInstanceCB from "./redis/instanceCB";
import Instance from "./instance";
import RedisStorageInstancePromise from "./redis/instancePromise";

export default class CacheEngine {

    protected instance: RedisStorageInstancePromise | RedisStorageInstanceCB;

    static instances = {};

    static helpers = {
        validateRedisStorageConfig: Helpers.validateRedisStorageConfig,
        validateCacheConfig: Helpers.validateCacheConfig
    };

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
    constructor(protected defaultDomain:string, protected instanceDefinition: Instance) {
        Helpers.isNotUndefined(defaultDomain, instanceDefinition);
        Helpers.isStringDefined(defaultDomain);
        if(typeof CacheEngine.instances[instanceDefinition.getInstanceName()] !== 'undefined') {
            console.warn("Instance already exists: " + instanceDefinition.getInstanceName(), "RedisConfig And cacheRules are ignored");
            //throw new Error("Instance already exists: " + instanceDefinition.getInstanceName());
        } else {
            CacheEngine.instances[instanceDefinition.getInstanceName()] = instanceDefinition
        }
    }
}
