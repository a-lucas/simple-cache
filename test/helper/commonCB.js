"use strict";
var redis = require('redis');
var CacheRulesCreator = require('./../../dist/redis-cache').RedisUrlCache.CacheRulesCreator;

var leche = require('leche');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;

//Meeds context Sharing


function WAIT_HAS_NOT_URL (url, time) {
    describe('Waits ' + time +' and shouldn\'t have the url cached for ' + url.getUrl(), function() {
        it('waiting...', function(done) {
            setTimeout(function() {
                done();
            }, time);
        });
        HAS_NOT_URL(url);
    });
}


function SET_URL(url, content, extra) {

    describe('Setting a URL ' + url.getDomain() + url.getUrl() , function() {
        var setted;

        HAS_NOT_URL(url);

        it('cache the url without errors', function(done){
            url.set(content, extra, false, function(err, res) {
                if(err) return done(err);
                setted = res;
                done();
            });
        });

        it('set() should resolve(true)', function() {
            expect(setted).eql(true);
        });

        HAS_URL(url);
        URL_HAS_CONTENT(url, content, extra);
    });

}

function DELETE_URL(url) {
    describe('Deleting the URL ' + url.getDomain() + url.getUrl(), function() {

        it('Should delete the url without reject', function(done) {
            url.delete(function(err, res) {
                if(err) return done(err);
                done();
            });
        });

        HAS_NOT_URL(url);
        URL_GET_REJECTED(url);
        DELETE_URL_REJECTED(url);
    });

}

function SET_URL_FALSE(url, content, extra) {
    describe('Calling set() should resolve to (false) - already cached on ' + url.getUrl(), function() {
        var setted;
        it('cache the url  without errors', function(done){
            url.set(content, extra, false, function(err, res) {
                if(err) return done(err);
                setted = res;
                done();
            });
        });
        it('set() should resolve(false)', function() {
            expect(setted).eql(false);
        });
    })
}

function URL_DETAILS(url, expectedUrl, expectedClassification, expectedDomain) {
    describe('some validation for ' + url.getDomain() + url.getUrl(), function(){
        it(' classification check & url name check ', function() {
            expect(url.getUrl()).eql(expectedUrl);
            expect(url.getCategory()).eql(expectedClassification);
        });
        if(expectedDomain) {
            it(' domain check ', function() {
                expect(url.getDomain()).eql(expectedDomain);
            })
        }
    });
}

function HAS_DOMAIN(domain, cacheEngine) {
    describe(domain +' should exist', function() {
        var domains;
        it('should run simpleUrlCache.getStoredHostnames() without error', function(done) {
            cacheEngine.getStoredHostnames(function(err, results){
                if(err) return done(err);
                domains = results;
                done();
            });
        });
        it('Domain should exists ' + domain, function() {
            expect(domains instanceof Array).eql(true);
            expect(domains).to.include(domain);
        });
    });
}

function HAS_NOT_DOMAIN(domain, cacheEngine) {
    describe(domain +' should NOT exist', function() {
        var domains;
        it('should run simpleUrlCache.getStoredHostnames() without error', function(done) {
            cacheEngine.getStoredHostnames(function(err, results) {
                if(err) return done(err);
                domains = results;
                done();
            });
        });
        it('Domain should NOT exists ' + domain, function() {
            expect(domains instanceof Array).eql(true);
            expect(domains).to.not.include(domain);
        });
    });
}

function DELETE_DOMAIN(domain, cacheEngine) {

    describe('Deleting domain ' + domain , function() {
        it('Should delete the domain without error ', function (done) {
            cacheEngine.clearDomain(domain, function(err) {
                if(err) return done(err);
                done();
            });
        });
    });

    HAS_NOT_DOMAIN(domain, cacheEngine);
}

function GET_URLS(domain, cacheEngine, expectedUrls) {
    var allUrls;
    describe('Getting URLs for the domain ' + domain , function() {
        it('Should get the urls witouth errors ', function(done) {
            cacheEngine.getStoredURLs(domain, function(err, result) {
                if(err) return done(err);
                allUrls = result;
                done();
            });
        });

        it('Should return the correct urls', function () {
            expect(allUrls).eql(expectedUrls);
        });
    })
}

function DELETE_ALL(cacheEngine) {

    describe('Clearing all domains by calling clearInstance', function() {
        var domains ;
        it('should run clearInstance() without errors', function(done) {
            //console.log('C3');
            //console.log(cacheEngine);
            cacheEngine.clearInstance(function(err, res) {
                if(err) return done(err);
                done();
            });
        });

        it('runs getStoredHostNames()', function(done) {
            cacheEngine.getStoredHostnames(function(err, results) {
                if(err) return done(err);
                domains = results;
                done();
            });
        });

        it('Should not contain any domains', function() {
            expect(domains instanceof Array).eql(true);
            expect(domains).eql([]);
        });
    });

}

function SET_FORCE(url, content, extra) {

    describe('Forcing the URL cache ', function() {

        it('The url is forcefully cached', function(done) {

            url.set(content, extra, true, function(err, res) {
                if(err) return done(err);
                done();

            });
        });

        HAS_URL(url );
        URL_HAS_CONTENT(url,  content, extra);
    })

}

function WAIT_GET_URLS (cacheEngine, time, domain, urlExpected) {
    describe('Waits ' + time , function() {

        it('waiting...', function(done) {
            setTimeout(function() {
                done();
            }, time);
        });

    });
    GET_URLS(domain, cacheEngine, urlExpected);
}

module.exports.WAIT_GET_URLS = WAIT_GET_URLS;
module.exports.DELETE_ALL = DELETE_ALL;
module.exports.GET_URLS = GET_URLS;
module.exports.DELETE_DOMAIN = DELETE_DOMAIN;
module.exports.HAS_NOT_DOMAIN = HAS_NOT_DOMAIN;
module.exports.HAS_DOMAIN = HAS_DOMAIN;
module.exports.URL_DETAILS = URL_DETAILS;
module.exports.SET_URL_FALSE = SET_URL_FALSE;
module.exports.WAIT_HAS_NOT_URL = WAIT_HAS_NOT_URL;
module.exports.SET_URL = SET_URL;
module.exports.DELETE_URL = DELETE_URL;

//Dont need context sharing
function RECREATE_CONFIG(instanceName, storageConfig, cacheRules) {

    describe('Creating a new Config for '+ instanceName, function () {

        it('delete redis Exiting Cache Config', function (done) {
            const client = redis.createClient(storageConfig);

            client.hdel('url-cache:ruleconfig', instanceName, function (err) {
                if (err) return done(err);
                done();
            });
        });

        it('should create the new cache rule ok', function (done) {
            CacheRulesCreator.createCache(instanceName, false, storageConfig, cacheRules, function (err) {
                if (err) return done(err);
                done();
            });
        });

        it('should complain about the fact that a Cache Config already exists', function (done) {

            CacheRulesCreator.createCache(instanceName, false, storageConfig, cacheRules, function (err) {
                if (err) return done();
                if (!err) done('Should be refused');
            });
        });

    });
}



module.exports.RECREATE_CONFIG = RECREATE_CONFIG;

//Attomics


function HAS_URL (url) {
    var has;
    it('Retrieve URL HAS() without errors ', function(done) {
        url.has(function(err, res) {
            if(err) return done(err);
            has = res;
            done();
        });
    });

    it('retrieved value should be true', function() {
        expect(has).eql(true);
    });
}

function DELETE_URL_REJECTED(url) {
    it('Should reject the deletion of the url', function(done) {
        url.delete(function(err) {
            if(!err) {done('err')}
            else{
                done();
            }
        });
    });
}

function HAS_NOT_URL (url) {
    var has;
    it('Retrieve URL HAS() without errors ', function(done) {
        url.has(function(err, res) {
            if(err) return done(err);
            has = res;
            done();
        });
    });

    it('retrieved value should be false', function() {
        expect(has).eql(false);
    });
}

///

function URL_HAS_CONTENT(url, content, extra) {
    var urlContent;
    it('The URL get Should resolve(true) ', function(done) {
        url.get(function(err, res) {
            if(err) return done(err);
            urlContent = res;
            done();
        });
    });

    it('content should be expected', function() {
        expect(urlContent.content).eql(content);
    });

    it('content should be expected', function() {
        expect(urlContent.extra).eql(extra);
    });
}

function URL_GET_REJECTED(url) {
    it('The url.get() should reject() ', function(done) {
        url.get(function(err) {
            if(!err) {done('err')}
            else{
                done();
            }
        });
    });
}


module.exports.SET_FORCE = SET_FORCE;
module.exports.URL_GET_REJECTED = URL_GET_REJECTED;
module.exports.URL_HAS_CONTENT = URL_HAS_CONTENT;
module.exports.DELETE_URL_REJECTED = DELETE_URL_REJECTED;
module.exports.DELETE_URLS_REJECTED = DELETE_URL_REJECTED;
module.exports.HAS_NOT_URL = HAS_NOT_URL;
module.exports.HAS_URL = HAS_URL;
