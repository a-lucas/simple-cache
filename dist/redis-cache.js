module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var es6_promise_1 = __webpack_require__(1);
	var instance_1 = __webpack_require__(2);
	var helpers_1 = __webpack_require__(4);
	var nodeurl = __webpack_require__(8);
	var dbug = __webpack_require__(7);
	var cache_1 = __webpack_require__(9);
	var debug = dbug('simple-url-cache');
	var CacheEngine = (function () {
	    function CacheEngine(defaultDomain, instanceName, storageConfig, cacheRules) {
	        this.defaultDomain = defaultDomain;
	        this.instanceName = instanceName;
	        this.storageConfig = storageConfig;
	        this.cacheRules = cacheRules;
	        helpers_1.default.isStringDefined(defaultDomain);
	        helpers_1.default.isStringDefined(instanceName);
	        helpers_1.default.validateCacheConfig(cacheRules);
	        if (helpers_1.default.isRedis(storageConfig)) {
	            this.type = 'file';
	        }
	        else {
	            throw new Error('Only Redis is supported');
	        }
	        if (typeof CacheEngine.pool[this.type] === 'undefined') {
	            CacheEngine.pool[this.type] = {};
	            CacheEngine.locks[this.type] = {};
	        }
	        if (typeof CacheEngine.pool[this.type][instanceName] === 'undefined') {
	            CacheEngine.pool[this.type][instanceName] = {};
	            CacheEngine.locks[this.type][instanceName] = false;
	        }
	    }
	    CacheEngine.prototype.clearDomain = function (domain) {
	        var _this = this;
	        if (typeof domain === 'undefined') {
	            domain = this.defaultDomain;
	        }
	        helpers_1.default.isStringDefined(domain);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var instance = _this.getInstance();
	            instance.clearDomain(domain).then(function () {
	                resolve(true);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEngine.prototype.clearInstance = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var instance = _this.getInstance();
	            instance.clearCache().then(function () {
	                resolve(true);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEngine.prototype.getStoredHostnames = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var instance = _this.getInstance();
	            instance.getCachedDomains().then(function (domains) {
	                resolve(domains);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEngine.prototype.getStoredURLs = function (domain) {
	        var _this = this;
	        if (typeof domain === 'undefined') {
	            domain = this.defaultDomain;
	        }
	        helpers_1.default.isStringDefined(domain);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var instance = _this.getInstance();
	            instance.getCachedURLs(domain).then(function (urls) {
	                resolve(urls);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEngine.prototype.url = function (url) {
	        helpers_1.default.isStringDefined(url);
	        var instance;
	        var parsedURL = nodeurl.parse(url);
	        var relativeURL = parsedURL.path;
	        if (!/\//.test(relativeURL)) {
	            relativeURL = '/' + relativeURL;
	        }
	        parsedURL.pathname = null;
	        parsedURL.path = null;
	        parsedURL.hash = null;
	        parsedURL.query = null;
	        parsedURL.search = null;
	        var domain = nodeurl.format(parsedURL);
	        if (domain === relativeURL) {
	            throw new Error('The url ' + url + ' is not valid');
	        }
	        if (domain.length === 0) {
	            debug('This url', url, ' has no domain, using defaultDomain = ', this.defaultDomain);
	            domain = this.defaultDomain;
	        }
	        else {
	            debug('This URL ', url, ' has a domain: ', domain);
	        }
	        instance = this.getInstance();
	        return new cache_1.default(domain, instance, relativeURL);
	    };
	    CacheEngine.prototype.getInstance = function () {
	        if (typeof CacheEngine.pool[this.type][this.instanceName] === 'undefined') {
	            CacheEngine.pool[this.type][this.instanceName] = {};
	            CacheEngine.locks[this.type][this.instanceName] = {};
	        }
	        if (helpers_1.default.isRedis(this.storageConfig)) {
	            CacheEngine.pool[this.type][this.instanceName] = new instance_1.default(this.instanceName, this.storageConfig, this.cacheRules);
	        }
	        return CacheEngine.pool[this.type][this.instanceName];
	    };
	    CacheEngine.pool = {};
	    CacheEngine.locks = {};
	    CacheEngine.helpers = {
	        validateRedisStorageConfig: helpers_1.default.validateRedisStorageConfig,
	        validateCacheConfig: helpers_1.default.validateCacheConfig
	    };
	    return CacheEngine;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEngine;
	module.exports = CacheEngine;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("es6-promise");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var interfaces_1 = __webpack_require__(3);
	var pool_1 = __webpack_require__(5);
	var debg = __webpack_require__(7);
	var debug = debg('simple-url-cache-REDIS');
	var es6_promise_1 = __webpack_require__(1);
	var RedisStorageInstance = (function (_super) {
	    __extends(RedisStorageInstance, _super);
	    function RedisStorageInstance(instanceName, config, rules) {
	        _super.call(this, instanceName, config);
	        this.config = config;
	        this.rules = rules;
	        this.validateStorageConfig();
	        this.hashKey = 'simple-url-cache:' + this.instanceName;
	    }
	    RedisStorageInstance.prototype.clearCache = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var client = _this._conn.getConnection();
	            var batch = client.batch();
	            client.hkeys(_this.hashKey, function (err, domains) {
	                debug(err);
	                if (err)
	                    reject(err);
	                debug('Domains found = ', domains);
	                if (domains.length === 0) {
	                    resolve(true);
	                }
	                var nb = 0;
	                domains.forEach(function (domain) {
	                    batch.del(_this.getDomainHashKey(domain));
	                    batch.hdel(_this.hashKey, domain);
	                    client.hkeys(_this.getDomainHashKey(domain), function (err, keys) {
	                        debug('keys = ', keys);
	                        keys.forEach(function (key) {
	                            batch.del(_this.getUrlKey(domain, key));
	                        });
	                        nb++;
	                        if (nb === domains.length) {
	                            batch.exec(function (err) {
	                                debug(err);
	                                if (err)
	                                    reject(err);
	                                resolve(true);
	                            });
	                        }
	                    });
	                });
	            });
	        });
	    };
	    RedisStorageInstance.prototype.clearDomain = function (domain) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var client = _this._conn.getConnection();
	            debug('Clear all cache called');
	            client.hdel(_this.hashKey, domain, function (err) {
	                if (err)
	                    reject(err);
	                client.hkeys(_this.getDomainHashKey(domain), function (err, urls) {
	                    debug('getting keys for ', _this.getDomainHashKey(domain), urls);
	                    var nb = 0;
	                    if (urls.length === 0) {
	                        resolve(true);
	                    }
	                    var promises = [];
	                    urls.forEach(function (url) {
	                        debug('Deleting key ', _this.getUrlKey(domain, url));
	                        promises.push(_this.delete(domain, url));
	                        es6_promise_1.Promise.all(promises).then(function () {
	                            resolve(true);
	                        }, function (err) {
	                            reject(err);
	                        });
	                    });
	                });
	            });
	        });
	    };
	    RedisStorageInstance.prototype.getCachedDomains = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            debug('getAllCachedDomains called');
	            _this._conn.getConnection().hkeys(_this.hashKey, function (err, results) {
	                if (err)
	                    reject(err);
	                debug('hkeys() ', _this.hashKey, results);
	                resolve(results);
	            });
	        });
	    };
	    RedisStorageInstance.prototype.getCacheRules = function () {
	        return this.rules;
	    };
	    RedisStorageInstance.prototype.getCachedURLs = function (domain) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var client = _this._conn.getConnection();
	            var cachedUrls = [];
	            var promises = [];
	            client.hkeys(_this.getDomainHashKey(domain), function (err, urls) {
	                if (err)
	                    reject(err);
	                if (urls.length === 0) {
	                    resolve(cachedUrls);
	                }
	                debug('found these urls in ', _this.getDomainHashKey(domain));
	                urls.forEach(function (url) {
	                    promises.push(client.get(_this.getUrlKey(domain, url), function (err, data) {
	                        if (err)
	                            reject(err);
	                        debug('for url, got content ', url, data);
	                        if (data !== null) {
	                            cachedUrls.push(url);
	                        }
	                        else {
	                            client.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                                if (err)
	                                    reject(err);
	                            });
	                        }
	                    }));
	                    es6_promise_1.Promise.all(promises).then(function () {
	                        resolve(cachedUrls);
	                    }, function (err) {
	                        reject(err);
	                    });
	                });
	            });
	        });
	    };
	    RedisStorageInstance.prototype.delete = function (domain, url) {
	        var _this = this;
	        debug('removing url cache: ', domain, url);
	        var client = this._conn.getConnection();
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.has(domain, url).then(function (isCached) {
	                if (!isCached) {
	                    reject();
	                }
	                else {
	                    client.del(_this.getUrlKey(domain, url), function (err) {
	                        if (err) {
	                            debug('REDIS ERROR, ', err);
	                            reject(err);
	                        }
	                        debug('DELETING HASH ', _this.getDomainHashKey(domain));
	                        client.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                            if (err) {
	                                debug('REDIS ERROR', err);
	                                reject(err);
	                            }
	                            resolve(true);
	                        });
	                    });
	                }
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    RedisStorageInstance.prototype.destroy = function () {
	        this._conn.kill();
	    };
	    RedisStorageInstance.prototype.get = function (domain, url) {
	        var _this = this;
	        debug('Retrieving url cache: ', domain, url);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var client = _this._conn.getConnection();
	            client.hget(_this.getDomainHashKey(domain), url, function (err, content) {
	                if (err)
	                    reject(err);
	                if (content === null) {
	                    reject(null);
	                }
	                client.get(_this.getUrlKey(domain, url), function (err, timestamp) {
	                    if (err)
	                        reject(err);
	                    if (timestamp === null) {
	                        client.hdel(_this.getDomainHashKey(domain), _this.getUrlKey(domain, url), function (err) {
	                            if (err)
	                                reject(err);
	                            reject(null);
	                        });
	                    }
	                    else {
	                        resolve(content);
	                    }
	                });
	            });
	        });
	    };
	    RedisStorageInstance.prototype.has = function (domain, url) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            var client = _this._conn.getConnection();
	            client.get(_this.getUrlKey(domain, url), function (err, data) {
	                if (err) {
	                    debug('Error while querying is cached on redis: ', domain, url, err);
	                    reject(err);
	                }
	                else {
	                    var isCached = data !== null;
	                    debug('HAS, key ', _this.getUrlKey(domain, url), 'is cached? ', isCached);
	                    if (!isCached) {
	                        client.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                            debug('hdel executed', _this.getDomainHashKey(domain), url);
	                            if (err) {
	                                reject(err);
	                            }
	                            resolve(false);
	                        });
	                    }
	                    else {
	                        resolve(true);
	                    }
	                }
	            });
	        });
	    };
	    RedisStorageInstance.prototype.set = function (domain, url, value, category, ttl, force) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            if (force === true) {
	                var ttl_1 = 0;
	                _this.store(domain, url, value, ttl_1, force).then(function (result) {
	                    resolve(result);
	                }, function (err) {
	                    reject(err);
	                });
	                return;
	            }
	            if (category === 'never') {
	                debug('this url should never been stored');
	                resolve(false);
	                return;
	            }
	            _this.has(domain, url).then(function (has) {
	                if (has === true) {
	                    debug('This url is already cached - not storing it: ', domain, url);
	                    resolve(false);
	                }
	                else {
	                    _this.store(domain, url, value, ttl, force).then(function (result) {
	                        resolve(result);
	                    }, function (err) {
	                        reject(err);
	                    });
	                }
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    RedisStorageInstance.prototype.getDomainHashKey = function (domain) {
	        return this.hashKey + ':' + domain;
	    };
	    RedisStorageInstance.prototype.store = function (domain, url, value, ttl, force) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            client.hset(_this.hashKey, domain, domain, function (err, result) {
	                if (err) {
	                    reject(err);
	                }
	                else {
	                    client.hset(_this.getDomainHashKey(domain), url, value, function (err, exists) {
	                        if (err) {
	                            reject(err);
	                        }
	                        if (exists === 0) {
	                            debug('Already set ');
	                            resolve(true);
	                            return;
	                        }
	                        else {
	                            client.get(_this.getUrlKey(domain, url), function (err, result) {
	                                if (err) {
	                                    reject(err);
	                                    return;
	                                }
	                                if (result === null) {
	                                    debug('REDIS timestamp not set');
	                                    client.set(_this.getUrlKey(domain, url), Date.now(), function (err) {
	                                        if (err) {
	                                            reject(err);
	                                            return;
	                                        }
	                                        if (ttl > 0) {
	                                            client.expire(_this.getUrlKey(domain, url), ttl, function (err) {
	                                                if (err)
	                                                    reject(err);
	                                                resolve(true);
	                                            });
	                                        }
	                                        else {
	                                            resolve(true);
	                                        }
	                                    });
	                                }
	                                else if (force === true) {
	                                    if (ttl > 0) {
	                                        client.expire(_this.getUrlKey(domain, url), ttl, function (err) {
	                                            if (err)
	                                                reject(err);
	                                            resolve(true);
	                                        });
	                                    }
	                                    else {
	                                        resolve(true);
	                                    }
	                                }
	                            });
	                        }
	                    });
	                }
	            });
	        });
	    };
	    RedisStorageInstance.prototype.validateStorageConfig = function () {
	        this._conn = new pool_1.RedisPool(this.config);
	    };
	    RedisStorageInstance.prototype.getUrlKey = function (domain, url) {
	        return this.getDomainHashKey(domain) + ':' + url;
	    };
	    return RedisStorageInstance;
	}(interfaces_1.StorageInstance));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStorageInstance;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(4);
	var StorageInstance = (function () {
	    function StorageInstance(instanceName, config) {
	        this.instanceName = instanceName;
	        if (helpers_1.default.isRedis(config)) {
	            this.storageType = 'redis';
	        }
	        else {
	            throw new Error('only redis is supported');
	        }
	    }
	    StorageInstance.prototype.getStorageType = function () {
	        return this.storageType;
	    };
	    StorageInstance.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    return StorageInstance;
	}());
	exports.StorageInstance = StorageInstance;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Helpers = (function () {
	    function Helpers() {
	    }
	    Helpers.isRedis = function (storageConfig) {
	        return typeof storageConfig.host !== 'undefined';
	    };
	    Helpers.isStringDefined = function (input) {
	        if (typeof input !== 'string' || input.length === 0) {
	            Helpers.invalidParameterError('this should be a non empty string', input);
	        }
	    };
	    Helpers.isStringIn = function (input, values) {
	        if (typeof input !== 'string') {
	            return false;
	        }
	        var valid = false;
	        values.forEach(function (value) {
	            if (value === input) {
	                valid = true;
	            }
	        });
	        if (!valid) {
	            Helpers.invalidParameterError('This string should contain only these values : ' + values.join(', '), input);
	        }
	    };
	    Helpers.isArray = function (data) {
	        if ((data instanceof Array) === false) {
	            Helpers.invalidParameterError('This should be an array', data);
	        }
	    };
	    Helpers.isRegexRule = function (data) {
	        if ((data.regex instanceof RegExp) === false) {
	            Helpers.invalidParameterError('This should be a Regexp', data);
	        }
	    };
	    Helpers.hasMaxAge = function (data) {
	        if (typeof data.maxAge !== 'number') {
	            Helpers.invalidParameterError('This rule misses a maxAge property', data);
	        }
	    };
	    Helpers.isOptionalBoolean = function (data) {
	        if (typeof data !== 'undefined' && typeof data !== 'boolean') {
	            Helpers.invalidParameterError('You provided an optional boolean but this is not a boolean', data);
	        }
	    };
	    Helpers.validateCacheConfig = function (cacheRules) {
	        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            Helpers.isArray(cacheRules[type]);
	            cacheRules[type].forEach(function (rule) {
	                Helpers.isRegexRule(rule);
	                if (type === 'maxAge') {
	                    Helpers.hasMaxAge(rule);
	                }
	            });
	        });
	    };
	    Helpers.validateRedisStorageConfig = function (data) {
	    };
	    Helpers.invalidParameterError = function (name, value) {
	        throw new TypeError('Invalid parameter: ' + name + '. Value received: ' + JSON.stringify(value));
	    };
	    return Helpers;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Helpers;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redis = __webpack_require__(6);
	var dbug = __webpack_require__(7);
	var debug = dbug('simple-url-cache-REDIS');
	var RedisPool = (function () {
	    function RedisPool(config) {
	        RedisPool.connect(config);
	        this.db = config.db;
	    }
	    RedisPool.connect = function (config) {
	        if (typeof RedisPool._pool[config.db] === 'undefined' || RedisPool._pool[config.db] === null || !RedisPool._isOnline[config.db]) {
	            debug('This redis connection has never been instanciated before', config.db);
	            RedisPool._isOnline[config.db] = false;
	            RedisPool._pool[config.db] = redis.createClient(config);
	            RedisPool._pool[config.db].on('connect', function () {
	                RedisPool._isOnline[config.db] = true;
	                debug('redis connected');
	            });
	            RedisPool._pool[config.db].on('error', function (e) {
	                debug(e);
	                RedisPool._isOnline[config.db] = false;
	                RedisPool._pool[config.db] = null;
	                throw new Error(e);
	            });
	            RedisPool._pool[config.db].on('end', function () {
	                RedisPool._pool[config.db] = null;
	                RedisPool._isOnline[config.db] = false;
	                debug('Connection closed');
	            });
	            RedisPool._pool[config.db].on('warning', function (msg) {
	                debug('Warning called: ', msg);
	            });
	        }
	        return RedisPool._pool[config.db];
	    };
	    RedisPool.isOnline = function (db) {
	        return RedisPool._isOnline[db];
	    };
	    RedisPool.kill = function (db) {
	        if (RedisPool._isOnline[db] === true) {
	            RedisPool._pool[db].end();
	        }
	    };
	    RedisPool.prototype.getConnection = function () {
	        return RedisPool._pool[this.db];
	    };
	    RedisPool.prototype.isOnline = function () {
	        return RedisPool._isOnline[this.db];
	    };
	    RedisPool.prototype.kill = function () {
	        if (RedisPool._isOnline[this.db] === true) {
	            RedisPool._pool[this.db].end();
	        }
	    };
	    RedisPool._pool = {};
	    RedisPool._isOnline = {};
	    return RedisPool;
	}());
	exports.RedisPool = RedisPool;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("redis");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(4);
	var Cache = (function () {
	    function Cache(_domain, _storageInstance, _url) {
	        var _this = this;
	        this._domain = _domain;
	        this._storageInstance = _storageInstance;
	        this._url = _url;
	        this._category = '';
	        this._maxAge = 0;
	        this.delete = function () {
	            return _this.getStorageInstance().delete(_this._domain, _this._url);
	        };
	        this.get = function () {
	            return _this.getStorageInstance().get(_this._domain, _this._url, _this._category, _this._maxAge);
	        };
	        this.has = function () {
	            return _this.getStorageInstance().has(_this._domain, _this._url, _this._category, _this._maxAge);
	        };
	        this.set = function (html, force) {
	            helpers_1.default.isStringDefined(html);
	            helpers_1.default.isOptionalBoolean(force);
	            if (typeof force === 'undefined') {
	                force = false;
	            }
	            return _this.getStorageInstance().set(_this._domain, _this._url, html, _this._category, _this._maxAge, force);
	        };
	        this.getRegexTest = function (u) {
	            return u.regex.test(_this._url);
	        };
	        this._config = this._storageInstance.getCacheRules();
	        this.setCacheCategory();
	    }
	    Cache.prototype.getDomain = function () {
	        return this._domain;
	    };
	    Cache.prototype.getCategory = function () {
	        return this._category;
	    };
	    Cache.prototype.getInstanceName = function () {
	        return this._storageInstance.getInstanceName();
	    };
	    Cache.prototype.getStorageType = function () {
	        return this._storageInstance.getStorageType();
	    };
	    Cache.prototype.getUrl = function () {
	        return this._url;
	    };
	    Cache.prototype.setCacheCategory = function () {
	        var i;
	        for (i in this._config.maxAge) {
	            if (this.getRegexTest(this._config.maxAge[i]) === true) {
	                this._category = 'maxAge';
	                this._maxAge = this._config.maxAge[i].maxAge;
	            }
	        }
	        for (i in this._config.always) {
	            if (this.getRegexTest(this._config.always[i]) === true) {
	                if (this._category !== 'always') {
	                    console.error('And overriding maxAge with always');
	                }
	                this._category = 'always';
	            }
	        }
	        for (i in this._config.never) {
	            if (this.getRegexTest(this._config.never[i]) === true) {
	                if (this._category !== 'always') {
	                    console.error('And overriding maxAge/Always with mever');
	                }
	                this._category = 'never';
	            }
	        }
	        if (this._category.length === 0) {
	            this._category = this._config.default;
	        }
	    };
	    ;
	    Cache.prototype.getStorageInstance = function () {
	        return this._storageInstance;
	    };
	    return Cache;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Cache;


/***/ }
/******/ ]);
//# sourceMappingURL=redis-cache.js.map