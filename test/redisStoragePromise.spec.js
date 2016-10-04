"use strict";

var CacheEngine = require('./../dist/redis-cache').CacheEnginePromise;

var Instance = require('./../dist/redis-cache').Instance;
var CacheRulesCreator = require('./../dist/redis-cache').CacheRulesCreator;

var cacheRules = require('./helper/cacheRules');
var oneInstance = require('./helper/oneInstance');
var manyInstances = require('./helper/manyInstances');

var chai = require('chai');
var expect = chai.expect;


var common = require('./helper/commonCB');

var storageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};


var instanceName1 = 'INSTANCE',
    instanceName2 = 'INSTANCE1',
    instanceName3 = 'INSTANCE2',
    instanceName4 = 'INSTANCE3',
    instance1,
    instance2,
    instance3,
    instance4;

var redis1,
    redis2,
    redis3,
    redis4,
    domain1 = 'http://localhost:3000',
    domain2 = 'http://localhost:3001',
    domain3 = 'http://localhost:3002',
    domain4 = 'http://localhost:3003';


var manyInstancesVars = {
    urls: [
        'http://a.com/always.html',
        'http://b.com/always.html',
        'always.html'
    ],
    html: '<b>Some content</b>',
    i1: {
        urls: [],
        domain: null,
        engine: null
    },
    i2: {
        urls: [],
        domain: null,
        engine: null
    },
    i3: {
        urls: [],
        domain: null,
        engine: null
    }
};

function initializeManyInstanceVars(index, cacheEngine, domain) {

    manyInstancesVars[index].engine = cacheEngine;
    manyInstancesVars[index].domain = domain;
    manyInstancesVars.urls.forEach(function (url) {
        manyInstancesVars[index].urls.push(cacheEngine.url(url));
    });

    if(manyInstancesVars.i1.engine!== null && manyInstancesVars.i2.engine!== null && manyInstancesVars.i3.engine!== null ) {
        console.log(manyInstancesVars);
        manyInstances('promise', manyInstancesVars);
    }
}


function initializeOneInstanceVars(cacheEngine, domain) {
    var data = {
        engine: cacheEngine,
        maxAge: {
            str: '/maxAge.html',
            obj: cacheEngine.url('/maxAge.html')
        },
        always: {
            str: '/always.html',
            obj: cacheEngine.url('/always.html')
        },
        never: {
            str: '/never.html',
            obj: cacheEngine.url('/never.html')
        },
        unmatched: {
            str: '/unmatched.html',
            obj: cacheEngine.url('/unmatched.html')
        },
        html: '<b>Some HTML</b>',
        clearInstance: [],
        multipleDomains: [
            cacheEngine.url('http://a.com/always.html'),
            cacheEngine.url('http://b.com/always.html'),
            cacheEngine.url('always.html')
        ],
        getStoredURLs: [
            cacheEngine.url('/0always.html'),
            cacheEngine.url('http://a.com/1always.html'),
            cacheEngine.url('http://a.com/maxAge.html')
        ],
        domain: domain
    };

    let i;
    for (i = 0; i < 3; i++) {
        data.clearInstance.push(cacheEngine.url('http://a' + i + '.com/always.html'));
    }

    return data;
}

describe('CONFIG: clearing configs', function () {
    common.RECREATE_CONFIG(instanceName1, storageConfig, cacheRules);
    common.RECREATE_CONFIG(instanceName2, storageConfig, cacheRules);
    common.RECREATE_CONFIG(instanceName3, storageConfig, cacheRules);
    common.RECREATE_CONFIG(instanceName4, storageConfig, cacheRules);
});


describe('INITIALIZING CacheEngines and Instances', function () {


    it('should initialize instance1 & redis1 OK', function (done) {
        instance1 = new Instance(instanceName1, storageConfig, {
            on_existing_regex: 'replace',
            on_publish_update: true
        }, function (err) {
            if (err) return done(err);
            redis1 = new CacheEngine(domain1, instance1);
            var data = initializeOneInstanceVars(redis1, domain1);
            oneInstance('promise', data);
            done();
        });
    });

    it('should initialize instance2 & redis2 OK', function (done) {
        instance2 = new Instance(instanceName2, storageConfig, {
            on_existing_regex: 'replace',
            on_publish_update: true
        }, function (err) {
            if (err) return done(err);
            redis2 = new CacheEngine(domain2, instance2);
            initializeManyInstanceVars('i1', redis2, domain2);
            done();
        });
    });

    it('should initialize instance3 & redis3 OK', function (done) {
        instance3 = new Instance(instanceName2, storageConfig, {
            on_existing_regex: 'replace',
            on_publish_update: true
        }, function (err) {
            if (err) return done(err);
            redis3 = new CacheEngine(domain3, instance3);
            initializeManyInstanceVars('i2', redis3, domain3);
            done();
        });
    });

    it('should initialize instance4 & redis4 OK', function (done) {
        instance4 = new Instance(instanceName4, storageConfig, {
            on_existing_regex: 'replace',
            on_publish_update: true
        }, function (err) {
            if (err) return done(err);
            redis4 = new CacheEngine(domain4, instance4);
            initializeManyInstanceVars('i3', redis4, domain4);
            done();
        });
    });

    it('should have instance1 and redis1 defined', function () {
        expect(instance1).to.be.defined;
        expect(redis1).to.be.defined;
    });

    it('should have instance2 and redis2 defined', function () {
        expect(instance2).to.be.defined;
        expect(redis2).to.be.defined;
    });

    it('should have instance3 and redis3 defined', function () {
        expect(instance3).to.be.defined;
        expect(redis3).to.be.defined;
    });

    it('should have instance4 and redis4 defined', function () {
        expect(instance4).to.be.defined;
        expect(redis4).to.be.defined;
    });

});


//oneInstance(redis1, domain1);


describe('REDIS storage with Promises', function () {

    this.timeout(2000);

    it('is launching', function (done) {
        var interval = setInterval(function () {
            if (typeof redis1 !== 'undefined' && typeof redis2 !== 'undefined' && typeof redis3 !== 'undefined' && typeof redis4 !== 'undefined') {
                clearInterval(interval);
                done();
            }
        }, 100);
    });

});
