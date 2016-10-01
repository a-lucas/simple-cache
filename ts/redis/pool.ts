import * as  redis from 'redis';
import {RedisStorageConfig} from './../interfaces';
import * as dbug from 'debug';

const debug = dbug('simple-url-cache-REDIS');

export class RedisPool {

    static _pool = {};

    static _isOnline = {}

    private instanceName: string;

    static connect(instanceName: string, config: RedisStorageConfig, cb:Function): redis.RedisClient {
        if (typeof RedisPool._pool[instanceName] === 'undefined' || RedisPool._pool[instanceName] === null || !RedisPool._isOnline[instanceName]) {
            debug('This redis connection has never been instanciated before', instanceName);
            RedisPool._isOnline[instanceName] = false;

            RedisPool._pool[instanceName] = redis.createClient(config);

            RedisPool._pool[instanceName].on('connect', () => {
                RedisPool._isOnline[instanceName] = true;
                debug('redis connected');
                cb(null);
            });

            RedisPool._pool[instanceName].on('error', (e) => {
                debug(e);
                RedisPool._isOnline[instanceName] = false;
                RedisPool._pool[instanceName] = null;
                cb(e);
            });

            RedisPool._pool[instanceName].on('end', () => {
                RedisPool._pool[instanceName] = null;
                RedisPool._isOnline[instanceName] = false;
                console.warn('Redis Connection closed for instance ' + instanceName);
                debug('Connection closed', instanceName);
            });

            RedisPool._pool[instanceName].on('warning', (msg) => {
                console.warn('Redis warning for instance '+instanceName+ '. MSG = ', msg);
                debug('Warning called: ', instanceName, msg);
            });
        }
        return RedisPool._pool[instanceName];
    }

    static isOnline(instanceName): boolean {
        return RedisPool._isOnline[instanceName];
    }

    static kill(instanceName){
        if (RedisPool._isOnline[instanceName] === true) {
            RedisPool._pool[instanceName].end();
        }
    }

    constructor(instanceName: string, config: RedisStorageConfig, cb?:Function) {
        this.instanceName = instanceName;
        RedisPool.connect(instanceName, config, (err) => {
            if(err) cb(err);
        });
    }

    getConnection(): redis.RedisClient {
        return RedisPool._pool[this.instanceName];
    }

    isOnline():boolean {
        return RedisPool._isOnline[this.instanceName];
    }

    kill() {
        if (RedisPool._isOnline[this.instanceName] === true) {
            RedisPool._pool[this.instanceName].end();
        }
    }
}
