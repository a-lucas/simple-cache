var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;




module.exports = function(type, data) {


    switch(type) {
        case 'cb':
            var DELETE_DOMAIN = require('./commonCB').DELETE_DOMAIN;
            var HAS_NOT_DOMAIN = require('./commonCB').HAS_NOT_DOMAIN;
            var HAS_DOMAIN = require('./commonCB').HAS_DOMAIN;
            var HAS_NOT_URL = require('./commonCB').HAS_NOT_URL;
            var HAS_URL = require('./commonCB').HAS_URL;
            var SET_URL = require('./commonCB').SET_URL;
            var DELETE_ALL = require('./commonCB').DELETE_ALL;
            break;
        case 'promise':
            var DELETE_DOMAIN = require('./common').DELETE_DOMAIN;
            var HAS_NOT_DOMAIN = require('./common').HAS_NOT_DOMAIN;
            var HAS_DOMAIN = require('./common').HAS_DOMAIN;
            var HAS_NOT_URL = require('./common').HAS_NOT_URL;
            var HAS_URL = require('./common').HAS_URL;
            var SET_URL = require('./common').SET_URL;
            var DELETE_ALL = require('./common').DELETE_ALL;
            break;
    }

    var html = data.html,
        cacheEngine1 = data.i1.engine,
        cacheEngine2 = data.i2.engine,
        cacheEngine3 = data.i3.engine,
        instance1Urls = data.i1.urls,
        instance2Urls = data.i2.urls,
        instance3Urls = data.i3.urls,
        domain1 = data.i1.domain,
        domain2 = data.i2.domain,
        domain3 = data.i3.domain;


    describe('Instance 1 ...', function () {
        var i;
        for(i=0; i<3; i++) {
            SET_URL(instance1Urls[i], html, { key: 'value' });
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
            SET_URL(instance3Urls[i], html, { key: 'value' });
        }
    });


    describe('Instance 2 ...', function () {
        DELETE_DOMAIN('http://a.com', cacheEngine2);
    });

    describe('Instance 1 ...', function () {
        HAS_NOT_DOMAIN('http://a.com', cacheEngine1);
        DELETE_DOMAIN('http://b.com', cacheEngine1);
    });

    describe('Instance 1 ...', function () {
        HAS_NOT_DOMAIN('http://b.com', cacheEngine2);
    });

    describe('Instance 3 ...', function () {
        HAS_DOMAIN('http://a.com', cacheEngine3);
        HAS_DOMAIN('http://b.com', cacheEngine3);
    });

    describe('Removing instance1', function() {
        DELETE_ALL(cacheEngine1);
    });

    describe('Instance2 should have no domains', function() {
        HAS_NOT_DOMAIN('http://a.com', cacheEngine2);
        HAS_NOT_DOMAIN('http://b.com', cacheEngine2);
        HAS_NOT_DOMAIN(domain2, cacheEngine2);
    });

    describe('Removing Instance3', function() {
        DELETE_ALL(cacheEngine3);
    });
    
};