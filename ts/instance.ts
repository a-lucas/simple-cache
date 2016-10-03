import {RedisStorageConfig, InstanceConfig} from "./interfaces";
import CacheRuleEngine from "./CacheRuleEngine";
import Helpers from "./helpers";
import {RedisPool} from "./redis/pool";
const debug = require('debug')('simple-url-cache');

export default class Instance {
    public ruleEngine:CacheRuleEngine;
    private instanciated: boolean = false;

    constructor(private instanceName: string,
                private redisConfig: RedisStorageConfig,
                private config: InstanceConfig = {on_existing_regex: 'replace', on_publish_update: false  },
                cb: Function){

        Helpers.isNotUndefined(instanceName, redisConfig, config, cb);

        this.config = (<any>Object).assign({on_existing_regex: 'replace', on_publish_update: false  }, config);

        new RedisPool(instanceName, redisConfig, (err) => {
            if(err) cb('Error connecting to REDIS: ' + err);
            this.ruleEngine = new CacheRuleEngine(instanceName, this.config, (err) => {
                if(err) return cb(err);
                this.instanciated = true;
                cb();
            });
        });
    }

    getConfig(): InstanceConfig {
        return this.config;
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

    isInstanciated(): boolean {
        return this.instanciated;
    }

}
