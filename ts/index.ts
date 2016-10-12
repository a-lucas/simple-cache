import CacheEnginePromise from './cacheEngine/cacheEnginePromise';
import CacheEngineCB from './cacheEngine/cacheEngineCB';
import Instance from './instance';
import CacheRulesCreator from './rules/CacheRulesCreator';

module.exports.RedisUrlCache = {
    CacheEnginePromise: CacheEnginePromise,
    CacheEngineCB : CacheEngineCB,
    Instance : Instance,
    CacheRulesCreator : CacheRulesCreator
};