import {RedisStorageConfig, CacheRules} from "../interfaces";
import {RedisPool} from "../redis/pool";
import Helpers from "../helpers";
import * as  redis from 'redis';


export default class CacheRulesCreator {

    private _conn: redis.RedisClient;

    private instanciated;

    constructor(private instanceName: string, private redisConfig: RedisStorageConfig, cb: Function){

        Helpers.isNotUndefined(instanceName, redisConfig, cb);

        RedisPool.connect(instanceName, redisConfig, (err) => {
            if(err) cb('Error connecting to REDIS');
            this._conn = RedisPool.getConnection(instanceName);
            cb(null);
        });
    }

    importRules(rules: CacheRules, cb: Function): void {
        Helpers.isNotUndefined(rules, cb);
        Helpers.validateCacheConfig(rules);

        this._conn.hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
            if (err) cb('Redis error - retrieving ' + Helpers.getConfigKey() + ': ' + err);
            if (data !== null) {
                cb('A CacheRule definition already exists for this instance');
            } else {
                const stringified = JSON.stringify(rules, Helpers.JSONRegExpReplacer, 2);
                this._conn.hset(Helpers.getConfigKey(), this.instanceName, stringified, (err) => {
                    if(err) cb(err);
                    cb(null);
                });
            }
        });
    }
}
