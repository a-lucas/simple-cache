import {CacheRules} from "./interfaces";
import Helpers from "./helpers";
import {RedisPool} from "./redis/pool";
import CacheRuleManager from './CacheRuleManager';
import CacheEngine from "./CacheEngine";

const debug = require('debug')('simple-url-cache-RULE');

export default class CacheRuleEngine {

   public manager: CacheRuleManager;


    /**
     * 
     * 
     * 
     * @param instanceName
     * @param _conn
     * @param scan
     */
    constructor(private instanceName: string, private _conn: RedisPool, private scan: boolean = true, cb) {

        this._conn.getConnection().hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
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
        CacheEngine.publish();
        const stringified = JSON.stringify(this.manager.getRules(), Helpers.JSONRegExpReplacer, 2);
        this._conn.getConnection().hset(Helpers.getConfigKey(), this.instanceName, stringified, (err) => {
            if(err) Helpers.RedisError('while publishing config ' + stringified, err);
            this._conn.getConnection().publish(this.getChannel(), 'PUSHED');
        });
    }

    onPublish() {
        this._conn.getConnection().hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
            if (err) throw new Error('Redis error - retrieving ' + Helpers.getConfigKey());
            if (data === null) {
                throw new Error('Big mess');
            }
            const parsedData = JSON.parse(data, Helpers.JSONRegExpReviver)
            this.manager.updateRules(parsedData);
        });
    }

    getRules(): CacheRules {
        return this.manager.getRules();
    }
    
}
