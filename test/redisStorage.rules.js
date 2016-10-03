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
    cacheEngine2,
    instance,
    instance2,
    domain = 'http://localhost:3000',
    cacheMaxAgeURL = '/maxAge.html',
    cacheAlwaysURL = '/always.html',
    cacheNeverURL = '/never.html',
    notMatchedURL = '/unmatched.html',
    html = '<b>Some HTML</b>',
    cacheRuleEngine,
    cacheRuleEngine2,
    url,
    url2;

var URL_DETAILS = require('./helper/commonCB').URL_DETAILS;



describe('Creating a new Config for INSTANCE1', function () {

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
        instance = new Instance('INSTANCE1', storageConfig, {}, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleEngine = instance.getCacheRuleEngine();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleEngine).to.be.defined;
        expect(url).to.be.defined;
    });

});

describe('Few checks', function() {
    it('it should get the correct instance name', function () {
        expect(instance.getInstanceName()).eql('INSTANCE1');
    });

    it('Should get the same CacheConfig as the default one', function () {
        expect(cacheRuleEngine.getManager().getRules()).eql(cacheRules);
    });

    it(' classification check & url name check ', function() {
        expect(url.getUrl()).eql(notMatchedURL);
        expect(url.getCategory()).eql('never');
    });

    it(' domain check ', function() {
        expect(url.getDomain()).eql(domain);
    });
});

describe('With InstanceConfig.on_publish_update = false', function () {

    it('should set default value to always ok', function() {
        cacheRuleEngine.getManager().setDefault('always');
        expect(cacheRuleEngine.getManager().getRules().default).eql('always');
    });

    it('url classification should still be never ', function() {
        expect(url.getCategory()).eql('never');
    });

    it('it runs publish() ', function() {
        cacheRuleEngine.publish();
    });

    it('url classification should still be never ', function() {
        expect(url.getCategory()).eql('never');
    });

    it('it runs url.setCategory() ', function() {
        url.setCacheCategory();
    });

    it('url classification should be always ', function() {
        expect(url.getCategory()).eql('always');
    });

});

describe('With InstanceConfig.on_publish_update = true', function () {

    it('should initialize the cacheEngine OK', function (done) {
        instance2 = new Instance('INSTANCE1', storageConfig, { on_publish_update: true}, function (err) {
            if (err) return done(err);
            cacheEngine2 = new CacheEngine(domain, instance2);
            cacheRuleEngine = instance2.getCacheRuleEngine();
            url2 = cacheEngine2.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance2).to.be.defined;
        expect(cacheEngine2).to.be.defined;
        expect(cacheRuleEngine2).to.be.defined;
        expect(url2).to.be.defined;
    });

    it('it should get the correct instance name', function () {
        expect(instance.getInstanceName()).eql('INSTANCE1');
    });

    it('Should get a dfferent  CacheConfig as the default one', function () {
        expect(cacheRuleEngine.getManager().getRules()).not.eql(cacheRules);
    });

    it('URL should get the always classification from the previous test suite', function() {
        expect(url2.getUrl()).eql(notMatchedURL);
        expect(url2.getCategory()).eql('always');
    });

    it(' domain check ', function() {
        expect(url2.getDomain()).eql(domain);
    });

    it('should set default value to never ok', function() {
        cacheRuleEngine.getManager().setDefault('never');
        expect(cacheRuleEngine.getManager().getRules().default).eql('never');
    });

    it('url classification should still be always ', function() {
        expect(url2.getCategory()).eql('always');
    });

    it('it runs publish() ', function() {
        cacheRuleEngine.publish();
    });

    it('url classification should be never ', function() {
        expect(url2.getCategory()).eql('never');
    });

    it('it runs url.setCategory() ', function() {
        url2.setCacheCategory();
    });

    it('url classification should be never ', function() {
        expect(url2.getCategory()).eql('never');
    });
});

describe('Testing adding/removing rules with default settings on_existing_regex = replace', function() {

    it('Adds a new Always rule /aaa/ without error', function() {
        cacheRuleEngine.getManager().addAlwaysRule(/aaa/);
    });

    it('Gets all cacheRules.always should contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.always).to.contain({regex: /aaa/});
    });

    it('Adds a new never rule /aaa/ without error', function() {
        cacheRuleEngine.getManager().addNeverRule( /aaa/);
    });

    it('Gets all cacheRules.always should not contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.always).to.not.contain({regex: /aaa/});
    });

    it('Gets all cacheRules.never should contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.never).to.contain({regex: /aaa/});
    });
});


describe('Testing adding/removing rules with settings on_existing_regex = ignore', function() {

    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance('INSTANCE1', storageConfig, { on_existing_regex: 'ignore' }, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleEngine = instance.getCacheRuleEngine();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleEngine).to.be.defined;
        expect(url).to.be.defined;
    });

    it('Adds a new Always rule /aaa/ without error', function() {
        cacheRuleEngine.getManager().addAlwaysRule(/aaa/);
    });

    it('Gets all cacheRules.always should contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.always).to.contain({regex: /aaa/});
    });

    it('Adds a new never rule /aaa/ without error', function() {
        cacheRuleEngine.getManager().addNeverRule( /aaa/);
    });

    it('Gets all cacheRules.always should still contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.always).to.contain({regex: /aaa/});
    });

    it('Gets all cacheRules.never should not contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.never).to.not.contain({regex: /aaa/});
    });
});



describe('Testing adding/removing rules with settings on_existing_regex = error', function() {

    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance('INSTANCE1', storageConfig, { on_existing_regex: 'error' }, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleEngine = instance.getCacheRuleEngine();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleEngine).to.be.defined;
        expect(url).to.be.defined;
    });

    it('Adds a new Always rule /aaa/ without error', function() {
        cacheRuleEngine.getManager().addAlwaysRule(/aaa/);
    });

    it('Gets all cacheRules.always should contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.always).to.contain({regex: /aaa/});
    });

    it('Adds a new never rule /aaa/ should throw an error', function() {
        expect( function(){cacheRuleEngine.getManager().addNeverRule( /aaa/)}).to.throw;
    });

    it('Gets all cacheRules.always should still contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.always).to.contain({regex: /aaa/});
    });

    it('Gets all cacheRules.never should not contain /aaa', function() {
        const rules = cacheRuleEngine.getManager().getRules();
        expect(rules.never).to.not.contain({regex: /aaa/});
    });
});


//TODO adding, deleting, getting rules
// with different strategies


/*
describe('setting the default rule to always', function() {

    it('should set ok', function() {
        cacheRuleEngine.manager.setDefault('always');
        expect(cacheRuleEngine.getRules().default).eql('always');
    });

});*/



