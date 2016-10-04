"use strict";

var debug = require('debug')('simple-url-cache-test');
var Instance = require('./../../dist/redis-cache').Instance;
var cacheRules = require('./../helper/cacheRules');
var shared = require('mocha-shared');
var chai = require('chai');
var expect = chai.expect;

var instanceName1 = 'INSTANCE',
    storageConfig = {
        type: 'redis',
        host: '127.0.0.1',
        port: 6379,
        socket_keepalive: true
    },
    domain1 = 'http://localhost:3000',
    CacheEngine,
    cacheEngine,
    url,
    DELETE_DOMAIN,
    HAS_DOMAIN,
    SET_URL,
    SET_URL_FALSE,
    HAS_NOT_URL,
    DELETE_ALL,
    DELETE_URL,
    WAIT_HAS_NOT_URL,
    SET_FORCE,
    URL_DETAILS,
    GET_URLS,
    WAIT_GET_URLS;

module.exports = function (type, data) {

    switch (type) {
        case 'cb':
            CacheEngine = require('./../../dist/redis-cache').CacheEngineCB;
            DELETE_DOMAIN = require('./commonCB').DELETE_DOMAIN;
            HAS_DOMAIN = require('./commonCB').HAS_DOMAIN;
            SET_URL = require('./commonCB').SET_URL;
            SET_URL_FALSE = require('./commonCB').SET_URL_FALSE;
            HAS_NOT_URL = require('./commonCB').HAS_NOT_URL;
            DELETE_ALL = require('./commonCB').DELETE_ALL;
            DELETE_URL = require('./commonCB').DELETE_URL;
            WAIT_HAS_NOT_URL = require('./commonCB').WAIT_HAS_NOT_URL;
            SET_FORCE = require('./commonCB').SET_FORCE;
            URL_DETAILS = require('./commonCB').URL_DETAILS;
            GET_URLS = require('./commonCB').GET_URLS;
            WAIT_GET_URLS = require('./commonCB').WAIT_GET_URLS;
            break;
        case 'promise':
            CacheEngine = require('./../../dist/redis-cache').CacheEnginePromise;
            DELETE_DOMAIN = require('./common').DELETE_DOMAIN;
            HAS_DOMAIN = require('./common').HAS_DOMAIN;
            SET_URL = require('./common').SET_URL;
            SET_URL_FALSE = require('./common').SET_URL_FALSE;
            HAS_NOT_URL = require('./common').HAS_NOT_URL;
            DELETE_ALL = require('./common').DELETE_ALL;
            DELETE_URL = require('./common').DELETE_URL;
            WAIT_HAS_NOT_URL = require('./common').WAIT_HAS_NOT_URL;
            SET_FORCE = require('./common').SET_FORCE;
            URL_DETAILS = require('./common').URL_DETAILS;
            GET_URLS = require('./common').GET_URLS;
            WAIT_GET_URLS = require('./common').WAIT_GET_URLS;
    }

    var html = data.html,
        cacheEngine = data.engine,
        maxAge = data.maxAge,
        never = data.never,
        always = data.always,
        unmatched = data.unmatched,
        clearInstance = data.clearInstance,
        multipleDomains = data.multipleDomains,
        getStoredURLs = data.getStoredURLs,
        domain = data.domain;


    describe('cacheMaxAge URL', function () {

        URL_DETAILS(maxAge.obj, maxAge.str, 'maxAge');

        SET_URL(maxAge.obj, html);

        SET_URL_FALSE(maxAge.obj, html);

        WAIT_HAS_NOT_URL(maxAge.obj, 1100);

        SET_URL(maxAge.obj, html);

        DELETE_URL(maxAge.obj);

    });



    describe('cacheNever', function () {

        URL_DETAILS(never.obj, never.str, 'never');

        SET_URL_FALSE(never.obj, html);

        SET_FORCE(never.obj, html);

        DELETE_URL(never.obj);

    });


    describe('unMatchedURL', function () {
        URL_DETAILS(unmatched.obj, unmatched.str, 'never');

        SET_URL_FALSE(unmatched.obj, html);

        SET_FORCE(unmatched.obj, html);

        DELETE_URL(unmatched.obj);
    });


    describe('cacheAlways', function () {

        URL_DETAILS(always.obj, always.str, 'always');

        SET_URL(always.obj, html);

        SET_URL_FALSE(always.obj, html);

        DELETE_URL(always.obj);

    });


    describe('clearInstance()', function () {

        clearInstance.forEach(function (url) {
            SET_URL(url, html);
        });
        DELETE_ALL(cacheEngine);
    });


    describe('multiple domains', function () {

        describe('URLS should have the same instance name', function () {
            it('Instances', function () {
                expect(multipleDomains[0].getInstanceName()).eql(multipleDomains[1].getInstanceName());
                expect(multipleDomains[0].getInstanceName()).eql(multipleDomains[2].getInstanceName());
                expect(multipleDomains[2].getInstanceName()).eql(multipleDomains[1].getInstanceName());
            });
        });

        SET_URL(multipleDomains[0], html);
        SET_URL(multipleDomains[1], html);
        SET_URL(multipleDomains[2], html);

        URL_DETAILS(multipleDomains[0], '/always.html', 'always', 'http://a.com');
        URL_DETAILS(multipleDomains[1], '/always.html', 'always', 'http://b.com');

        HAS_DOMAIN(domain, cacheEngine);
        HAS_DOMAIN('http://a.com', cacheEngine);
        HAS_DOMAIN('http://b.com', cacheEngine);

        DELETE_DOMAIN('http://a.com', cacheEngine);

        HAS_DOMAIN(domain, cacheEngine);
        HAS_DOMAIN('http://b.com', cacheEngine);

        DELETE_DOMAIN('http://whatever_should_silently_succeed', cacheEngine);
        DELETE_DOMAIN('http://b.com', cacheEngine);
        DELETE_DOMAIN('http://b.com', cacheEngine);
        DELETE_DOMAIN(domain, cacheEngine);

        describe('These URLs shouldnt be cached anymore', function () {
            HAS_NOT_URL(multipleDomains[0]);
            HAS_NOT_URL(multipleDomains[1]);
            HAS_NOT_URL(multipleDomains[2]);
        });
        DELETE_ALL(cacheEngine);
    });

    describe('getCachedURLs()', function () {

        GET_URLS(domain, cacheEngine, []);
        GET_URLS('http://a.com', cacheEngine, []);


        SET_URL(getStoredURLs[0], html);
        SET_URL(getStoredURLs[1], html);
        SET_URL(getStoredURLs[2], html);

        GET_URLS(domain, cacheEngine, ['/0always.html']);
        GET_URLS('http://a.com', cacheEngine, ['/1always.html', '/maxAge.html']);

        WAIT_GET_URLS(cacheEngine, 1100, 'http://a.com', ['/1always.html']);

        DELETE_ALL(cacheEngine);

        GET_URLS(domain, cacheEngine, []);
        GET_URLS('http://a.com', cacheEngine, []);

        DELETE_ALL(cacheEngine);

    });

};