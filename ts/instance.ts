import {CacheRules, RedisStorageConfig} from "./interfaces";
import CacheRuleEngine from "./CacheRuleEngine";
import Helpers from "./helpers";
import {RedisPool} from "./redis/pool";


export default class Instance {
    public ruleEngine:CacheRuleEngine;
    private _conn: RedisPool;

    constructor(private instanceName: string, private redisConfig: RedisStorageConfig, cb: Function){
        this._conn = new RedisPool(instanceName, redisConfig, (err) => {
            if(err) throw new Error('Error connecting to REDIS');
        });
        this.ruleEngine = new CacheRuleEngine(instanceName, this._conn, false, (err) => {
            if(err) return cb(err);
            cb();
        });
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
