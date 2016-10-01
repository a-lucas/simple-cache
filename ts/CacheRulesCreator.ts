import {RedisStorageConfig, CacheRules} from "./interfaces";
import {RedisPool} from "./redis/pool";
import Helpers from "./helpers";

export default class CacheRulesCreator {

    private _conn: RedisPool;

    constructor(private instanceName: string, private redisConfig: RedisStorageConfig){
        this._conn = new RedisPool(instanceName, redisConfig, (err) => {
            if(err) throw new Error('Error connecting to REDIS');
        });
    }

    importRules(rules: CacheRules, cb: Function): void {
        Helpers.validateCacheConfig(rules);

        this._conn.getConnection().hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
            if (err) throw new Error('Redis error - retrieving ' + Helpers.getConfigKey());
            if (data !== null) {
                cb('A CacheRule definition already exists for this instance');
            } else {
                const stringified = JSON.stringify(rules, Helpers.JSONRegExpReplacer, 2);
                this._conn.getConnection().hset(Helpers.getConfigKey(), this.instanceName, stringified, (err) => {
                    if(err) cb(err);
                });
                cb(null);
            }
        });
    }
}
