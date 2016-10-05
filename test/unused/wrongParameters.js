
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var debug = require('debug')('simple-url-cache-test');
var expect = chai.expect;
var simpleUrlCache = require('./../../dist/simple-cache.min');


module.exports = function(storageType) {
    describe('It should fail on wrong parameters', function() {

        describe('CacheEngine', function() {

            var validCacheConfig = {
                default: 'never',
                maxAgeRules: [],
                alwaysRules: [],
                neverRules: []
            }
            
            it('constructor', function() {
                expect(new simpleUrlCache()).to.throw;
                expect(new simpleUrlCache(null, null, null, null)).to.throw;
                
                expect(new simpleUrlCache('domain', 'instance', {}, {})).to.throw;
                expect(new simpleUrlCache('domain', 'instance', {}, {})).to.throw;
                expect(new simpleUrlCache('aaa')).to.throw;
                expect(new simpleUrlCache('aaa')).to.throw;
                expect(new simpleUrlCache('aaa')).to.throw;
            });

            it('clearDomain', function() {

            });
        });

        describe('CacheStorage', function() {

            it('constructor', function() {

            });

            it('set', function() {

            });
        });
    });
}
