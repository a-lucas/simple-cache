"use strict";
var CacheEngine = require('./../dist/redis-cache').CacheEngineCB;
var Instance = require('./../dist/redis-cache').Instance;
var CacheRulesCreator = require('./../dist/redis-cache').CacheRulesCreator;
var chai = require('chai');
var expect = chai.expect;
var redis = require('redis');
var debug = require('debug')('simple-url-cache-test');

var ruleFly = require('./helper/ruleFly');

var cacheRules = require('./helper/cacheRules');

var storageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};

var cacheEngine,
    instance,
    domain = 'http://localhost:3000',
    cacheMaxAgeURL = '/maxAge.html',
    cacheAlwaysURL = '/always.html',
    cacheNeverURL = '/never.html',
    notMatchedURL = '/unmatched.html',
    html = '<b>Some HTML</b>',
    cacheRuleEngine,
    url;

var URL_DETAILS = require('./helper/commonCB').URL_DETAILS;

describe('a small test', function(){

    var fn = function() {
        this.A = [];

        this.getA = function() {return this.A}

    }

    it('should get by reference', function() {

        var test = new fn();
        var a = test.getA();
        a.push(1);
        var b = test.getA();
        expect(b).not.eql(a);
        test.A.push(2);
        expect(test.getA()).eql([2]);

    })

})

describe('So many level, cant mocha run it in order?', function () {

    var creator = new CacheRulesCreator('INSTANCE1', storageConfig);



    it('We delete redis Exiting Cache Configs', function (done) {
        const client = redis.createClient(storageConfig);

        client.hdel('url-cache:ruleconfig', 'INSTANCE1', function (err) {
            if (err) return done(err);
            done();
        });
    });

    it('should create the new cache rule ok', function (done) {

        creator.importRules(cacheRules, err => {
            if (err) return done(err);
            done();
        });
    });

    it('should complain about the fact that a Cache Config already exists', function () {

        creator.importRules(cacheRules, err => {
            if (err) return done();
            if (!err) done('Should be refused');
        });
    });

    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance('INSTANCE1', storageConfig, function (err) {
            if (err) return done(err);
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleEngine = instance.ruleEngine;
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance1 and redis1 defined', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
    });

});


describe('launching tests', function () {



    it('cacheRuleEngine should be set', function () {
        expect(url).to.be.defined;
    });

    it('it should get the correct instance name', function () {
        expect(instance.getInstanceName()).eql('INSTANCE1');
    });

    it('Should get the same CacheConfig as the default one', function () {

        expect(cacheRuleEngine.manager.cacheRules).eql(cacheRules);
    });

    it(' classification check & url name check ', function() {
        expect(url.getUrl()).eql(notMatchedURL);
        expect(url.getCategory()).eql('never');
    });

    it(' domain check ', function() {
        expect(url.getDomain()).eql(domain);
    });

    it('should set default value to always ok', function() {
        cacheRuleEngine.manager.setDefault('always');
        expect(cacheRuleEngine.getRules().default).eql('always');
    });

    it('url classification should still be never ', function() {
        expect(url.getCategory()).eql('never');
    });

    it('it runs publish() ', function() {
        cacheRuleEngine.publish();
        url.setCacheCategory();
    });

    it('url classification should be always ', function() {
        expect(url.getCategory()).eql('always');
    });

});



    /*
    describe('setting the default rule to always', function() {

        it('should set ok', function() {
            cacheRuleEngine.manager.setDefault('always');
            expect(cacheRuleEngine.getRules().default).eql('always');
        });

    });*/



