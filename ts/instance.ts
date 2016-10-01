import {CacheRules, RedisStorageConfig} from "./interfaces";
import CacheRuleEngine from "./CacheRuleEngine";
import Helpers from "./helpers";
import {RedisPool} from "./redis/pool";


export default class Instance {
    private ruleEngine:CacheRuleEngine;

    constructor(private instanceName: string, rules: CacheRules, private redisConfig: RedisStorageConfig){
        Helpers.validateCacheConfig(rules);
        this.ruleEngine = new CacheRuleEngine(rules);
        new RedisPool(redisConfig);
    }

    getInstanceName():string {
        return this.instanceName;
    }

    getCacheRuleEngine(): CacheRuleEngine {
        return this.ruleEngine;
    }

    getRedisConfig(): RedisStorageConfig {
        return this.redisConfig;
    }
}
