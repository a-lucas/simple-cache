import Helpers from "./helpers";
import Instance from "./instance";
import {CacheCommon} from "./cache";
const debug = require('debug')('simple-url-cache');

export default class CacheEngine {

    static urls = {};

    static helpers = {
        validateRedisStorageConfig: Helpers.validateRedisStorageConfig,
        validateCacheConfig: Helpers.validateCacheConfig
    };

    static hashKey: string = 'url-cache:';

    protected instanceName: string;

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
        if( instanceDefinition.isInstanciated() === false) {
            const errorMsg = 'This instance hasn\'t initiated correctly: ' + instanceDefinition.getInstanceName();
            console.error(errorMsg)
            throw new Error(errorMsg);
        }
        this.instanceName = instanceDefinition.getInstanceName();

        if( instanceDefinition.getConfig().on_publish_update === true && typeof CacheEngine.urls[this.instanceName] === 'undefined') {
            CacheEngine.urls[this.instanceName] = {};
        }

    }

    static updateAllUrlCategory(instanceName: string) {
        Helpers.isStringDefined(instanceName);
        if ( typeof CacheEngine.urls[instanceName] !== 'undefined' )  {
            let key;
            for(key in CacheEngine.urls[instanceName]) {
                CacheEngine.urls[instanceName][key].setCacheCategory();
            }
        }
    }

    getInstanceName() : string {
        return this.instanceName;
    }

    protected addUrl(url: CacheCommon) {
        if ( typeof CacheEngine.urls[this.instanceName] !== 'undefined' && typeof CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] === 'undefined')  {
            CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] = url;
        }
    }

    private buildURLIndex(url: CacheCommon) {
        return this.instanceName + '_' + url.getDomain() + '_'  + url.getUrl();
    }
}
