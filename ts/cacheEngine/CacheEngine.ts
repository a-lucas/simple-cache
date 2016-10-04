import Helpers from "../helpers";
import Instance from "../instance";
import {UrlCommon} from "./cache";
const debug = require('debug')('simple-url-cache');

export default class CacheEngine {

    static urls = {};

    static helpers = {
        validateRedisStorageConfig: Helpers.validateRedisStorageConfig,
        validateCacheConfig: Helpers.validateCacheConfig
    };

    static hashKey: string = 'url-cache:';

    protected instanceName: string;
    
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

    protected addUrl(url: UrlCommon) {
        if ( typeof CacheEngine.urls[this.instanceName] !== 'undefined' && typeof CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] === 'undefined')  {
            CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] = url;
        }
    }

    private buildURLIndex(url: UrlCommon) {
        return this.instanceName + '_' + url.getDomain() + '_'  + url.getUrl();
    }
}
