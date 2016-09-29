
var simpleCache = require('./../dist/simple-cache.min');
var weirdUrls = require('./helper/weirdUrls');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

var SET_URL = require('./helper/common').SET_URL;
var HAS_NOT_URL = require('./helper/common').HAS_NOT_URL;
var DELETE_URL = require('./helper/common').DELETE_URL;
var URL_HAS_CONTENT = require('./helper/common').URL_HAS_CONTENT;

describe('The redisStorage - weirdURLs', function() {


    var storageConfig = {
        type: 'redis',
        host: '127.0.0.1',
        port: 6379,
        socket_keepalive: true
    };

    var cacheRules = {
        cacheMaxAge: [],
        cacheAlways: [
            {
                regex: /.*/
            }
        ],
        cacheNever: [],
        default: 'never'
    };

    var redisCache = new simpleCache('http://localhost: 3456', 'INSTANCE', storageConfig, cacheRules);

    var html = "content";

    describe('Should pass', function() {
        weirdUrls.valid.forEach(function(weirdUrl) {
            var url = redisCache.url(weirdUrl);

            describe('URL ' + weirdUrl + 'resolved to ' + url.getCurrentUrl(), function() {

                HAS_NOT_URL(url);

                SET_URL(url, html);

                URL_HAS_CONTENT(url, html);

                DELETE_URL(url);
            });

        });
        weirdUrls.invalid.forEach(function(weirdUrl) {
            var url = redisCache.url(weirdUrl);

            describe('URL ' + weirdUrl + 'resolved to ' + url.getCurrentUrl(), function() {

                HAS_NOT_URL(url);

                SET_URL(url, html);

                URL_HAS_CONTENT(url, html);

                DELETE_URL(url);
            });

        });

    });
});