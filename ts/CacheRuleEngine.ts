import {CacheRules} from "./interfaces";
import Helpers from "./helpers";
import {RedisPool} from "./redis/pool";
import CacheRuleManager from './CacheRuleManager';
import CacheEngine from "./CacheEngine";
import * as redis from 'redis';

const debug = require('debug')('simple-url-cache-RULE');

export default class CacheRuleEngine {

   protected manager: CacheRuleManager;

    private _conn: redis.RedisClient;

    /**
     * 
     * 
     * 
     * @param instanceName
     * @param _conn
     */
    constructor(private instanceName: string,  cb) {

        this._conn = RedisPool.getConnection(instanceName);
        this._conn.hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
            if (err) throw new Error('Redis error - retrieving ' + Helpers.getConfigKey() + ' -> ' + err);
            if (data === null) {
                cb('No CacheRule defined for this instance ' + this.instanceName);
            } else {
                const parsedData = JSON.parse(data, Helpers.JSONRegExpReviver);
                this.manager = new CacheRuleManager(parsedData, false);
                cb(null);
            }
        });

        /*this._conn.getConnection().subscribe( this.getChannel());

        this._conn.getConnection().on("message", (channel, message) => {
            debug('message received for instance', channel, message);
            this.onPublish();
        });*/
    }

    private getChannel(): string {
        return Helpers.getConfigKey() + this.instanceName;
    }

    publish() {

        CacheEngine.updateAllUrlCategory(this.instanceName);

        const stringified = JSON.stringify(this.manager.getRules(), Helpers.JSONRegExpReplacer, 2);
        this._conn.hset(Helpers.getConfigKey(), this.instanceName, stringified, (err) => {
            if(err) Helpers.RedisError('while publishing config ' + stringified, err);
            this._conn.publish(this.getChannel(), 'PUSHED');
        });
    }

    onPublish() {
        this._conn.hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
            if (err) throw new Error('Redis error - retrieving ' + Helpers.getConfigKey());
            if (data === null) {
                throw new Error('Big mess');
            }
            const parsedData = JSON.parse(data, Helpers.JSONRegExpReviver)
            this.manager.updateRules(parsedData);
        });
    }

    getManager(): CacheRuleManager {
        return this.manager;
    }
    
}
