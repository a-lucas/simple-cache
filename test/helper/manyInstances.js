var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;


var DELETE_DOMAIN = require('./common').DELETE_DOMAIN;
var HAS_NOT_DOMAIN = require('./common').HAS_NOT_DOMAIN;
var HAS_DOMAIN = require('./common').HAS_DOMAIN;
var HAS_NOT_URL = require('./common').HAS_NOT_URL;
var HAS_URL = require('./common').HAS_URL;
var SET_URL = require('./common').SET_URL;


var DELETE_ALL = require('./common').DELETE_ALL;

module.exports = function(instance1, instance2, instance3, defaultDomain1, defaultDomain2, defaultDomain3) {


    var cacheMaxAgeURL = 'maxAge.html';
    var cacheAlwaysURL = 'always.html';
    var cacheNeverURL = 'never.html';
    var notMatchedURL = 'unmatched.html';

    var html = '<b>Some HTML</b>';


    var urls = [
        'http://a.com/always.html',
        'http://b.com/always.html',
        'always.html'
    ];

    var instance1Urls = [],
        instance2Urls = [],
        instance3Urls = [];

    urls.forEach(function (url) {
        instance1Urls.push(instance1.url(url));
        instance2Urls.push(instance2.url(url));
        instance3Urls.push(instance3.url(url));
    });

    describe('Instance 1 ...', function () {
        var i;
        for(i=0; i<3; i++) {
            SET_URL(instance1Urls[i], html);
        }
    });

    describe('Instance 2 ...', function () {
        describe('The two a.com & b.com should be already set', function() {
            HAS_URL(instance2Urls[0]);
            HAS_URL(instance2Urls[1]);
        })
        describe('The default domain should not be set', function() {
            HAS_NOT_URL(instance2Urls[2]);
        });
    });

    describe('Instance 3 ...', function () {
        var i;
        for(i=0; i<3; i++) {
            SET_URL(instance3Urls[i], html);
        }
    });


    describe('Instance 2 ...', function () {
        DELETE_DOMAIN('http://a.com', instance2);
    });

    describe('Instance 1 ...', function () {
        HAS_NOT_DOMAIN('http://a.com', instance1);
        DELETE_DOMAIN('http://b.com', instance1);
    });

    describe('Instance 1 ...', function () {
        HAS_NOT_DOMAIN('http://b.com', instance2);
    });

    describe('Instance 3 ...', function () {
        HAS_DOMAIN('http://a.com', instance3);
        HAS_DOMAIN('http://b.com', instance3);

    });

    describe('Removing instance1', function() {
        DELETE_ALL(instance1);
    });

    describe('Instance2 should have no domains', function() {
        HAS_NOT_DOMAIN('http://a.com', instance2);
        HAS_NOT_DOMAIN('http://b.com', instance2);
        HAS_NOT_DOMAIN(defaultDomain2, instance2);
    });

    describe('Removing Instance3', function() {
        DELETE_ALL(instance3);
    });
    
};