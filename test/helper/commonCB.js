"use strict";
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;

//describes
function WAIT_HAS_NOT_URL (url, time) {
    describe('Waits ' + time +' and shouldn\'t have the url cached ' + url.getUrl(), function() {

        it('waiting...', function(done) {
            setTimeout(function() {
                done();
            }, time);
        });

        HAS_NOT_URL(url);

    });
}

function WAIT_GET_URLS (url, time, domain, urlExpected) {
    describe('Waits ' + time , function() {

        it('waiting...', function(done) {
            setTimeout(function() {
                done();
            }, time);
        });

    });
    GET_URLS(domain, url, urlExpected);
}


function SET_URL(url, html) {

    describe('It sets the URL ' + url.getUrl(), function() {
        var setted;
        HAS_NOT_URL(url);

        it('cache the url without errors', function(done){
            url.set(html, false, function(err, res) {
                if(err) return done(err);
                setted = res;
                done();
            });
        });

        it('set() should resolve(true)', function() {
            expect(setted).eql(true);
        });

        HAS_URL(url);
        URL_HAS_CONTENT(url, html);
    });
}

function DELETE_URL(url) {
    describe('Delet the URL ' + url.getUrl(), function() {

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

function SET_URL_FALSE(url, html) {
    describe('Calling set() should resolve to (false) - already cached', function() {
        var setted;
        it('cache the url '+ url.getUrl() + ' without errors', function(done){
            url.set(html, false, function(err, res) {
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
    describe('some validation ', function(){
        it(url.getUrl() +' classification is ' + url.getCategory(), function() {
            expect(url.getUrl()).eql(expectedUrl);
            expect(url.getCategory()).eql(expectedClassification);
        });
        if(expectedDomain) {
            it(url.getDomain() + ' domain should be ' + expectedDomain, function() {
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
        it('Should delete the domain without error ', function () {
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

    describe('Clearing all domains ', function() {
        var domains ;
        it('should run clearInstance() without errors', function(done) {

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


function SET_FORCE(url, html) {

    describe('Forcing the cache for ' + url.getUrl(), function() {

        it('The url is forcefully cached', function(done) {

            url.set(html, true, function(err, res) {
                if(err) return done(err);
                done();

            });
        });

        HAS_URL(url);
        URL_HAS_CONTENT(url, html);
    })

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
    it('Should reject the deletion of '+ url.getUrl(), function(done) {
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

function URL_HAS_CONTENT(url, html) {
    var urlContent;
    it('The URL get Should resolve(true) ' + url.getUrl(), function(done) {

        url.get(function(err, res) {
            if(err) return done(err);
            urlContent = res;
            done();
        });
    });

    it('The content should be expected', function() {
        expect(urlContent).eql(html);
    });
}

function URL_GET_REJECTED(url) {
    it('The url.get() should reject() ' + url.getUrl(), function(done) {
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
