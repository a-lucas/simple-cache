import {RedisStorageConfig, CacheRules} from "../interfaces";
import {RedisPool} from "../redis/pool";
import Helpers from "../helpers";
import * as  redis from 'redis';
const debug = require('debug')('simple-url-cache');

class CacheRulesCreator {

    private _conn: redis.RedisClient;

    constructor(private instanceName: string, private redisConfig: RedisStorageConfig, cb: Function){

        Helpers.isNotUndefined(instanceName, redisConfig, cb);

        debug('connecting to redis');
        RedisPool.connect(instanceName, redisConfig, (err) => {
            if(err) return cb('Error connecting to REDIS');
            this._conn = RedisPool.getConnection(instanceName);
            cb(null, this);
        });
    }

    importRules(rules: CacheRules, overwrite: boolean, cb: Function): void {
        Helpers.isNotUndefined(rules, cb);
        Helpers.validateCacheConfig(rules);

        this._conn.hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
            if (err) return cb('Redis error - retrieving ' + Helpers.getConfigKey() + ': ' + err);
            if (data !== null && !overwrite) {
                return cb('A CacheRule definition already exists for this instance');
            }
            const stringified = JSON.stringify(rules, Helpers.JSONRegExpReplacer, 2);
            this._conn.hset(Helpers.getConfigKey(), this.instanceName, stringified, (err) => {
                if(err) cb(err);
                cb(null);
            });
        });
    }
}


export default class CacheCreator {
    static createCache(instanceName: string, force: boolean, redisConfig: RedisStorageConfig, rules: CacheRules, cb: Function) {
        Helpers.isNotUndefined(instanceName, force, redisConfig, rules, cb);
        new CacheRulesCreator(instanceName, redisConfig, (err, creator) => {
            if(err) {
                return cb(err);
            }
            creator.importRules(rules, force, err => {
                if(err) {
                    return cb(err);
                }
                cb(null);
            });
        });
    }
}