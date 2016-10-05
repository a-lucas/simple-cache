import {RedisStorageConfig, InstanceConfig} from "./interfaces";
import Helpers from "./helpers";
import {RedisPool} from "./redis/pool";
import CacheEngine from './cacheEngine/CacheEngine';
import CacheRuleManager from './rules/CacheRuleManager';

const debug = require('debug')('simple-url-cache');

export default class Instance {

    private instanciated: boolean = false;
    private manager: CacheRuleManager;

    constructor(private instanceName: string,
                private redisConfig: RedisStorageConfig,
                private config: InstanceConfig = {on_existing_regex: 'replace', on_publish_update: false  },
                cb: Function){

        Helpers.isNotUndefined(instanceName, redisConfig, config, cb);

        this.config = (<any>Object).assign({on_existing_regex: 'replace', on_publish_update: false  }, config);

         RedisPool.connect(instanceName, redisConfig, (err) => {
            if(err) cb('Error connecting to REDIS: ' + err);

            const redisConn = RedisPool.getConnection(instanceName);
            //from cache rule engine
            redisConn.hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
                if (err) cb('Redis error - retrieving ' + Helpers.getConfigKey() + ' -> ' + err);
                if (data === null) {
                    cb('No CacheRule defined for this instance ' + this.instanceName);
                } else {
                    this.instanciated = true;
                    const parsedData = JSON.parse(data, Helpers.JSONRegExpReviver);
                    this.manager = new CacheRuleManager(parsedData, config.on_existing_regex);
                    this.launchSubscriber();
                    cb(null);
                }
            });
        });
    }

    private launchSubscriber(): void {
        const subscriber = RedisPool.getSubscriberConnection(this.instanceName);
        subscriber.subscribe(this.getChannel());
        subscriber.on('message', (channel, message) => {
            if(message === 'PUSHED') {
                this.onPublish();
            }
        });
    }

    private getChannel(): string {
        return Helpers.getConfigKey() + this.instanceName;
    }

    publish() {

        CacheEngine.updateAllUrlCategory(this.instanceName);

        const redisConn = RedisPool.getConnection(this.instanceName);

        const stringified = JSON.stringify(this.manager.getRules(), Helpers.JSONRegExpReplacer, 2);
        redisConn.hset(Helpers.getConfigKey(), this.instanceName, stringified, (err) => {
            if(err) Helpers.RedisError('while publishing config ' + stringified, err);
            redisConn.publish(this.getChannel(), 'PUSHED');
        });
    }

    onPublish() {
        const redisConn = RedisPool.getConnection(this.instanceName);

        redisConn.hget(Helpers.getConfigKey(), this.instanceName, (err, data) => {
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


    getConfig(): InstanceConfig {
        return this.config;
    }

    getInstanceName():string {
        return this.instanceName;
    }

    getRedisConfig(): RedisStorageConfig {
        return this.redisConfig;
    }

    isInstanciated(): boolean {
        return this.instanciated;
    }

}
