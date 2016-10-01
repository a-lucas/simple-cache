var simpleCache = require('./../dist/redis-cache').CacheEngineCB;
var cacheRules = require('./helper/cacheRules');
var instance = require('./helper/instanceCB');
var instances = require('./helper/instancesCB');

var storageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};


describe('REDIS storage testing', function() {

    var redis1,
        redis2,
        redis3,
        redis4;


    describe('One Instance ', function () {

        this.timeout(2000);

        redis1 = new simpleCache('COMMON_DOMAIN', 'INSTANCE',  storageConfig, cacheRules);
        instance(redis1);

    });

    describe('Two common instance, one separate instance', function() {
        redis2 = new simpleCache('DOMAIN1', 'INSTANCE1',  storageConfig, cacheRules);
        redis3 = new simpleCache('DOMAIN2', 'INSTANCE1',  storageConfig, cacheRules);
        redis4 = new simpleCache('DOMAIN3', 'INSTANCE2',  storageConfig, cacheRules);
        instances(redis2, redis3, redis4);
    });
});
