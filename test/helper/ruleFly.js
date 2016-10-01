"use strict";

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;
var cacheRules = require('./cacheRules');

var DELETE_DOMAIN = require('./commonCB').DELETE_DOMAIN;
var HAS_DOMAIN = require('./commonCB').HAS_DOMAIN;
var SET_URL = require('./commonCB').SET_URL;
var SET_URL_FALSE = require('./commonCB').SET_URL_FALSE;
var HAS_NOT_URL = require('./commonCB').HAS_NOT_URL;
var DELETE_ALL = require('./commonCB').DELETE_ALL;
var DELETE_URL = require('./commonCB').DELETE_URL;
var WAIT_HAS_NOT_URL = require('./commonCB').WAIT_HAS_NOT_URL;
var SET_FORCE = require('./commonCB').SET_FORCE;
var URL_DETAILS = require('./commonCB').URL_DETAILS;
var GET_URLS = require('./commonCB').GET_URLS;
var WAIT_GET_URLS = require('./commonCB').WAIT_GET_URLS;

module.exports = function (cacheEngine, instance, defaultDomain) {

    var cacheMaxAgeURL = '/maxAge.html';
    var cacheAlwaysURL = '/always.html';
    var cacheNeverURL = '/never.html';
    var notMatchedURL = '/unmatched.html';

    var html = '<b>Some HTML</b>';

    var urlCache1, urlCache2, urlCache3, urlCache4;

    var cacheRuleEngine = instance.getCacheRuleEngine();

    var url = cacheEngine.url(notMatchedURL);



    describe('Some verifications', () => {

        it('it should get the correct instance name', function() {
            console.log(instance);
            expect(instance.getInstanceName()).eql('INSTANCE1');
        });

        it('Should get the same CacheConfig as the default one', function() {

            expect(cacheRuleEngine.getRules()).eql(cacheRules);
        })

    } );

    URL_DETAILS(url, notMatchedURL, 'never');

    describe('setting the default rule to always', function() {
        it('should set ok', function() {
            cacheRuleEngine.manager.setDefault('always');
            expect(cacheRuleEngine.getRules().default).eql('always');
        });

    });

    URL_DETAILS(url, notMatchedURL, 'never');


    describe('running publish()', function() {
        it('just did that! ', function() {
            cacheRuleEngine.publish();
        });
    });

    URL_DETAILS(url, notMatchedURL, 'always');



    /*
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

    */
}
