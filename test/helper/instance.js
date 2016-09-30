var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;


var DELETE_DOMAIN = require('./common').DELETE_DOMAIN;
var HAS_DOMAIN = require('./common').HAS_DOMAIN;
var SET_URL = require('./common').SET_URL;
var SET_URL_FALSE = require('./common').SET_URL_FALSE;
var HAS_NOT_URL = require('./common').HAS_NOT_URL;
var HAS_URL = require('./common').HAS_URL;
var DELETE_ALL = require('./common').DELETE_ALL;
var DELETE_URL = require('./common').DELETE_URL;
var URL_HAS_CONTENT = require('./common').URL_HAS_CONTENT;
var DELETE_URL_REJECTED = require('./common').DELETE_URL_REJECTED;
var URL_GET_REJECTED = require('./common').URL_GET_REJECTED;
var WAIT_HAS_NOT_URL = require('./common').WAIT_HAS_NOT_URL;
var URL_NAME_IS = require('./common').URL_NAME_IS;
var URL_CATEGORY_IS = require('./common').URL_CATEGORY_IS;
var SET_FORCE = require('./common').SET_FORCE;
var URL_DETAILS = require('./common').URL_DETAILS;
var GET_URLS = require('./common').GET_URLS;
var WAIT_GET_URLS = require('./common').WAIT_GET_URLS;

module.exports = function (cacheEngine) {

    var cacheMaxAgeURL = '/maxAge.html';
    var cacheAlwaysURL = '/always.html';
    var cacheNeverURL = '/never.html';
    var notMatchedURL = '/unmatched.html';

    var html = '<b>Some HTML</b>';

    var urlCache1, urlCache2, urlCache3, urlCache4;


    describe('cacheMaxAge', function () {

        urlCache1 = cacheEngine.url(cacheMaxAgeURL);

        SET_URL(urlCache1, html);
        SET_URL_FALSE(urlCache1, html);

        WAIT_HAS_NOT_URL(urlCache1, 1100);

        SET_URL(urlCache1, html);

        DELETE_URL(urlCache1);

    });


    describe('cacheNever', function () {

        urlCache2 = cacheEngine.url(cacheNeverURL);

        URL_DETAILS(urlCache2, cacheNeverURL, 'never');

        SET_URL_FALSE(urlCache2, html);
        //HAS_NOT_URL(urlCache2);

        SET_FORCE(urlCache2, html);

        DELETE_URL(urlCache2);

    });


    describe('unMatchedURL', function () {
        urlCache3 = cacheEngine.url(notMatchedURL);

        URL_DETAILS(urlCache3, notMatchedURL, 'never');

        SET_URL_FALSE(urlCache3, html);

        SET_FORCE(urlCache3, html);

        DELETE_URL(urlCache3);
        ;
    });


    describe('cacheAlways', function () {

        urlCache4 = cacheEngine.url(cacheAlwaysURL);

        URL_DETAILS(urlCache4, cacheAlwaysURL, 'always');

        SET_URL(urlCache4, html);

        SET_URL_FALSE(urlCache4, html);

        DELETE_URL(urlCache4);

    });


    describe('clearInstance()', function () {
        var i,
            urlCaches = [];

        for (i = 0; i < 3; i++) {
            urlCaches.push(cacheEngine.url('http://a' + i + '.com/always.html'));
        }

        DELETE_ALL(cacheEngine);

        for (i = 0; i < 3; i++) {
            SET_URL(urlCaches[i], html);
        }

        DELETE_ALL(cacheEngine);
        DELETE_ALL(cacheEngine);
    });


    describe('multiple domains', function () {

        var urlCaches = [];

        urlCaches.push(cacheEngine.url('http://a.com/always.html'));
        urlCaches.push(cacheEngine.url('http://b.com/always.html'));
        urlCaches.push(cacheEngine.url('always.html'));

        debug('SETTING URLS', urlCaches.length);

        describe('URLS should have the same instance name & storage type', function () {
            it('Instances', function () {
                expect(urlCaches[0].getInstanceName()).eql(urlCaches[1].getInstanceName());
                expect(urlCaches[0].getInstanceName()).eql(urlCaches[2].getInstanceName());
                expect(urlCaches[2].getInstanceName()).eql(urlCaches[1].getInstanceName());
            });

            it('Storage Type', function () {
                expect(urlCaches[0].getStorageType()).eql(urlCaches[1].getStorageType());
                expect(urlCaches[0].getStorageType()).eql(urlCaches[2].getStorageType());
                expect(urlCaches[2].getStorageType()).eql(urlCaches[1].getStorageType());
            });
        });


        SET_URL(urlCaches[0], html);
        SET_URL(urlCaches[1], html);
        SET_URL(urlCaches[2], html);

        URL_DETAILS(urlCaches[0], '/always.html', 'always', 'http://a.com');
        URL_DETAILS(urlCaches[1], '/always.html', 'always', 'http://b.com');

        HAS_DOMAIN('COMMON_DOMAIN', cacheEngine);
        HAS_DOMAIN('http://a.com', cacheEngine);
        HAS_DOMAIN('http://b.com', cacheEngine);

        DELETE_DOMAIN('http://a.com', cacheEngine);

        HAS_DOMAIN('COMMON_DOMAIN', cacheEngine);
        HAS_DOMAIN('http://b.com', cacheEngine);

        DELETE_DOMAIN('http://whatever_should_silently_succeed', cacheEngine);
        DELETE_DOMAIN('http://b.com', cacheEngine);
        DELETE_DOMAIN('http://b.com', cacheEngine);
        DELETE_DOMAIN('COMMON_DOMAIN', cacheEngine);

        describe('These URLs shouldnt be cached anymore', function () {
            HAS_NOT_URL(urlCaches[0]);
            HAS_NOT_URL(urlCaches[1]);
            HAS_NOT_URL(urlCaches[2]);
        });


    });

    describe('getCachedURLs()', function () {

        var urlCaches = [];
        urlCaches.push(cacheEngine.url('/0always.html'));
        urlCaches.push(cacheEngine.url('http://a.com/1always.html'));
        urlCaches.push(cacheEngine.url('http://a.com/maxAge.html'));

        GET_URLS(urlCaches[0].getDomain(), cacheEngine, []);
        GET_URLS('http://a.com', cacheEngine, []);

        SET_URL(urlCaches[0], html);
        SET_URL(urlCaches[1], html);
        SET_URL(urlCaches[2], html);

        GET_URLS(urlCaches[0].getDomain(), cacheEngine, ['/0always.html']);
        GET_URLS('http://a.com', cacheEngine, ['/1always.html', '/maxAge.html']);

        WAIT_GET_URLS(cacheEngine, 1100, urlCaches[1].getDomain(), ['/1always.html']);

        DELETE_ALL(cacheEngine);

        GET_URLS(urlCaches[0].getDomain(), cacheEngine, []);
        GET_URLS('http://a.com', cacheEngine, []);

        DELETE_ALL(cacheEngine);

    });


};