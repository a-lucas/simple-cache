"use strict";
var CacheEngine = require('./../dist/redis-cache').CacheEngineCB;
var Instance = require('./../dist/redis-cache').Instance;
var CacheRulesCreator = require('./../dist/redis-cache').CacheRulesCreator;
var chai = require('chai');
var expect = chai.expect;
var redis = require('redis');
var debug = require('debug')('simple-url-cache-test');
var common = require('./helper/commonCB');

var cacheRules = require('./helper/cacheRules');

var storageConfig = {
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
    cacheRuleManager,
    cacheRuleManager2,
    url,
    url2,
    creator,
    instanceName  = 'RULES-TESTING';


common.RECREATE_CONFIG(instanceName, storageConfig, cacheRules);

describe('Building instance and loading the cacheEngine', function () {


    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance(instanceName, storageConfig, {}, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleManager = instance.getManager();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleManager).to.be.defined;
        expect(url).to.be.defined;
    });

});


describe('Few checks', function() {
    it('it should get the correct instance name', function () {
        expect(instance.getInstanceName()).eql(instanceName);
        expect(cacheEngine.getInstanceName()).eql(instanceName);
    });

    it('Should get the same CacheConfig as the default one', function () {
        expect(cacheRuleManager.getRules()).eql(cacheRules);
        console.log(cacheRules);
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
        cacheRuleManager.setDefault('always');
        expect(cacheRuleManager.getRules().default).eql('always');
    });

    it('url classification should still be never ', function() {
        expect(url.getCategory()).eql('never');
    });

    it('it runs publish() ', function() {
        instance.publish();
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
        instance2 = new Instance(instanceName, storageConfig, { on_publish_update: true}, function (err) {
            if (err) return done(err);
            cacheEngine2 = new CacheEngine(domain, instance2);
            cacheRuleManager2 = instance2.getManager();
            url2 = cacheEngine2.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance2).to.be.defined;
        expect(cacheEngine2).to.be.defined;
        expect(cacheRuleManager2).to.be.defined;
        expect(url2).to.be.defined;
    });

    it('it should get the correct instance name', function () {
        expect(instance2.getInstanceName()).eql(instanceName);
        expect(cacheEngine2.getInstanceName()).eql(instanceName);

    });

    it('Should get a dfferent  CacheConfig as the default one', function () {
        expect(cacheRuleManager2.getRules()).not.eql(cacheRules);
    });

    it('URL should get the always classification from the previous test suite', function() {
        expect(url2.getUrl()).eql(notMatchedURL);
        expect(url2.getCategory()).eql('always');
    });

    it(' domain check ', function() {
        expect(url2.getDomain()).eql(domain);
    });

    it('should set default value to never ok', function() {
        cacheRuleManager2.setDefault('never');
        expect(cacheRuleManager2.getRules().default).eql('never');
    });

    it('url classification should still be always ', function() {
        expect(url2.getCategory()).eql('always');
    });

    it('it runs publish() ', function() {
        instance2.publish();
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

common.RECREATE_CONFIG(instanceName, storageConfig, cacheRules);


describe('Building instance and loading the cacheEngine', function () {


    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance(instanceName, storageConfig, {on_existing_regex: 'replace'}, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleManager = instance.getManager();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleManager).to.be.defined;
        expect(url).to.be.defined;
    });

});


describe('Testing adding/removing rules with default settings on_existing_regex = replace', function() {

    it('Adds a new Always rule /aaa/ without error', function() {
        cacheRuleManager.addAlwaysRule(domain, /aaa/);
    });

    it('Gets all cacheRules.always should contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.always).to.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });

    it('Adds a new never rule /aaa/ without error', function() {
        cacheRuleManager.addNeverRule(domain, /aaa/);
    });

    it('Gets all cacheRules.always should not contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        console.log(rules);
        expect(rules.always).to.not.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });

    it('Gets all cacheRules.never should contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.never).to.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });
});


describe('Testing adding/removing rules with settings on_existing_regex = ignore', function() {

    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance(instanceName, storageConfig, { on_existing_regex: 'ignore' }, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleManager = instance.getManager();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleManager).to.be.defined;
        expect(url).to.be.defined;
    });

    it('Adds a new Always rule /aaa/ without error', function() {
        cacheRuleManager.addAlwaysRule(domain, /aaa/);
    });

    it('Gets all cacheRules.always should contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.always).to.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });

    it('Adds a new never rule /aaa/ without error', function() {
        cacheRuleManager.addNeverRule( domain, /aaa/);
    });

    it('Gets all cacheRules.always should still contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.always).to.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });

    it('Gets all cacheRules.never should not contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.never).to.not.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });
});

describe('Testing adding/removing rules with settings on_existing_regex = error', function() {

    it('should initialize the cacheEngine OK', function (done) {
        instance = new Instance(instanceName, storageConfig, { on_existing_regex: 'error' }, function (err) {
            if (err) {
                debug('ERR = ', err);
                return done(err);
            }
            cacheEngine = new CacheEngine(domain, instance);
            cacheRuleManager = instance.getManager();
            url = cacheEngine.url(notMatchedURL);
            done();
        });
    });

    it('should have instance, cacheEngine, CacheRuleEngine and url', function () {
        expect(instance).to.be.defined;
        expect(cacheEngine).to.be.defined;
        expect(cacheRuleManager).to.be.defined;
        expect(url).to.be.defined;
    });

    it('Adds a new Always rule /aaa/ without error', function() {
        cacheRuleManager.addAlwaysRule(domain, /aaa/);
    });

    it('Gets all cacheRules.always should contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.always).to.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });

    it('Adds a new never rule /aaa/ should throw an error', function() {
        expect( function(){cacheRuleManager.addNeverRule( domain, /aaa/)}).to.throw;
    });

    it('Gets all cacheRules.always should still contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.always).to.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });

    it('Gets all cacheRules.never should not contain /aaa', function() {
        const rules = cacheRuleManager.getRules();
        expect(rules.never).to.not.contain({domain: domain, rules: [{regex: /aaa/, ignoreQuery: false}]});
    });
});
