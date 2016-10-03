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
	var dbug = __webpack_require__(5);
	var cache_1 = __webpack_require__(6);
	var CacheEngine_1 = __webpack_require__(7);
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
	        var cache = new cache_1.CachePromise(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
	        this.addUrl(cache);
	        return cache;
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
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
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
	        if (this.hasPromise(_storageInstance)) {
	            this._storageInstancePromise = _storageInstance;
	            this._storageInstance = _storageInstance;
	        }
	        else {
	            this._storageInstanceCB = _storageInstance;
	            this._storageInstance = _storageInstance;
	        }
	        this.setCacheCategory();
	    }
	    CacheCommon.prototype.hasPromise = function (storageInstance) {
	        return storageInstance.getMethod() === 'promise';
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
	        var i;
	        var config = this._storageInstance.getCacheRules();
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
	var CacheEngine = (function () {
	    function CacheEngine(defaultDomain, instanceDefinition) {
	        this.defaultDomain = defaultDomain;
	        this.instanceDefinition = instanceDefinition;
	        helpers_1.default.isNotUndefined(defaultDomain, instanceDefinition);
	        helpers_1.default.isStringDefined(defaultDomain);
	        if (instanceDefinition.isInstanciated() === false) {
	            var errorMsg = 'This instance hasn\'t initiated correctly: ' + instanceDefinition.getInstanceName();
	            console.error(errorMsg);
	            throw new Error(errorMsg);
	        }
	        this.instanceName = instanceDefinition.getInstanceName();
	        if (instanceDefinition.getConfig().on_publish_update === true && typeof CacheEngine.urls[this.instanceName] === 'undefined') {
	            CacheEngine.urls[this.instanceName] = {};
	        }
	    }
	    CacheEngine.updateAllUrlCategory = function (instanceName) {
	        helpers_1.default.isStringDefined(instanceName);
	        if (typeof CacheEngine.urls[instanceName] !== 'undefined') {
	            var key = void 0;
	            for (key in CacheEngine.urls[instanceName]) {
	                CacheEngine.urls[instanceName][key].setCacheCategory();
	            }
	        }
	    };
	    CacheEngine.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    CacheEngine.prototype.addUrl = function (url) {
	        if (typeof CacheEngine.urls[this.instanceName] !== 'undefined' && typeof CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] === 'undefined') {
	            CacheEngine.urls[this.instanceName][this.buildURLIndex(url)] = url;
	        }
	    };
	    CacheEngine.prototype.buildURLIndex = function (url) {
	        return this.instanceName + '_' + url.getDomain() + '_' + url.getUrl();
	    };
	    CacheEngine.urls = {};
	    CacheEngine.helpers = {
	        validateRedisStorageConfig: helpers_1.default.validateRedisStorageConfig,
	        validateCacheConfig: helpers_1.default.validateCacheConfig
	    };
	    CacheEngine.hashKey = 'url-cache:';
	    return CacheEngine;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheEngine;


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
	var debg = __webpack_require__(5);
	var es6_promise_1 = __webpack_require__(2);
	var instanceCB_1 = __webpack_require__(10);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStorageInstancePromise = (function (_super) {
	    __extends(RedisStorageInstancePromise, _super);
	    function RedisStorageInstancePromise(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this.hashKey = 'simple-url-cache:' + instance.getInstanceName();
	        this.cbInstance = new instanceCB_1.default(instance);
	        this.method = 'promise';
	    }
	    RedisStorageInstancePromise.prototype.getCacheRules = function () {
	        return this.instance.getCacheRuleEngine().getManager().getRules();
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
	}(interfaces_1.StorageInstancePromise));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStorageInstancePromise;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var StorageInstance = (function () {
	    function StorageInstance() {
	    }
	    StorageInstance.prototype.getMethod = function () {
	        return this.method;
	    };
	    return StorageInstance;
	}());
	var StorageInstancePromise = (function (_super) {
	    __extends(StorageInstancePromise, _super);
	    function StorageInstancePromise() {
	        _super.apply(this, arguments);
	    }
	    return StorageInstancePromise;
	}(StorageInstance));
	exports.StorageInstancePromise = StorageInstancePromise;
	var StorageInstanceCB = (function (_super) {
	    __extends(StorageInstanceCB, _super);
	    function StorageInstanceCB() {
	        _super.apply(this, arguments);
	    }
	    return StorageInstanceCB;
	}(StorageInstance));
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
	var debg = __webpack_require__(5);
	var CacheEngine_1 = __webpack_require__(7);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStorageInstanceCB = (function (_super) {
	    __extends(RedisStorageInstanceCB, _super);
	    function RedisStorageInstanceCB(instance) {
	        var _this = this;
	        _super.call(this);
	        this.instance = instance;
	        new pool_1.RedisPool(instance.getInstanceName(), instance.getRedisConfig(), function (err, conn) {
	            _this._conn = conn;
	        });
	        this.hashKey = CacheEngine_1.default.hashKey + this.instance.getInstanceName();
	        this.method = 'callback';
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
	        return this.instance.getCacheRuleEngine().getManager().getRules();
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
	var dbug = __webpack_require__(5);
	var debug = dbug('simple-url-cache-REDIS');
	var RedisPool = (function () {
	    function RedisPool(instanceName, config, cb) {
	        this.instanceName = instanceName;
	        RedisPool.connect(instanceName, config, function (err) {
	            debug('redisPool.connect CB called');
	            if (err)
	                return cb(err);
	            return cb();
	        });
	    }
	    RedisPool.connect = function (instanceName, config, cb) {
	        if (typeof RedisPool._pool[instanceName] === 'undefined' ||
	            RedisPool._pool[instanceName] === null ||
	            RedisPool._status[instanceName] === 'undefined' ||
	            !RedisPool._status[instanceName].online) {
	            debug('This redis connection has never been instanciated before', instanceName);
	            RedisPool._status[instanceName] = {
	                online: false,
	                lastError: null,
	                warnings: []
	            };
	            RedisPool._pool[instanceName] = redis.createClient(config);
	            RedisPool._pool[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online = true;
	                debug('redis connected');
	                cb(null);
	            });
	            RedisPool._pool[instanceName].on('error', function (e) {
	                debug(e);
	                RedisPool._status[instanceName].lastError = e;
	                cb(e);
	            });
	            RedisPool._pool[instanceName].on('end', function () {
	                RedisPool._pool[instanceName] = null;
	                RedisPool._status[instanceName].online = false;
	                console.warn('Redis Connection closed for instance ' + instanceName);
	                debug('Connection closed', instanceName);
	            });
	            RedisPool._pool[instanceName].on('warning', function (msg) {
	                console.warn('Redis warning for instance ' + instanceName + '. MSG = ', msg);
	                RedisPool._status[instanceName].warnings.push(msg);
	                debug('Warning called: ', instanceName, msg);
	            });
	        }
	        else {
	            cb();
	        }
	    };
	    RedisPool.isOnline = function (instanceName) {
	        return RedisPool._status[instanceName].online;
	    };
	    RedisPool.kill = function (instanceName) {
	        if (RedisPool._status[instanceName].online === true) {
	            RedisPool._pool[instanceName].end();
	        }
	    };
	    RedisPool.prototype.getConnection = function () {
	        return RedisPool._pool[this.instanceName];
	    };
	    RedisPool.getConnection = function (instanceName) {
	        if (RedisPool._status[instanceName].online) {
	            return RedisPool._pool[instanceName];
	        }
	        debug('Redis Pool isn\'t online yet');
	    };
	    RedisPool.prototype.isOnline = function () {
	        return RedisPool._status[this.instanceName].online;
	    };
	    RedisPool.prototype.kill = function () {
	        if (RedisPool._status[this.instanceName].online === true) {
	            RedisPool._pool[this.instanceName].end();
	        }
	    };
	    RedisPool._pool = {};
	    RedisPool._status = {};
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
	var dbug = __webpack_require__(5);
	var cache_1 = __webpack_require__(6);
	var CacheEngine_1 = __webpack_require__(7);
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
	        var cache = new cache_1.CacheCB(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
	        this.addUrl(cache);
	        return cache;
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
	var helpers_1 = __webpack_require__(3);
	var pool_1 = __webpack_require__(11);
	var debug = __webpack_require__(5)('simple-url-cache');
	var Instance = (function () {
	    function Instance(instanceName, redisConfig, config, cb) {
	        var _this = this;
	        if (config === void 0) { config = { on_existing_regex: 'replace', on_publish_update: false }; }
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        this.config = config;
	        this.instanciated = false;
	        helpers_1.default.isNotUndefined(instanceName, redisConfig, config, cb);
	        new pool_1.RedisPool(instanceName, redisConfig, function (err) {
	            if (err)
	                cb('Error connecting to REDIS: ' + err);
	            _this.ruleEngine = new CacheRuleEngine_1.default(instanceName, _this.config, function (err) {
	                if (err)
	                    return cb(err);
	                _this.instanciated = true;
	                cb();
	            });
	        });
	    }
	    Instance.prototype.getConfig = function () {
	        return this.config;
	    };
	    Instance.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    Instance.prototype.getCacheRuleEngine = function () {
	        return this.ruleEngine;
	    };
	    Instance.prototype.getRedisConfig = function () {
	        return this.redisConfig;
	    };
	    Instance.prototype.isInstanciated = function () {
	        return this.instanciated;
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
	var pool_1 = __webpack_require__(11);
	var CacheRuleManager_1 = __webpack_require__(16);
	var CacheEngine_1 = __webpack_require__(7);
	var debug = __webpack_require__(5)('simple-url-cache-RULE');
	var CacheRuleEngine = (function () {
	    function CacheRuleEngine(instanceName, config, cb) {
	        var _this = this;
	        this.instanceName = instanceName;
	        this._conn = pool_1.RedisPool.getConnection(instanceName);
	        this._conn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ' -> ' + err);
	            if (data === null) {
	                cb('No CacheRule defined for this instance ' + _this.instanceName);
	            }
	            else {
	                var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	                _this.manager = new CacheRuleManager_1.default(parsedData, config.on_existing_regex);
	                cb(null);
	            }
	        });
	    }
	    CacheRuleEngine.prototype.getChannel = function () {
	        return helpers_1.default.getConfigKey() + this.instanceName;
	    };
	    CacheRuleEngine.prototype.publish = function () {
	        var _this = this;
	        CacheEngine_1.default.updateAllUrlCategory(this.instanceName);
	        var stringified = JSON.stringify(this.manager.getRules(), helpers_1.default.JSONRegExpReplacer, 2);
	        this._conn.hset(helpers_1.default.getConfigKey(), this.instanceName, stringified, function (err) {
	            if (err)
	                helpers_1.default.RedisError('while publishing config ' + stringified, err);
	            _this._conn.publish(_this.getChannel(), 'PUSHED');
	        });
	    };
	    CacheRuleEngine.prototype.onPublish = function () {
	        var _this = this;
	        this._conn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey());
	            if (data === null) {
	                throw new Error('Big mess');
	            }
	            var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	            _this.manager.updateRules(parsedData);
	        });
	    };
	    CacheRuleEngine.prototype.getManager = function () {
	        return this.manager;
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
	    function CacheRuleManager(cacheRules, option_on_existing_regex) {
	        this.cacheRules = cacheRules;
	        this.option_on_existing_regex = option_on_existing_regex;
	    }
	    CacheRuleManager.prototype.updateRules = function (cacheRules) {
	        this.cacheRules = cacheRules;
	    };
	    CacheRuleManager.prototype.addMaxAgeRule = function (regex, maxAge) {
	        helpers_1.default.isNotUndefined(regex, maxAge);
	        helpers_1.default.isRegexRule(regex);
	        helpers_1.default.hasMaxAge({ regex: maxAge });
	        var found = this.findRegex(regex);
	        this.add({ regex: regex, maxAge: maxAge }, 'maxAge', found);
	    };
	    CacheRuleManager.prototype.addNeverRule = function (regex) {
	        helpers_1.default.isNotUndefined(regex);
	        helpers_1.default.isRegexRule(regex);
	        var found = this.findRegex(regex);
	        this.add({ regex: regex }, 'never', found);
	    };
	    CacheRuleManager.prototype.addAlwaysRule = function (regex) {
	        helpers_1.default.isNotUndefined(regex);
	        helpers_1.default.isRegexRule(regex);
	        var found = this.findRegex(regex);
	        this.add({ regex: regex }, 'always', found);
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
	        if (found !== null) {
	            this.cacheRules[found.type].splice(found.index, 1);
	        }
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
	    CacheRuleManager.prototype.add = function (rule, where, found) {
	        if (found !== null) {
	            switch (this.option_on_existing_regex) {
	                case 'ignore':
	                    break;
	                case 'replace':
	                    this.cacheRules[found.type].splice(found.index, 1);
	                    this.cacheRules[where].push(rule);
	                    break;
	                case 'error':
	                    throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
	            }
	        }
	        else {
	            this.cacheRules[where].push(rule);
	        }
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