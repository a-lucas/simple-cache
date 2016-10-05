import * as  redis from 'redis';
import {RedisStorageConfig} from './../interfaces';
import * as dbug from 'debug';

const debug = dbug('simple-url-cache-REDIS');

export class RedisPool {

    static _pool = {};

    static _sub = {};

    static _status = {};

    private instanceName: string;

    static connect(instanceName: string, config: RedisStorageConfig, cb:Function): void {
        if (
            typeof RedisPool._pool[instanceName] === 'undefined' ||
            RedisPool._pool[instanceName] === null ||
            typeof RedisPool._sub[instanceName] === 'undefined' ||
            RedisPool._sub[instanceName] === null
        ) {
            debug('This redis connection has never been instanciated before', instanceName);
            RedisPool._status[instanceName] = {
                online: false,
                lastError: null,
                warnings: []
            };

            RedisPool._pool[instanceName] = redis.createClient(config);
            RedisPool._sub[instanceName] = redis.createClient(config);

            var nb=0;
            var nbErrors = 0;

            RedisPool._pool[instanceName].on('connect', () => {
                RedisPool._status[instanceName].online = true;
                debug('redis connected');
                nb++;
                if(nb === 2) {
                    debug('POOL CONNECTED 2 conns');
                    cb(null);
                }
            });

            RedisPool._sub[instanceName].on('connect', () => {
                RedisPool._status[instanceName].online = true;
                debug('redis connected');
                nb++;
                if(nb === 2) {
                    debug('POOL CONNECTED 2 conns');
                    cb(null);
                }
            });


            RedisPool._pool[instanceName].on('error', (e) => {
                debug(e);
                RedisPool._status[instanceName].lastError = e;
                //RedisPool._pool[instanceName] = null;
                nbErrors++;
                if(nbErrors === 1) {
                    cb(e);
                }

            });

            RedisPool._pool[instanceName].on('end', () => {
                RedisPool._pool[instanceName] = null;
                RedisPool._status[instanceName].online = false;
                console.warn('Redis Connection closed for instance ' + instanceName);
                debug('Connection closed', instanceName);
            });

            RedisPool._pool[instanceName].on('warning', (msg) => {
                console.warn('Redis warning for instance '+instanceName+ '. MSG = ', msg);
                RedisPool._status[instanceName].warnings.push(msg);
                debug('Warning called: ', instanceName, msg);
            });


            RedisPool._sub[instanceName].on('error', (e) => {
                debug(e);
                RedisPool._status[instanceName].lastError = e;
                //RedisPool._pool[instanceName] = null;
                nbErrors++;
                if(nbErrors === 1) {
                    cb(e);
                }
            });

            RedisPool._sub[instanceName].on('end', () => {
                RedisPool._sub[instanceName] = null;
                RedisPool._status[instanceName].online = false;
                console.warn('Redis Connection closed for instance ' + instanceName);
                debug('Connection closed', instanceName);
            });

            RedisPool._sub[instanceName].on('warning', (msg) => {
                console.warn('Redis warning for instance '+instanceName+ '. MSG = ', msg);
                RedisPool._status[instanceName].warnings.push(msg);
                debug('Warning called: ', instanceName, msg);
            });
        } else {
            cb();
        }
    }

    static kill(instanceName){
        if (RedisPool._status[instanceName].online === true) {
            RedisPool._pool[instanceName].end();
            RedisPool._sub[instanceName].end();
        }
    }

    static getConnection(instanceName: string): redis.RedisClient {
        if ( RedisPool._status[instanceName].online ) {
            return RedisPool._pool[instanceName];
        }
        debug('Redis Pool isn\'t online yet')
    }

    static getSubscriberConnection(instanceName: string): redis.RedisClient  {
        if ( RedisPool._status[instanceName].online ) {
            return RedisPool._sub[instanceName];
        }
        debug('Redis Pool isn\'t online yet')
    }
}
