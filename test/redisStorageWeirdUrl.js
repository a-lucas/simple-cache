"use strict";

var CacheEngine = require('./../dist/redis-cache').CacheEnginePromise;
var Instance = require('./../dist/redis-cache').Instance;

var weirdUrls = require('./helper/weirdUrls');
var common = require('./helper/commonCB');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

var SET_URL = require('./helper/common').SET_URL;
var DELETE_URL = require('./helper/common').DELETE_URL;

var storageConfig = {
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
};

var cacheRules = {
    maxAge: [],
    always: [
        {
            regex: /.*/
        }
    ],
    never: [],
    default: 'never'
};

var instance,
    cacheEngine,
    instanceName = 'WEIRDURLS',
    cacheEngine;

describe('CONFIG: clearing configs', function () {
    common.RECREATE_CONFIG(instanceName, storageConfig, cacheRules);
});

describe('INITIALIZING CacheEngine and Instance', function () {

    it('should initialize instance & redis OK', function (done) {
        instance = new Instance(instanceName, storageConfig, {
            on_existing_regex: 'replace',
            on_publish_update: true
        }, function (err) {
            if (err) return done(err);
            cacheEngine = new CacheEngine('whatever', instance);
            var urls = [];
            weirdUrls.valid.forEach(function(url) {
                "use strict";
                urls.push( cacheEngine.url(url));
            });
            testURLs({urls: urls, cacheEngine: cacheEngine});
            done();
        });
    });

});

describe('waiting to launch', function(){
    it('is launching', function (done) {
        var interval = setInterval(function () {
            if (typeof cacheEngine !== 'undefined') {
                clearInterval(interval);
                done();
            }
        }, 100);
    });
});

var testURLs = function(data) {

    var cacheEngine = data.cacheEngine,
        urls = data.urls;

    urls.forEach(function(url) {
        SET_URL(url, 'content');
        DELETE_URL(url, 'content');
    });
};
