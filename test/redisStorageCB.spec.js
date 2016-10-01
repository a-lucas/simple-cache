var CacheEngine = require('./../dist/redis-cache').CacheEngineCB;
var Instance = require('./../dist/redis-cache').Instance;

var cacheRules = require('./helper/cacheRules');
var oneInstance = require('./helper/oneInstanceCB');
var manyInstances = require('./helper/manyInstancesCB');

var storageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};


describe('REDIS storage with CALLBACKS', function() {

    var redis1,
        redis2,
        redis3,
        redis4,
        domain1='http://localhost:3000',
        domain2='http://localhost:3001',
        domain3='http://localhost:3002',
        domain4='http://localhost:3003';


    describe('One Instance ', function () {

        this.timeout(2000);
        var instance1 = new Instance('INSTANCE', cacheRules, storageConfig);
        redis1 = new CacheEngine(domain1, instance1);

        oneInstance(redis1, domain1);

    });

    describe('Two common instance, one separate instance', function() {
        var instance2 = new Instance('INSTANCE1', cacheRules, storageConfig);
        var instance3 = new Instance('INSTANCE1', cacheRules, storageConfig);
        var instance4 = new Instance('INSTANCE3', cacheRules, storageConfig);

        redis2 = new CacheEngine(domain2, instance2);
        redis3 = new CacheEngine(domain3, instance3);
        redis4 = new CacheEngine(domain4, instance4);

        manyInstances(redis2, redis3, redis4, domain2, domain3, domain4);
    });
});
