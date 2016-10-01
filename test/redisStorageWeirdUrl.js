
var simpleCache = require('./../dist/redis-cache').CacheEnginePromise;
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
        maxAge: [],
        always: [
            {
                regex: /.*/
            }
        ],
        never: [],
        default: 'never'
    };

    var redisCache = new simpleCache('http://localhost: 3456', 'INSTANCE', storageConfig, cacheRules);

    var html = "content";

    describe('Should pass', function() {
        weirdUrls.valid.forEach(function(weirdUrl) {
            var url = redisCache.url(weirdUrl);

            SET_URL(url, html);

            DELETE_URL(url, html);


        });
        weirdUrls.invalid.forEach(function(weirdUrl) {
            var url = redisCache.url(weirdUrl);

            SET_URL(url, html);

            DELETE_URL(url, html);

        });

    });
});