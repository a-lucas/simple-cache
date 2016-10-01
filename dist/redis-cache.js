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
	var cacheEnginePromise_1 = __webpack_require__(1);
	var cacheEngineCB_1 = __webpack_require__(13);
	var instance_1 = __webpack_require__(14);
	var CacheRulesCreator_1 = __webpack_require__(17);
	module.exports.CacheEnginePromise = cacheEnginePromise_1.default;
	module.exports.CacheEngineCB = cacheEngineCB_1.default;
	module.exports.Instance = instance_1.default;
	module.exports.CacheRulesCreator = CacheRulesCreator_1.default;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var es6_promise_1 = __webpack_require__(2);
	var helpers_1 = __webpack_require__(3);
	var dbug = __webpack_require__(6);
	var cache_1 = __webpack_require__(7);
	var CacheEngine_1 = __webpack_require__(5);
	var instancePromise_1 = __webpack_require__(8);
	var debug = dbug('simple-url-cache');
	var CacheEnginePromise = (function (_super) {
	    __extends(CacheEnginePromise, _super);
	    function CacheEnginePromise(defaultDomain, instance) {
	        _super.call(this, defaultDomain, instance);
	        this.storageInstance = new instancePromise_1.default(instance);
	    }
	    CacheEnginePromise.prototype.clearDomain = function (domain) {
	        var _this = this;
	        if (typeof domain === 'undefined') {
	            domain = this.defaultDomain;
	        }
	        helpers_1.default.isStringDefined(domain);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.clearDomain(domain).then(function () {
	                resolve(true);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.clearInstance = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.clearCache().then(function () {
	                resolve(true);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.getStoredHostnames = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.getCachedDomains().then(function (domains) {
	                resolve(domains);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.getStoredURLs = function (domain) {
	        var _this = this;
	        if (typeof domain === 'undefined') {
	            domain = this.defaultDomain;
	        }
	        helpers_1.default.isStringDefined(domain);
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.storageInstance.getCachedURLs(domain).then(function (urls) {
	                resolve(urls);
	            }, function (err) {
	                reject(err);
	            });
	        });
	    };
	    CacheEnginePromise.prototype.url = function (url) {
	        var parsedURL = helpers_1.default.parseURL(url);
	        if (parsedURL.domain.length === 0) {
	            parsedURL.domain = this.defaultDomain;
	        }
	        return new cache_1.CachePromise(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
	    };
	    return CacheEnginePromise;
	}(CacheEngine_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEnginePromise;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("es6-promise");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var nodeurl = __webpack_require__(4);
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
	    Helpers.parseURL = function (url) {
	        Helpers.isStringDefined(url);
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
	            Helpers.invalidParameterError('invalid URL ', url);
	        }
	        return {
	            domain: domain,
	            relativeURL: relativeURL
	        };
	    };
	    Helpers.isNotUndefined = function () {
	        var input = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            input[_i - 0] = arguments[_i];
	        }
	        if (input.length = 0) {
	            Helpers.invalidParameterError('No parameters required', input);
	        }
	        for (var i in input) {
	            if (typeof input === 'undefined') {
	                Helpers.invalidParameterError('Undefined paraneter provided at index ', i);
	            }
	        }
	    };
	    Helpers.isArray = function (data) {
	        if ((data instanceof Array) === false) {
	            Helpers.invalidParameterError('This should be an array', data);
	        }
	    };
	    Helpers.isRegexRule = function (data) {
	        if ((data instanceof RegExp) === false) {
	            Helpers.invalidParameterError('This should be a Regexp', data);
	        }
	    };
	    Helpers.hasMaxAge = function (data) {
	        if (typeof data.maxAge !== 'number') {
	            Helpers.invalidParameterError('This rule misses a maxAge property', data);
	        }
	    };
	    Helpers.isBoolean = function (data) {
	        if (typeof data !== 'boolean') {
	            Helpers.invalidParameterError('This is not a boolean probably the force param missing', data);
	        }
	    };
	    Helpers.isOptionalBoolean = function (data) {
	        if (typeof data !== 'undefined' && typeof data !== 'boolean') {
	            Helpers.invalidParameterError('You provided an optional boolean but this is not a boolean', data);
	        }
	    };
	    Helpers.SameRegex = function (r1, r2) {
	        if (r1 instanceof RegExp && r2 instanceof RegExp) {
	            var props = ["global", "multiline", "ignoreCase", "source"];
	            for (var i = 0; i < props.length; i++) {
	                var prop = props[i];
	                if (r1[prop] !== r2[prop]) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        return false;
	    };
	    Helpers.validateCacheConfig = function (cacheRules) {
	        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            Helpers.isArray(cacheRules[type]);
	            cacheRules[type].forEach(function (rule) {
	                Helpers.isRegexRule(rule.regex);
	                if (type === 'maxAge') {
	                    Helpers.hasMaxAge(rule);
	                }
	            });
	        });
	    };
	    Helpers.JSONRegExpReplacer = function (key, value) {
	        if (value instanceof RegExp) {
	            return ("__REGEXP " + value.toString());
	        }
	        else {
	            return value;
	        }
	    };
	    Helpers.JSONRegExpReviver = function (key, value) {
	        if (value.toString().indexOf("__REGEXP ") == 0) {
	            var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
	            return new RegExp(m[1], m[2] || "");
	        }
	        else {
	            return value;
	        }
	    };
	    Helpers.getConfigKey = function () {
	        return 'url-cache:ruleconfig';
	    };
	    Helpers.validateRedisStorageConfig = function (data) {
	        return false;
	    };
	    Helpers.invalidParameterError = function (name, value) {
	        throw new TypeError('Invalid parameter: ' + name + '. Value received: ' + JSON.stringify(value));
	    };
	    Helpers.RedisError = function (description, msg) {
	        throw new Error('Redis: ' + description + '. Error received: ' + msg);
	    };
	    return Helpers;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Helpers;


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var CacheEngine = (function () {
	    function CacheEngine(defaultDomain, instanceDefinition) {
	        this.defaultDomain = defaultDomain;
	        this.instanceDefinition = instanceDefinition;
	        helpers_1.default.isNotUndefined(defaultDomain, instanceDefinition);
	        helpers_1.default.isStringDefined(defaultDomain);
	        if (typeof CacheEngine.instances[instanceDefinition.getInstanceName()] !== 'undefined') {
	            console.warn("Instance already exists: " + instanceDefinition.getInstanceName(), "RedisConfig And cacheRules are ignored");
	        }
	        else {
	            CacheEngine.instances[instanceDefinition.getInstanceName()] = instanceDefinition;
	        }
	        this.instanceName = instanceDefinition.getInstanceName();
	    }
	    CacheEngine.prototype.addUrl = function (url) {
	        CacheEngine.urls.push(url);
	    };
	    CacheEngine.publish = function () {
	        CacheEngine.urls.forEach(function (url) {
	            url.setCacheCategory();
	        });
	    };
	    Object.defineProperty(CacheEngine.prototype, "cacheRulesManager", {
	        get: function () {
	            return this.instanceDefinition.ruleEngine.manager;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CacheEngine.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    CacheEngine.instances = {};
	    CacheEngine.helpers = {
	        validateRedisStorageConfig: helpers_1.default.validateRedisStorageConfig,
	        validateCacheConfig: helpers_1.default.validateCacheConfig
	    };
	    CacheEngine.hashKey = 'url-cache:';
	    CacheEngine.urls = [];
	    return CacheEngine;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEngine;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(6)('simple-url-cache');
	var CacheCommon = (function () {
	    function CacheCommon(_domain, _storageInstance, _instanceName, _url) {
	        var _this = this;
	        this._domain = _domain;
	        this._instanceName = _instanceName;
	        this._url = _url;
	        this._category = '';
	        this._maxAge = 0;
	        this.getRegexTest = function (u) {
	            return u.regex.test(_this._url);
	        };
	        if (this.isRedisCB(_storageInstance)) {
	            this._storageType = 'callback';
	            this._storageInstanceCB = _storageInstance;
	        }
	        else {
	            this._storageType = 'promise';
	            this._storageInstancePromise = _storageInstance;
	        }
	        this.setCacheCategory();
	    }
	    CacheCommon.prototype.isRedisCB = function (storageInstance) {
	        return storageInstance.type === 'cb';
	    };
	    CacheCommon.prototype.check = function () {
	        this.setCacheCategory();
	        return this;
	    };
	    CacheCommon.prototype.getDomain = function () {
	        return this._domain;
	    };
	    CacheCommon.prototype.getCategory = function () {
	        return this._category;
	    };
	    CacheCommon.prototype.getInstanceName = function () {
	        return this._instanceName;
	    };
	    CacheCommon.prototype.getUrl = function () {
	        return this._url;
	    };
	    CacheCommon.prototype.getTTL = function () {
	        return this._maxAge;
	    };
	    CacheCommon.prototype.setCacheCategory = function () {
	        var i, config;
	        if (this._storageType === 'callback') {
	            config = this._storageInstanceCB.instance.ruleEngine.manager.cacheRules;
	        }
	        else {
	        }
	        debug('setCacheCategory Called with config ', config);
	        for (i in config.maxAge) {
	            if (this.getRegexTest(config.maxAge[i]) === true) {
	                this._category = 'maxAge';
	                this._maxAge = config.maxAge[i].maxAge;
	                return;
	            }
	        }
	        for (i in config.always) {
	            if (this.getRegexTest(config.always[i]) === true) {
	                this._category = 'always';
	                return;
	            }
	        }
	        for (i in config.never) {
	            if (this.getRegexTest(config.never[i]) === true) {
	                this._category = 'never';
	                return;
	            }
	        }
	        this._category = config.default;
	    };
	    ;
	    return CacheCommon;
	}());
	exports.CacheCommon = CacheCommon;
	var CachePromise = (function (_super) {
	    __extends(CachePromise, _super);
	    function CachePromise() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.delete = function () {
	            return _this._storageInstancePromise.delete(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.get = function () {
	            return _this._storageInstancePromise.get(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.has = function () {
	            return _this._storageInstancePromise.has(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.set = function (html, force) {
	            helpers_1.default.isStringDefined(html);
	            helpers_1.default.isOptionalBoolean(force);
	            if (typeof force === 'undefined') {
	                force = false;
	            }
	            return _this._storageInstancePromise.set(_this.getDomain(), _this.getUrl(), html, _this.getCategory(), _this.getTTL(), force);
	        };
	    }
	    return CachePromise;
	}(CacheCommon));
	exports.CachePromise = CachePromise;
	var CacheCB = (function (_super) {
	    __extends(CacheCB, _super);
	    function CacheCB() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.delete = function (cb) {
	            _this._storageInstanceCB.delete(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.get = function (cb) {
	            _this._storageInstanceCB.get(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.has = function (cb) {
	            _this._storageInstanceCB.has(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.set = function (html, force, cb) {
	            helpers_1.default.isStringDefined(html);
	            helpers_1.default.isBoolean(force);
	            _this._storageInstanceCB.set(_this.getDomain(), _this.getUrl(), html, _this.getCategory(), _this.getTTL(), force, cb);
	        };
	    }
	    return CacheCB;
	}(CacheCommon));
	exports.CacheCB = CacheCB;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var interfaces_1 = __webpack_require__(9);
	var debg = __webpack_require__(6);
	var es6_promise_1 = __webpack_require__(2);
	var instanceCB_1 = __webpack_require__(10);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStorageInstancePromise = (function (_super) {
	    __extends(RedisStorageInstancePromise, _super);
	    function RedisStorageInstancePromise(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this.type = 'promise';
	        this.hashKey = 'simple-url-cache:' + instance.getInstanceName();
	        this.cbInstance = new instanceCB_1.default(instance);
	    }
	    RedisStorageInstancePromise.prototype.getCacheRules = function () {
	        return this.instance.getCacheRuleEngine().getRules();
	    };
	    RedisStorageInstancePromise.prototype.clearCache = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.clearCache(function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.clearDomain = function (domain) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.clearDomain(domain, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.getCachedDomains = function () {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.getCachedDomains(function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.getCachedURLs = function (domain) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.getCachedURLs(domain, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.delete = function (domain, url, category, ttl) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.delete(domain, url, category, ttl, function (err, results) {
	                if (err) {
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.destroy = function () {
	        this.cbInstance.destroy();
	    };
	    RedisStorageInstancePromise.prototype.get = function (domain, url, category, ttl) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.get(domain, url, category, ttl, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.has = function (domain, url, category, ttl) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.has(domain, url, category, ttl, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    RedisStorageInstancePromise.prototype.set = function (domain, url, value, category, ttl, force) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.set(domain, url, value, category, ttl, force, function (err, results) {
	                if (err) {
	                    debug(err);
	                    reject(err);
	                }
	                else {
	                    resolve(results);
	                }
	            });
	        });
	    };
	    return RedisStorageInstancePromise;
	}(interfaces_1.StorageInstance));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStorageInstancePromise;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var StorageInstance = (function () {
	    function StorageInstance() {
	    }
	    return StorageInstance;
	}());
	exports.StorageInstance = StorageInstance;
	var StorageInstanceCB = (function () {
	    function StorageInstanceCB() {
	    }
	    return StorageInstanceCB;
	}());
	exports.StorageInstanceCB = StorageInstanceCB;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var interfaces_1 = __webpack_require__(9);
	var pool_1 = __webpack_require__(11);
	var debg = __webpack_require__(6);
	var CacheEngine_1 = __webpack_require__(5);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStorageInstanceCB = (function (_super) {
	    __extends(RedisStorageInstanceCB, _super);
	    function RedisStorageInstanceCB(instance) {
	        var _this = this;
	        _super.call(this);
	        this.instance = instance;
	        this.type = 'cb';
	        new pool_1.RedisPool(instance.getInstanceName(), instance.getRedisConfig(), function (err, conn) {
	            _this._conn = conn;
	        });
	        this.hashKey = CacheEngine_1.default.hashKey + this.instance.getInstanceName();
	    }
	    RedisStorageInstanceCB.prototype.clearCache = function (cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        var batch = client.batch();
	        client.hkeys(this.hashKey, function (err, domains) {
	            debug(err);
	            if (err)
	                return cb(err);
	            if (domains.length === 0) {
	                return cb(null, true);
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
	                                return cb(err);
	                            return cb(null, true);
	                        });
	                    }
	                });
	            });
	        });
	    };
	    RedisStorageInstanceCB.prototype.clearDomain = function (domain, cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        client.hdel(this.hashKey, domain, function (err) {
	            if (err)
	                return cb(err);
	            client.hkeys(_this.getDomainHashKey(domain), function (err, urls) {
	                if (urls.length === 0) {
	                    return cb(null, true);
	                }
	                var nb = 0;
	                urls.forEach(function (url) {
	                    _this.delete(domain, url, null, null, function (err) {
	                        if (err)
	                            return cb(err);
	                        nb++;
	                        if (nb === urls.length) {
	                            cb(null, true);
	                        }
	                    });
	                });
	            });
	        });
	    };
	    RedisStorageInstanceCB.prototype.getCachedDomains = function (cb) {
	        this._conn.getConnection().hkeys(this.hashKey, function (err, results) {
	            if (err)
	                return cb(err);
	            return cb(null, results);
	        });
	    };
	    RedisStorageInstanceCB.prototype.getCachedURLs = function (domain, cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        var cachedUrls = [];
	        client.hkeys(this.getDomainHashKey(domain), function (err, urls) {
	            if (err)
	                return cb(err);
	            if (urls.length === 0) {
	                return cb(null, cachedUrls);
	            }
	            var nb = 0;
	            urls.forEach(function (url) {
	                client.get(_this.getUrlKey(domain, url), function (err, data) {
	                    if (err)
	                        return cb(err);
	                    if (data !== null) {
	                        cachedUrls.push(url);
	                        nb++;
	                        if (nb === urls.length) {
	                            return cb(null, cachedUrls);
	                        }
	                    }
	                    else {
	                        client.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                            if (err)
	                                return cb(err);
	                            nb++;
	                            if (nb === urls.length) {
	                                return cb(null, cachedUrls);
	                            }
	                        });
	                    }
	                });
	            });
	        });
	    };
	    RedisStorageInstanceCB.prototype.getCacheRules = function () {
	        return this.instance.getCacheRuleEngine().getRules();
	    };
	    RedisStorageInstanceCB.prototype.delete = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        this.has(domain, url, category, ttl, function (err, isCached) {
	            if (!isCached) {
	                return cb('url is not cached');
	            }
	            else {
	                client.del(_this.getUrlKey(domain, url), function (err) {
	                    if (err) {
	                        return cb(err);
	                    }
	                    client.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                        if (err) {
	                            return cb(err);
	                        }
	                        return cb(null, true);
	                    });
	                });
	            }
	        });
	    };
	    RedisStorageInstanceCB.prototype.destroy = function () {
	        this._conn.kill();
	    };
	    RedisStorageInstanceCB.prototype.get = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        client.hget(this.getDomainHashKey(domain), url, function (err, content) {
	            if (err)
	                return cb(err);
	            if (content === null) {
	                return cb('url not cached');
	            }
	            client.get(_this.getUrlKey(domain, url), function (err, timestamp) {
	                if (err)
	                    return cb(err);
	                if (timestamp === null) {
	                    client.hdel(_this.getDomainHashKey(domain), _this.getUrlKey(domain, url), function (err) {
	                        if (err)
	                            return cb(err);
	                        return cb('url not cached - cleaning timestamp informations');
	                    });
	                }
	                else {
	                    return cb(null, content);
	                }
	            });
	        });
	    };
	    RedisStorageInstanceCB.prototype.has = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        client.get(this.getUrlKey(domain, url), function (err, data) {
	            if (err) {
	                debug('Error while querying is cached on redis: ', domain, url, err);
	                return cb(err);
	            }
	            else {
	                var isCached = data !== null;
	                if (!isCached) {
	                    client.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                        if (err)
	                            return cb(err);
	                        return cb(null, false);
	                    });
	                }
	                else {
	                    return cb(null, true);
	                }
	            }
	        });
	    };
	    RedisStorageInstanceCB.prototype.set = function (domain, url, value, category, ttl, force, cb) {
	        var _this = this;
	        if (force === true) {
	            var ttl_1 = 0;
	            this.store(domain, url, value, ttl_1, force, function (err, result) {
	                if (err)
	                    return cb(err);
	                return cb(null, result);
	            });
	        }
	        else if (category === 'never') {
	            return cb(null, false);
	        }
	        else {
	            this.has(domain, url, category, ttl, function (err, has) {
	                if (err)
	                    return cb(err);
	                if (has === true) {
	                    return cb(null, false);
	                }
	                else {
	                    _this.store(domain, url, value, ttl, force, function (err, result) {
	                        if (err)
	                            return cb(err);
	                        return cb(null, result);
	                    });
	                }
	            });
	        }
	    };
	    ;
	    RedisStorageInstanceCB.prototype.getDomainHashKey = function (domain) {
	        return this.hashKey + ':' + domain;
	    };
	    RedisStorageInstanceCB.prototype.store = function (domain, url, value, ttl, force, cb) {
	        var _this = this;
	        var client = this._conn.getConnection();
	        client.hset(this.hashKey, domain, domain, function (err) {
	            if (err) {
	                return cb(err);
	            }
	            else {
	                client.hset(_this.getDomainHashKey(domain), url, value, function (err, exists) {
	                    if (err) {
	                        return cb(err);
	                    }
	                    if (exists === 0) {
	                        return cb(null, true);
	                    }
	                    client.get(_this.getUrlKey(domain, url), function (err, result) {
	                        if (err) {
	                            return cb(err);
	                        }
	                        if (result === null) {
	                            client.set(_this.getUrlKey(domain, url), Date.now(), function (err) {
	                                if (err)
	                                    return cb(err);
	                                if (ttl > 0) {
	                                    client.expire(_this.getUrlKey(domain, url), ttl, function (err) {
	                                        if (err)
	                                            return cb(err);
	                                        return cb(null, true);
	                                    });
	                                }
	                                else {
	                                    return cb(null, true);
	                                }
	                            });
	                        }
	                        else if (force === true) {
	                            if (ttl > 0) {
	                                client.expire(_this.getUrlKey(domain, url), ttl, function (err) {
	                                    if (err)
	                                        return cb(err);
	                                    return cb(null, true);
	                                });
	                            }
	                            else {
	                                return cb(null, true);
	                            }
	                        }
	                    });
	                });
	            }
	        });
	    };
	    RedisStorageInstanceCB.prototype.getUrlKey = function (domain, url) {
	        return this.getDomainHashKey(domain) + ':' + url;
	    };
	    return RedisStorageInstanceCB;
	}(interfaces_1.StorageInstanceCB));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStorageInstanceCB;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redis = __webpack_require__(12);
	var dbug = __webpack_require__(6);
	var debug = dbug('simple-url-cache-REDIS');
	var RedisPool = (function () {
	    function RedisPool(instanceName, config, cb) {
	        this.instanceName = instanceName;
	        RedisPool.connect(instanceName, config, function (err) {
	            if (err)
	                cb(err);
	        });
	    }
	    RedisPool.connect = function (instanceName, config, cb) {
	        if (typeof RedisPool._pool[instanceName] === 'undefined' || RedisPool._pool[instanceName] === null || !RedisPool._isOnline[instanceName]) {
	            debug('This redis connection has never been instanciated before', instanceName);
	            RedisPool._isOnline[instanceName] = false;
	            RedisPool._pool[instanceName] = redis.createClient(config);
	            RedisPool._pool[instanceName].on('connect', function () {
	                RedisPool._isOnline[instanceName] = true;
	                debug('redis connected');
	                cb(null);
	            });
	            RedisPool._pool[instanceName].on('error', function (e) {
	                debug(e);
	                RedisPool._isOnline[instanceName] = false;
	                RedisPool._pool[instanceName] = null;
	                cb(e);
	            });
	            RedisPool._pool[instanceName].on('end', function () {
	                RedisPool._pool[instanceName] = null;
	                RedisPool._isOnline[instanceName] = false;
	                console.warn('Redis Connection closed for instance ' + instanceName);
	                debug('Connection closed', instanceName);
	            });
	            RedisPool._pool[instanceName].on('warning', function (msg) {
	                console.warn('Redis warning for instance ' + instanceName + '. MSG = ', msg);
	                debug('Warning called: ', instanceName, msg);
	            });
	        }
	        return RedisPool._pool[instanceName];
	    };
	    RedisPool.isOnline = function (instanceName) {
	        return RedisPool._isOnline[instanceName];
	    };
	    RedisPool.kill = function (instanceName) {
	        if (RedisPool._isOnline[instanceName] === true) {
	            RedisPool._pool[instanceName].end();
	        }
	    };
	    RedisPool.prototype.getConnection = function () {
	        return RedisPool._pool[this.instanceName];
	    };
	    RedisPool.prototype.isOnline = function () {
	        return RedisPool._isOnline[this.instanceName];
	    };
	    RedisPool.prototype.kill = function () {
	        if (RedisPool._isOnline[this.instanceName] === true) {
	            RedisPool._pool[this.instanceName].end();
	        }
	    };
	    RedisPool._pool = {};
	    RedisPool._isOnline = {};
	    return RedisPool;
	}());
	exports.RedisPool = RedisPool;


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("redis");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var instanceCB_1 = __webpack_require__(10);
	var helpers_1 = __webpack_require__(3);
	var dbug = __webpack_require__(6);
	var cache_1 = __webpack_require__(7);
	var CacheEngine_1 = __webpack_require__(5);
	var debug = dbug('simple-url-cache');
	var CacheEngineCB = (function (_super) {
	    __extends(CacheEngineCB, _super);
	    function CacheEngineCB(defaultDomain, instance) {
	        _super.call(this, defaultDomain, instance);
	        this.storageInstance = new instanceCB_1.default(instance);
	    }
	    CacheEngineCB.prototype.clearDomain = function (domain, cb) {
	        helpers_1.default.isStringDefined(domain);
	        this.storageInstance.clearDomain(domain, cb);
	    };
	    CacheEngineCB.prototype.clearInstance = function (cb) {
	        this.storageInstance.clearCache(cb);
	    };
	    CacheEngineCB.prototype.getStoredHostnames = function (cb) {
	        this.storageInstance.getCachedDomains(cb);
	    };
	    CacheEngineCB.prototype.getStoredURLs = function (domain, cb) {
	        helpers_1.default.isStringDefined(domain);
	        this.storageInstance.getCachedURLs(domain, cb);
	    };
	    CacheEngineCB.prototype.url = function (url) {
	        var parsedURL = helpers_1.default.parseURL(url);
	        if (parsedURL.domain.length === 0) {
	            parsedURL.domain = this.defaultDomain;
	        }
	        var urll = new cache_1.CacheCB(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
	        CacheEngine_1.default.urls.push(urll);
	        return urll;
	    };
	    return CacheEngineCB;
	}(CacheEngine_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEngineCB;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var CacheRuleEngine_1 = __webpack_require__(15);
	var pool_1 = __webpack_require__(11);
	var Instance = (function () {
	    function Instance(instanceName, redisConfig, cb) {
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        this._conn = new pool_1.RedisPool(instanceName, redisConfig, function (err) {
	            if (err)
	                throw new Error('Error connecting to REDIS');
	        });
	        this.ruleEngine = new CacheRuleEngine_1.default(instanceName, this._conn, false, function (err) {
	            if (err)
	                return cb(err);
	            cb();
	        });
	    }
	    Instance.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    Instance.prototype.getCacheRuleEngine = function () {
	        return this.ruleEngine;
	    };
	    Instance.prototype.getRedisConfig = function () {
	        return this.redisConfig;
	    };
	    return Instance;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Instance;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var CacheRuleManager_1 = __webpack_require__(16);
	var CacheEngine_1 = __webpack_require__(5);
	var debug = __webpack_require__(6)('simple-url-cache-RULE');
	var CacheRuleEngine = (function () {
	    function CacheRuleEngine(instanceName, _conn, scan, cb) {
	        var _this = this;
	        if (scan === void 0) { scan = true; }
	        this.instanceName = instanceName;
	        this._conn = _conn;
	        this.scan = scan;
	        this._conn.getConnection().hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ' -> ' + err);
	            if (data === null) {
	                cb('No CacheRule defined for this instance ' + _this.instanceName);
	            }
	            else {
	                var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	                _this.manager = new CacheRuleManager_1.default(parsedData, false);
	                cb(null);
	            }
	        });
	    }
	    CacheRuleEngine.prototype.getChannel = function () {
	        return helpers_1.default.getConfigKey() + this.instanceName;
	    };
	    CacheRuleEngine.prototype.publish = function () {
	        var _this = this;
	        CacheEngine_1.default.publish();
	        var stringified = JSON.stringify(this.manager.getRules(), helpers_1.default.JSONRegExpReplacer, 2);
	        this._conn.getConnection().hset(helpers_1.default.getConfigKey(), this.instanceName, stringified, function (err) {
	            if (err)
	                helpers_1.default.RedisError('while publishing config ' + stringified, err);
	            _this._conn.getConnection().publish(_this.getChannel(), 'PUSHED');
	        });
	    };
	    CacheRuleEngine.prototype.onPublish = function () {
	        var _this = this;
	        this._conn.getConnection().hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey());
	            if (data === null) {
	                throw new Error('Big mess');
	            }
	            var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	            _this.manager.updateRules(parsedData);
	        });
	    };
	    CacheRuleEngine.prototype.getRules = function () {
	        return this.manager.getRules();
	    };
	    return CacheRuleEngine;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheRuleEngine;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var CacheRuleManager = (function () {
	    function CacheRuleManager(cacheRules, scan) {
	        this.cacheRules = cacheRules;
	        this.scan = scan;
	    }
	    CacheRuleManager.prototype.updateRules = function (cacheRules) {
	        this.cacheRules = cacheRules;
	    };
	    CacheRuleManager.prototype.addMaxAgeRule = function (regex, maxAge) {
	        helpers_1.default.isNotUndefined(regex, maxAge);
	        helpers_1.default.isRegexRule(regex);
	        helpers_1.default.hasMaxAge({ regex: maxAge });
	        if (this.scan) {
	            var found = this.findRegex(regex);
	            if (found !== null) {
	                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
	            }
	        }
	        this.cacheRules.maxAge.push({ regex: regex, maxAge: maxAge });
	    };
	    CacheRuleManager.prototype.addNeverRule = function (regex) {
	        helpers_1.default.isNotUndefined(regex);
	        helpers_1.default.isRegexRule(regex);
	        if (this.scan) {
	            var found = this.findRegex(regex);
	            if (found !== null) {
	                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
	            }
	        }
	        this.cacheRules.never.push({ regex: regex });
	    };
	    CacheRuleManager.prototype.addAlwaysRule = function (regex) {
	        helpers_1.default.isNotUndefined(regex);
	        helpers_1.default.isRegexRule(regex);
	        if (this.scan) {
	            var found = this.findRegex(regex);
	            if (found !== null) {
	                throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
	            }
	        }
	        this.cacheRules.never.push({ regex: regex });
	    };
	    CacheRuleManager.prototype.mergeWith = function (rules) {
	    };
	    CacheRuleManager.prototype.setDefault = function (strategy) {
	        helpers_1.default.isStringIn(strategy, ['always', 'never']);
	        this.cacheRules.default = strategy;
	    };
	    CacheRuleManager.prototype.removeRule = function (regex) {
	        helpers_1.default.isNotUndefined(regex);
	        helpers_1.default.isRegexRule(regex);
	        var found = this.findRegex(regex);
	        if (found === null) {
	            throw new Error('trying to remove a regex that is not there already');
	        }
	        this.cacheRules[found.type].splice(found.index, 1);
	    };
	    CacheRuleManager.prototype.removeAllMaxAgeRules = function () {
	        this.cacheRules.maxAge = [];
	    };
	    CacheRuleManager.prototype.removeAllNeverRules = function () {
	        this.cacheRules.never = [];
	    };
	    CacheRuleManager.prototype.removeAllAlwaysRules = function () {
	        this.cacheRules.always = [];
	    };
	    CacheRuleManager.prototype.getRules = function () {
	        return this.cacheRules;
	    };
	    CacheRuleManager.prototype.findRegex = function (regex) {
	        var _this = this;
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            _this.cacheRules[type].forEach(function (rule, index) {
	                if (helpers_1.default.SameRegex(rule.regex, regex)) {
	                    return {
	                        type: type,
	                        index: index
	                    };
	                }
	            });
	        });
	        return null;
	    };
	    return CacheRuleManager;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheRuleManager;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var pool_1 = __webpack_require__(11);
	var helpers_1 = __webpack_require__(3);
	var CacheRulesCreator = (function () {
	    function CacheRulesCreator(instanceName, redisConfig) {
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        this._conn = new pool_1.RedisPool(instanceName, redisConfig, function (err) {
	            if (err)
	                throw new Error('Error connecting to REDIS');
	        });
	    }
	    CacheRulesCreator.prototype.importRules = function (rules, cb) {
	        var _this = this;
	        helpers_1.default.validateCacheConfig(rules);
	        this._conn.getConnection().hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey());
	            if (data !== null) {
	                cb('A CacheRule definition already exists for this instance');
	            }
	            else {
	                var stringified = JSON.stringify(rules, helpers_1.default.JSONRegExpReplacer, 2);
	                _this._conn.getConnection().hset(helpers_1.default.getConfigKey(), _this.instanceName, stringified, function (err) {
	                    if (err)
	                        cb(err);
	                });
	                cb(null);
	            }
	        });
	    };
	    return CacheRulesCreator;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheRulesCreator;


/***/ }
/******/ ]);
//# sourceMappingURL=redis-cache.js.map