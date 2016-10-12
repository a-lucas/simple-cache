"use strict";
var chai = require('chai');
var expect = chai.expect;

var CacheRulesCreator = require('./../dist/redis-cache').RedisUrlCache.CacheRulesCreator;
var CacheEnginePromise = require('./../dist/redis-cache').RedisUrlCache.CacheEnginePromise;
var CacheEngineCB = require('./../dist/redis-cache').RedisUrlCache.CacheEngineCB;
var Instance = require('./../dist/redis-cache').RedisUrlCache.Instance;


var storageConfig = {
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};

var cacheRules = require('./helper/cacheRules');

describe('It should fail on wrong parameters', function() {

    describe('Config creator', function() {

        it('should fail with no arguments', function() {
            expect(function(){new CacheRulesCreator();}).to.throw;
        });

        it('should fail with 3 null arguments', function() {
            expect(function(){new CacheRulesCreator(null, null, null);}).to.throw;
        });

        it('should fail with 3 null arguments', function() {
            expect(function(){new CacheRulesCreator(null, null, null);}).to.throw;
        });


        it('should fail with first wrong argument null arguments', function() {
            expect(function(){new CacheRulesCreator('', storageConfig, cacheRules);}).to.throw;
        });


        it('should fail with econf wrong argument null arguments', function() {
            expect(function(){new CacheRulesCreator('whatever', {}, cacheRules);}).to.throw;
        });


        it('should fail with invalid cacheRules wrong argument null arguments', function() {
            expect(function(){new CacheRulesCreator('aaaa', storageConfig, {});}).to.throw;
        });

    });

    describe('INSTANCE', function() {
        it('Null params - should fail with no parames, 1 param, 2 params,  3 params and 4 null paams', function() {
            expect(function(){new Instance()}).to.throw;
            expect(function(){new Instance(null)}).to.throw;
            expect(function(){new Instance(null, null)}).to.throw;
            expect(function(){new Instance(null, null, null)}).to.throw;
            expect(function(){new Instance(null, null, null, null)}).to.throw;
        });

        it('should fail with Invalid storage config', function(done) {
            new Instance('INSTANCE', {host: '127.0.0.1', port: 6000}, {}, (err)=>{
                if(err) {return done();}
                else {
                    return done('no error');
                }
            });
        });

        it('should fail with valid storage config but inexistant instance', function(done) {
            new Instance('DONT EXISTS', storageConfig, {}, (err)=>{
                if(err) return done();
                done('no error');
            });
        });
    });

    describe('CacheEngine', function() {

        describe('Promise', function() {
            var instance1,
                instance2;
            it('creates a valid instance', function(done) {
                instance1 = new Instance('INSTANCE', storageConfig, {}, (err) => {
                    if(err) return done(err);
                    done();
                });
            });

            it('creates an invalid instance', function(done) {
                instance2 = new Instance('IIIIIINSTANCE_NOT_VALID', storageConfig, {}, (err) => {
                    if(err) {return done();}
                    else {
                        return done('no error');
                    }
                });
            });

            describe('constructor', function() {
                it('should fail withwith no parameters', function() {
                    expect(function(){ new CacheEnginePromise()}).to.throw;
                });

                it('should fail withwith null params', function() {
                    expect(function(){ new CacheEnginePromise(null, null)}).to.throw;
                });

                it('should fail withwith correct instance, wrong default domain', function() {
                    expect(function(){ new CacheEnginePromise('', instance1)}).to.throw;
                });

                it('should fail withwith correct domain, unitialized instance', function() {
                    expect(function(){ new CacheEnginePromise('some-domain', instance2)}).to.throw;
                });
            });

            describe('URL', function() {
                var cacheEngine;
                it('Creates a valid cache Engine', function() {
                    cacheEngine = new CacheEnginePromise('some-domain', instance1);
                    expect(cacheEngine).to.be.defined;
                });

                it('should fail with no arguments', function() {
                    expect(function() { cacheEngine.url()}).to.throw;
                });

                it('should fail with an empty string ', function() {
                    expect(function() { cacheEngine.url('')}).to.throw;
                });

                it('should fail with an object', function() {
                    expect(function() { cacheEngine.url(new Object())}).to.throw;
                });

                it('should fail with a domain witout url', function() {
                    expect(function() { cacheEngine.url( 'http://www/domain.com')}).to.throw;
                });

            })

        });

        describe('Callback', function() {
            var instance1,
                instance2;
            it('creates a valid instance', function(done) {
                instance1 = new Instance('INSTANCE', storageConfig, {}, (err) => {
                    if(err) return done(err);
                    done();
                });
            });

            it('creates an invalid instance', function(done) {
                instance2 = new Instance('INSTANCE_NOT_VALID', storageConfig, {}, (err) => {
                    if(err) {return done();}
                    else {
                        return done('no error');
                    }
                });
            });

            describe('constructor', function() {
                it('should fail with no parameters', function() {
                    expect(function(){ new CacheEngineCB()}).to.throw;
                });

                it('should fail with null params', function() {
                    expect(function(){ new CacheEngineCB(null, null)}).to.throw;
                });

                it('should fail with correct instance, wrong default domain', function() {
                    expect(function(){ new CacheEngineCB('', instance1)}).to.throw;
                });

                it('should fail with correct domain, unitialized instance', function() {
                    expect(function(){ new CacheEngineCB('some-domain', instance2)}).to.throw;
                });
            });

            describe('URL', function() {
                var cacheEngine;
                it('Creates a valid cache Engine', function() {
                    cacheEngine = new CacheEngineCB('some-domain', instance1);
                    expect(cacheEngine).to.be.defined;
                });

                it('should fail with no arguments', function() {
                    expect(function() { cacheEngine.url()}).to.throw;
                });

                it('should fail with an empty string ', function() {
                    expect(function() { cacheEngine.url('')}).to.throw;
                });

                it('should fail with an object', function() {
                    expect(function() { cacheEngine.url(new Object())}).to.throw;
                });

                it('should fail with a domain witout url', function() {
                    expect(function() { cacheEngine.url( 'http://www/domain.com')}).to.throw;
                });

            })
        });

    });

    describe('CacheRules', function() {

        var instance,
            manager;
        it('creates a valid instance', function(done) {
            instance = new Instance('INSTANCE', storageConfig, {on_existing_regex: 'error'}, (err) => {
                if(err) return done(err);
                done();
            });
        });


        it('get the cache rule', function() {
            manager = instance.getManager();
            expect(manager).to.not.be.undefined;
        });

        describe('addMaxAgeRule', function() {
            it('with no arguments', function() {
                expect(function(){manager.addMaxAgeRule()}).to.throw;
            });
            it('with no maxAge neither domain', function() {
                expect(function(){manager.addMaxAgeRule(null, /aaa/)}).to.throw;
            });
            it('with no domain', function() {
                expect(function(){manager.addMaxAgeRule(null, /aaa/, 10)}).to.throw;
            });
            it('with invalid maxAge', function() {
                expect(function(){manager.addMaxAgeRule('http://a.com', 'aaa',  10)}).to.throw;
            });
            it('with noMaxage', function() {
                expect(function(){manager.addMaxAgeRule( 'http://a.com', /aaa/)}).to.throw;
            });
            it('adds same regex two times', function() {
                manager.addMaxAgeRule('http://a.com', /bbb/, 10);
                expect(function(){manager.addMaxAgeRule('http://a.com', /bbb/, 10)}).to.throw;
            });
        });

    });
});
