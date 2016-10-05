"use strict";

var chai = require('chai');
var expect = chai.expect;
var Instance = require('./../../dist/redis-cache').Instance;
var CacheEngine = require('./../../dist/redis-cache').CacheEngineCB;
var cacheRules = require('./../helper/cacheRules');

var cacheEngine,
    instance,
    storageConfig = {
        type: 'redis',
        host: '127.0.0.1',
        port: 6379,
        socket_keepalive: true
    },
    domain = 'http://localhost:3000';


var fn = function fn(cacheEngine) {

    var tmp;

    before(function() {
        setTimeout(function() {
            tmp = {
                get: function() {
                    return 'test';
                }
            }
        }, 500);
    });

    describe('I am a test', function () {

        /*
        before(function(done){
            setTimeout(() => {
                data = {};
                this.data = {};
                done();
            }, 10);
        });
*/

        it('I am a working test', function () {
            expect(1).eql(1);
        });

        describe(tmp.get(), function() {

            it('I am a working test', function () {
                expect(1).eql(1);
            });
        });
        
        describe(cacheEngine.getInstanceName(), function() {
            console.log('inside describe');

            it('should work', function() {
                expect(1).eql(2);
            });
        });

    });

};

function fails(data) {
    it('data should be defined', function () {
        console.log('data = ', data);
        expect(this.data).to.not.be.undefined;
    });
}

function insideIT(that) {
    expect(that.data).to.not.be.undefined;
}

function failsAgain(data) {
    describe('It saves me lots of boilerplate' + data, function () {
        it('data should be defined', function () {
            expect(this.data).to.not.be.undefined;
        });
    });
};


console.log('startig instance');

instance = new Instance('INSTANCE', storageConfig, {
    on_existing_regex: 'replace',
    on_publish_update: true
}, function (err) {
    if (err) throw err;
    cacheEngine = new CacheEngine(domain, instance);
    console.log('instancated');
    fn(cacheEngine);
});


describe('Waiting for cacheEngine to launch', function() {
    it('is launching', function(done){
        var interval = setInterval(function() {
            if (typeof cacheEngine !== 'undefined') {
                clearInterval(interval);
                done();
            }
        }, 100);
    });

});

var data;
