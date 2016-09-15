/**
 * Created by antoine on 15/09/16.
 */
/**
 * Created by antoine on 15/09/16.
 */

var simpleCache = require('./../dist/simple-cache.min');
var weirdUrls = require('./helper/weirdUrls');

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('The redisStorage - weirdURLs', function() {


    var config = {
        type: 'redis',
        host: '127.0.0.1',
        port: 6379,
        socket_keepalive: true
    };

    var urlConfig = {
        cacheMaxAge: [],
        cacheAlways: [
            {
                regex: /.*/
            }
        ],
        cacheNever: [],
        default: 'never'
    };

    var redisCache = new simpleCache(config, urlConfig);

    weirdUrls.valid.forEach(function(weirdUrl) {
        var url = redisCache.url(weirdUrl);

        after(function() {
            url.removeUrl();
        });

        it('Should cache ' + weirdUrl, function() {
            return expect(url.cache('contents')).to.eventually.equal(true);
        });

    });

    weirdUrls.invalid.forEach(function(weirdUrl) {
        var url = redisCache.url(weirdUrl);

        after(function() {
            url.removeUrl();
        });

        it('Should cache ' + weirdUrl, function() {
            return expect(url.cache('contents')).to.eventually.equal(true);
        });

    });

});