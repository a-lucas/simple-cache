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
	var CacheRulesCreator_1 = __webpack_require__(16);
	module.exports.RedisUrlCache = {
	    CacheEnginePromise: cacheEnginePromise_1.default,
	    CacheEngineCB: cacheEngineCB_1.default,
	    Instance: instance_1.default,
	    CacheRulesCreator: CacheRulesCreator_1.default
	};


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
	        var cache = new cache_1.UrlPromise(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
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
	var debug = __webpack_require__(5)('simple-url-cache');
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
	        debug('parseURL result: ', domain, relativeURL);
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
	                Helpers.invalidParameterError('Undefined parameter provided at index ', i);
	            }
	        }
	    };
	    Helpers.isArray = function (data) {
	        if ((data instanceof Array) === false) {
	            Helpers.invalidParameterError('This should be an array', data);
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
	    Helpers.isMaxAgeRegexRule = function (rule) {
	        Helpers.isConfigRegexRule(rule);
	        if (typeof rule.maxAge !== 'number') {
	            Helpers.invalidParameterError('This isnt a valid MaxAge RegexRule - one of the rule misses maxAge prop', rule);
	        }
	    };
	    Helpers.isConfigRegexRule = function (rule) {
	        if ((rule.regex instanceof RegExp) === false) {
	            Helpers.invalidParameterError('This isnt a valid RegexRule - the rule is not a regex', rule);
	        }
	        if (typeof rule.ignoreQuery !== 'boolean') {
	            Helpers.invalidParameterError('This isnt a valid RegexRule - the rule misses ignoreQuery prop', rule);
	        }
	    };
	    Helpers.validateCacheConfig = function (cacheRules) {
	        Helpers.isStringIn(cacheRules.default, ['always', 'never']);
	        Helpers.isNotUndefined(cacheRules.maxAge, cacheRules.always, cacheRules.never);
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            Helpers.isArray(cacheRules[type]);
	            for (var key in cacheRules[type]) {
	                if (typeof cacheRules[type][key].domain !== 'string' && (cacheRules[type][key].domain instanceof RegExp) === false) {
	                    Helpers.invalidParameterError('Domain must be either a regex or a string', cacheRules[type][key].domain);
	                }
	                Helpers.isArray(cacheRules[type][key].rules);
	                cacheRules[type][key].rules.forEach(function (rule) {
	                    if (type === 'maxAge') {
	                        Helpers.isMaxAgeRegexRule(rule);
	                    }
	                    else {
	                        Helpers.isConfigRegexRule(rule);
	                    }
	                });
	            }
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
	var UrlCommon = (function () {
	    function UrlCommon(_domain, _storageInstance, _instanceName, _url) {
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
	            this._storagePromise = _storageInstance;
	            this._storage = _storageInstance;
	        }
	        else {
	            this._storageCB = _storageInstance;
	            this._storage = _storageInstance;
	        }
	        this.setCacheCategory();
	    }
	    UrlCommon.prototype.hasPromise = function (storage) {
	        return storage.getMethod() === 'promise';
	    };
	    UrlCommon.prototype.getDomain = function () {
	        return this._domain;
	    };
	    UrlCommon.prototype.getCategory = function () {
	        return this._category;
	    };
	    UrlCommon.prototype.getInstanceName = function () {
	        return this._instanceName;
	    };
	    UrlCommon.prototype.getUrl = function () {
	        return this._url;
	    };
	    UrlCommon.prototype.getTTL = function () {
	        return this._maxAge;
	    };
	    UrlCommon.prototype.checkDomain = function (stored) {
	        if (typeof stored === 'string') {
	            return this._domain.indexOf(stored) !== -1;
	        }
	        else {
	            return stored.test(this._domain);
	        }
	    };
	    UrlCommon.prototype.setCacheCategory = function () {
	        var key, domain, i;
	        var config = this._storage.getCacheRules();
	        debug('config loaded: ', config);
	        for (key = 0; key < config.maxAge.length; key++) {
	            if (this.checkDomain(config.maxAge[key].domain)) {
	                for (i = 0; i < config.maxAge[key].rules.length; i++) {
	                    if (this.getRegexTest(config.maxAge[key].rules[i]) === true) {
	                        this._category = 'maxAge';
	                        this._maxAge = config.maxAge[key].rules[i].maxAge;
	                        return;
	                    }
	                }
	            }
	        }
	        for (key = 0; key < config.always.length; key++) {
	            if (this.checkDomain(config.always[key].domain)) {
	                for (i = 0; i < config.always[key].rules.length; i++) {
	                    if (this.getRegexTest(config.always[key].rules[i]) === true) {
	                        this._category = 'always';
	                        return;
	                    }
	                }
	            }
	        }
	        for (key = 0; key < config.never.length; key++) {
	            if (this.checkDomain(config.never[key].domain)) {
	                for (i = 0; i < config.never[key].rules.length; i++) {
	                    if (this.getRegexTest(config.never[key].rules[i]) === true) {
	                        this._category = 'never';
	                        return;
	                    }
	                }
	            }
	        }
	        this._category = config.default;
	    };
	    ;
	    return UrlCommon;
	}());
	exports.UrlCommon = UrlCommon;
	var UrlPromise = (function (_super) {
	    __extends(UrlPromise, _super);
	    function UrlPromise() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.delete = function () {
	            return _this._storagePromise.delete(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.get = function () {
	            return _this._storagePromise.get(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.has = function () {
	            return _this._storagePromise.has(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL());
	        };
	        this.set = function (content, extra, force) {
	            helpers_1.default.isStringDefined(content);
	            helpers_1.default.isOptionalBoolean(force);
	            if (typeof force === 'undefined') {
	                force = false;
	            }
	            return _this._storagePromise.set(_this.getDomain(), _this.getUrl(), content, extra, _this.getCategory(), _this.getTTL(), force);
	        };
	    }
	    return UrlPromise;
	}(UrlCommon));
	exports.UrlPromise = UrlPromise;
	var UrlCB = (function (_super) {
	    __extends(UrlCB, _super);
	    function UrlCB() {
	        var _this = this;
	        _super.apply(this, arguments);
	        this.delete = function (cb) {
	            _this._storageCB.delete(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.get = function (cb) {
	            _this._storageCB.get(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.has = function (cb) {
	            _this._storageCB.has(_this.getDomain(), _this.getUrl(), _this.getCategory(), _this.getTTL(), cb);
	        };
	        this.set = function (content, extra, force, cb) {
	            helpers_1.default.isStringDefined(content);
	            helpers_1.default.isBoolean(force);
	            _this._storageCB.set(_this.getDomain(), _this.getUrl(), content, extra, _this.getCategory(), _this.getTTL(), force, cb);
	        };
	    }
	    return UrlCB;
	}(UrlCommon));
	exports.UrlCB = UrlCB;


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
	var debg = __webpack_require__(5);
	var es6_promise_1 = __webpack_require__(2);
	var instanceCB_1 = __webpack_require__(9);
	var storage_1 = __webpack_require__(12);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStoragePromise = (function (_super) {
	    __extends(RedisStoragePromise, _super);
	    function RedisStoragePromise(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this.hashKey = 'simple-url-cache:' + instance.getInstanceName();
	        this.cbInstance = new instanceCB_1.default(instance);
	        this.method = 'promise';
	    }
	    RedisStoragePromise.prototype.getCacheRules = function () {
	        return this.instance.getManager().getRules();
	    };
	    RedisStoragePromise.prototype.clearCache = function () {
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
	    RedisStoragePromise.prototype.clearDomain = function (domain) {
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
	    RedisStoragePromise.prototype.getCachedDomains = function () {
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
	    RedisStoragePromise.prototype.getCachedURLs = function (domain) {
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
	    RedisStoragePromise.prototype.delete = function (domain, url, category, ttl) {
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
	    RedisStoragePromise.prototype.destroy = function () {
	        this.cbInstance.destroy();
	    };
	    RedisStoragePromise.prototype.get = function (domain, url, category, ttl) {
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
	    RedisStoragePromise.prototype.has = function (domain, url, category, ttl) {
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
	    RedisStoragePromise.prototype.set = function (domain, url, value, extra, category, ttl, force) {
	        var _this = this;
	        return new es6_promise_1.Promise(function (resolve, reject) {
	            _this.cbInstance.set(domain, url, value, extra, category, ttl, force, function (err, results) {
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
	    return RedisStoragePromise;
	}(storage_1.StoragePromise));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStoragePromise;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var pool_1 = __webpack_require__(10);
	var debg = __webpack_require__(5);
	var CacheEngine_1 = __webpack_require__(7);
	var storage_1 = __webpack_require__(12);
	var debug = debg('simple-url-cache-REDIS');
	var RedisStorageCB = (function (_super) {
	    __extends(RedisStorageCB, _super);
	    function RedisStorageCB(instance) {
	        _super.call(this);
	        this.instance = instance;
	        this._conn = pool_1.RedisPool.getConnection(instance.getInstanceName());
	        this.hashKey = CacheEngine_1.default.hashKey + this.instance.getInstanceName();
	        this.method = 'callback';
	    }
	    RedisStorageCB.prototype.clearCache = function (cb) {
	        var _this = this;
	        var batch = this._conn.batch();
	        this._conn.hkeys(this.hashKey, function (err, domains) {
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
	                _this._conn.hkeys(_this.getDomainHashKey(domain), function (err, keys) {
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
	    RedisStorageCB.prototype.clearDomain = function (domain, cb) {
	        var _this = this;
	        this._conn.hdel(this.hashKey, domain, function (err) {
	            if (err)
	                return cb(err);
	            _this._conn.hkeys(_this.getDomainHashKey(domain), function (err, urls) {
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
	    RedisStorageCB.prototype.getCachedDomains = function (cb) {
	        this._conn.hkeys(this.hashKey, function (err, results) {
	            if (err)
	                return cb(err);
	            return cb(null, results);
	        });
	    };
	    RedisStorageCB.prototype.getCachedURLs = function (domain, cb) {
	        var _this = this;
	        var cachedUrls = [];
	        this._conn.hkeys(this.getDomainHashKey(domain), function (err, urls) {
	            if (err)
	                return cb(err);
	            if (urls.length === 0) {
	                return cb(null, cachedUrls);
	            }
	            var nb = 0;
	            urls.forEach(function (url) {
	                _this._conn.get(_this.getUrlKey(domain, url), function (err, data) {
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
	                        _this._conn.hdel(_this.getDomainHashKey(domain), url, function (err) {
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
	    RedisStorageCB.prototype.getCacheRules = function () {
	        return this.instance.getManager().getRules();
	    };
	    RedisStorageCB.prototype.delete = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        this.has(domain, url, category, ttl, function (err, isCached) {
	            if (!isCached) {
	                return cb('url is not cached');
	            }
	            else {
	                _this._conn.del(_this.getUrlKey(domain, url), function (err) {
	                    if (err) {
	                        return cb(err);
	                    }
	                    _this._conn.hdel(_this.getDomainHashKey(domain), url, function (err) {
	                        if (err) {
	                            return cb(err);
	                        }
	                        return cb(null, true);
	                    });
	                });
	            }
	        });
	    };
	    RedisStorageCB.prototype.destroy = function () {
	        pool_1.RedisPool.kill(this.instance.getInstanceName());
	    };
	    RedisStorageCB.prototype.get = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        this._conn.hget(this.getDomainHashKey(domain), url, function (err, content) {
	            if (err)
	                return cb(err);
	            if (content === null) {
	                return cb('url not cached');
	            }
	            _this._conn.get(_this.getUrlKey(domain, url), function (err, data) {
	                if (err)
	                    return cb(err);
	                if (data === null) {
	                    _this._conn.hdel(_this.getDomainHashKey(domain), _this.getUrlKey(domain, url), function (err) {
	                        if (err)
	                            return cb(err);
	                        return cb('url not cached - cleaning timestamp informations');
	                    });
	                }
	                else {
	                    var deserializedContent = JSON.parse(data);
	                    return cb(null, { content: content, createdOn: deserializedContent.timestamp, extra: deserializedContent.extra });
	                }
	            });
	        });
	    };
	    RedisStorageCB.prototype.has = function (domain, url, category, ttl, cb) {
	        var _this = this;
	        this._conn.get(this.getUrlKey(domain, url), function (err, data) {
	            if (err) {
	                debug('Error while querying is cached on redis: ', domain, url, err);
	                return cb(err);
	            }
	            else {
	                var isCached = data !== null;
	                if (!isCached) {
	                    _this._conn.hdel(_this.getDomainHashKey(domain), url, function (err) {
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
	    RedisStorageCB.prototype.set = function (domain, url, value, extra, category, ttl, force, cb) {
	        var _this = this;
	        if (force === true) {
	            this.store(domain, url, value, extra, ttl, function (err, result) {
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
	                    _this.store(domain, url, value, extra, ttl, function (err, result) {
	                        if (err)
	                            return cb(err);
	                        return cb(null, result);
	                    });
	                }
	            });
	        }
	    };
	    ;
	    RedisStorageCB.prototype.getDomainHashKey = function (domain) {
	        return this.hashKey + ':' + domain;
	    };
	    RedisStorageCB.prototype.store = function (domain, url, value, extra, ttl, cb) {
	        var _this = this;
	        this._conn.hset(this.hashKey, domain, domain, function (err) {
	            if (err) {
	                return cb(err);
	            }
	            else {
	                _this._conn.hset(_this.getDomainHashKey(domain), url, value, function (err, exists) {
	                    if (err) {
	                        return cb(err);
	                    }
	                    _this._conn.set(_this.getUrlKey(domain, url), JSON.stringify({ timestamp: Date.now(), extra: extra }), function (err) {
	                        if (err)
	                            return cb(err);
	                        if (ttl > 0) {
	                            _this._conn.expire(_this.getUrlKey(domain, url), ttl, function (err) {
	                                if (err)
	                                    return cb(err);
	                                return cb(null, true);
	                            });
	                        }
	                        else {
	                            return cb(null, true);
	                        }
	                    });
	                });
	            }
	        });
	    };
	    RedisStorageCB.prototype.getUrlKey = function (domain, url) {
	        return this.getDomainHashKey(domain) + ':' + url;
	    };
	    return RedisStorageCB;
	}(storage_1.StorageCB));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = RedisStorageCB;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var redis = __webpack_require__(11);
	var dbug = __webpack_require__(5);
	var debug = dbug('simple-url-cache-REDIS');
	var RedisPool = (function () {
	    function RedisPool() {
	    }
	    RedisPool.connect = function (instanceName, config, cb) {
	        if (typeof RedisPool._pool[instanceName] === 'undefined' ||
	            RedisPool._pool[instanceName] === null ||
	            typeof RedisPool._sub[instanceName] === 'undefined' ||
	            RedisPool._sub[instanceName] === null) {
	            debug('This redis connection has never been instanciated before', instanceName);
	            RedisPool._status[instanceName] = {
	                online: {
	                    pool: false,
	                    sub: false
	                },
	                lastError: null,
	                warnings: []
	            };
	            RedisPool._pool[instanceName] = redis.createClient(config);
	            RedisPool._sub[instanceName] = redis.createClient(config);
	            var nb = 0;
	            var nbErrors = 0;
	            RedisPool._pool[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online.pool = true;
	                debug('pool redis connected');
	                nb++;
	                if (nb === 2) {
	                    debug('POOL CONNECTED 2 conns');
	                    cb(null);
	                }
	            });
	            RedisPool._sub[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online.sub = true;
	                debug('redis connected');
	                nb++;
	                if (nb === 2) {
	                    debug('POOL CONNECTED 2 conns');
	                    cb(null);
	                }
	            });
	            RedisPool._pool[instanceName].on('error', function (e) {
	                RedisPool._status[instanceName].lastError = e;
	                nbErrors++;
	                debug(nbErrors, e);
	                if (nbErrors === 1) {
	                    cb(e);
	                }
	            });
	            RedisPool._pool[instanceName].on('end', function () {
	                RedisPool._pool[instanceName] = null;
	                RedisPool._status[instanceName].online.pool = false;
	                RedisPool.kill(instanceName);
	                console.warn('Redis Connection closed for instance ' + instanceName);
	                debug('Connection closed', instanceName);
	            });
	            RedisPool._pool[instanceName].on('warning', function (msg) {
	                console.warn('Redis warning for instance ' + instanceName + '. MSG = ', msg);
	                RedisPool._status[instanceName].warnings.push(msg);
	                debug('Warning called: ', instanceName, msg);
	            });
	            RedisPool._sub[instanceName].on('error', function (e) {
	                RedisPool._status[instanceName].lastError = e;
	                nbErrors++;
	                debug(nbErrors, e);
	                if (nbErrors === 1) {
	                    cb(e);
	                }
	            });
	            RedisPool._sub[instanceName].on('end', function () {
	                RedisPool._sub[instanceName] = null;
	                RedisPool._status[instanceName].online.sub = false;
	                RedisPool.kill(instanceName);
	                console.warn('Redis Connection closed for instance ' + instanceName);
	                debug('Connection closed', instanceName);
	            });
	            RedisPool._sub[instanceName].on('warning', function (msg) {
	                console.warn('Redis warning for instance ' + instanceName + '. MSG = ', msg);
	                RedisPool._status[instanceName].warnings.push(msg);
	                debug('Warning called: ', instanceName, msg);
	            });
	        }
	        else {
	            cb(null);
	        }
	    };
	    RedisPool.kill = function (instanceName) {
	        if (RedisPool._status[instanceName].online.sub === true) {
	            RedisPool._sub[instanceName].end();
	        }
	        if (RedisPool._status[instanceName].online.pool === true) {
	            RedisPool._pool[instanceName].end();
	        }
	    };
	    RedisPool.getConnection = function (instanceName) {
	        if (RedisPool._status[instanceName].online) {
	            return RedisPool._pool[instanceName];
	        }
	        debug('Redis Pool isn\'t online yet');
	    };
	    RedisPool.getSubscriberConnection = function (instanceName) {
	        if (RedisPool._status[instanceName].online) {
	            return RedisPool._sub[instanceName];
	        }
	        debug('Redis Pool isn\'t online yet');
	    };
	    RedisPool._pool = {};
	    RedisPool._sub = {};
	    RedisPool._status = {};
	    return RedisPool;
	}());
	exports.RedisPool = RedisPool;


/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("redis");

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Storage = (function () {
	    function Storage() {
	    }
	    Storage.prototype.getMethod = function () {
	        return this.method;
	    };
	    return Storage;
	}());
	var StoragePromise = (function (_super) {
	    __extends(StoragePromise, _super);
	    function StoragePromise() {
	        _super.apply(this, arguments);
	    }
	    return StoragePromise;
	}(Storage));
	exports.StoragePromise = StoragePromise;
	var StorageCB = (function (_super) {
	    __extends(StorageCB, _super);
	    function StorageCB() {
	        _super.apply(this, arguments);
	    }
	    return StorageCB;
	}(Storage));
	exports.StorageCB = StorageCB;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var instanceCB_1 = __webpack_require__(9);
	var helpers_1 = __webpack_require__(3);
	var cache_1 = __webpack_require__(6);
	var CacheEngine_1 = __webpack_require__(7);
	var dbug = __webpack_require__(5);
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
	        var cache = new cache_1.UrlCB(parsedURL.domain, this.storageInstance, this.instanceName, parsedURL.relativeURL);
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
	var helpers_1 = __webpack_require__(3);
	var pool_1 = __webpack_require__(10);
	var CacheEngine_1 = __webpack_require__(7);
	var CacheRuleManager_1 = __webpack_require__(15);
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
	        this.config = Object.assign({ on_existing_regex: 'replace', on_publish_update: false }, config);
	        pool_1.RedisPool.connect(instanceName, redisConfig, function (err) {
	            if (err)
	                return cb('Error connecting to REDIS: ' + err);
	            var redisConn = pool_1.RedisPool.getConnection(instanceName);
	            redisConn.hget(helpers_1.default.getConfigKey(), _this.instanceName, function (err, data) {
	                if (err)
	                    return cb('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ' -> ' + err);
	                if (data === null) {
	                    return cb('No CacheRule defined for this instance ' + _this.instanceName);
	                }
	                else {
	                    _this.instanciated = true;
	                    var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	                    _this.manager = new CacheRuleManager_1.default(parsedData, config.on_existing_regex);
	                    _this.launchSubscriber();
	                    cb(null);
	                }
	            });
	        });
	    }
	    Instance.prototype.launchSubscriber = function () {
	        var _this = this;
	        var subscriber = pool_1.RedisPool.getSubscriberConnection(this.instanceName);
	        subscriber.subscribe(this.getChannel());
	        subscriber.on('message', function (channel, message) {
	            if (message === 'PUSHED') {
	                _this.onPublish();
	            }
	        });
	    };
	    Instance.prototype.getChannel = function () {
	        return helpers_1.default.getConfigKey() + this.instanceName;
	    };
	    Instance.prototype.publish = function () {
	        var _this = this;
	        CacheEngine_1.default.updateAllUrlCategory(this.instanceName);
	        var redisConn = pool_1.RedisPool.getConnection(this.instanceName);
	        var stringified = JSON.stringify(this.manager.getRules(), helpers_1.default.JSONRegExpReplacer, 2);
	        redisConn.hset(helpers_1.default.getConfigKey(), this.instanceName, stringified, function (err) {
	            if (err)
	                helpers_1.default.RedisError('while publishing config ' + stringified, err);
	            redisConn.publish(_this.getChannel(), 'PUSHED');
	        });
	    };
	    Instance.prototype.onPublish = function () {
	        var _this = this;
	        var redisConn = pool_1.RedisPool.getConnection(this.instanceName);
	        redisConn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                throw new Error('Redis error - retrieving ' + helpers_1.default.getConfigKey());
	            if (data === null) {
	                throw new Error('Big mess');
	            }
	            var parsedData = JSON.parse(data, helpers_1.default.JSONRegExpReviver);
	            _this.manager.updateRules(parsedData);
	        });
	    };
	    Instance.prototype.getManager = function () {
	        return this.manager;
	    };
	    Instance.prototype.getConfig = function () {
	        return this.config;
	    };
	    Instance.prototype.getInstanceName = function () {
	        return this.instanceName;
	    };
	    Instance.prototype.getRedisConfig = function () {
	        return this.redisConfig;
	    };
	    Instance.prototype.isInstanciated = function () {
	        return this.instanciated;
	    };
	    Instance.prototype.destroy = function () {
	        pool_1.RedisPool.kill(this.instanceName);
	        this.instanciated = false;
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
	var debug = __webpack_require__(5)('simple-url-cache');
	var CacheRuleManager = (function () {
	    function CacheRuleManager(cacheRules, on_existing_regex) {
	        this.cacheRules = cacheRules;
	        this.on_existing_regex = on_existing_regex;
	    }
	    CacheRuleManager.prototype.addMaxAgeRule = function (domain, regex, maxAge, ignoreQuery) {
	        helpers_1.default.isNotUndefined(domain, regex, maxAge);
	        var regexRule = { regex: regex, maxAge: maxAge, ignoreQuery: ignoreQuery ? ignoreQuery : false };
	        helpers_1.default.isMaxAgeRegexRule(regexRule);
	        var found = this.findRegex(domain, regexRule);
	        this.add(domain, regexRule, 'maxAge', found);
	    };
	    CacheRuleManager.prototype.addNeverRule = function (domain, regex, ignoreQuery) {
	        helpers_1.default.isNotUndefined(regex);
	        var regexRule = { regex: regex, ignoreQuery: ignoreQuery ? ignoreQuery : false };
	        helpers_1.default.isConfigRegexRule(regexRule);
	        var found = this.findRegex(domain, regexRule);
	        this.add(domain, regexRule, 'never', found);
	    };
	    CacheRuleManager.prototype.addAlwaysRule = function (domain, regex, ignoreQuery) {
	        helpers_1.default.isNotUndefined(regex);
	        var regexRule = { regex: regex, ignoreQuery: ignoreQuery ? ignoreQuery : false };
	        helpers_1.default.isConfigRegexRule(regexRule);
	        var found = this.findRegex(domain, regexRule);
	        this.add(domain, regexRule, 'always', found);
	    };
	    CacheRuleManager.prototype.getRules = function () {
	        return this.cacheRules;
	    };
	    CacheRuleManager.prototype.setDefault = function (strategy) {
	        helpers_1.default.isStringIn(strategy, ['always', 'never']);
	        this.cacheRules.default = strategy;
	    };
	    CacheRuleManager.prototype.removeRule = function (domain, rule) {
	        helpers_1.default.isNotUndefined(rule);
	        helpers_1.default.isConfigRegexRule(rule);
	        var found = this.findRegex(domain, rule);
	        if (found !== null) {
	            this.cacheRules[found.type][found.index].rules.splice(found.subIndex, 1);
	            if (this.cacheRules[found.type][found.index].rules.length === 0) {
	                this.cacheRules[found.type].splice(found.index, 1);
	            }
	        }
	    };
	    CacheRuleManager.prototype.removeAllMaxAgeRules = function () {
	        this.cacheRules.maxAge = [];
	    };
	    CacheRuleManager.prototype.removeAllNeverRules = function () {
	        this.cacheRules.never = [];
	    };
	    CacheRuleManager.prototype.removeAllAlwaysRules = function (domain) {
	        this.cacheRules.always = [];
	    };
	    CacheRuleManager.prototype.updateRules = function (cacheRules) {
	        this.cacheRules = cacheRules;
	    };
	    CacheRuleManager.prototype.checkDomainMatch = function (stored, input) {
	        if (typeof stored === 'string' && typeof input === 'string') {
	            return stored === input;
	        }
	        else if (stored instanceof RegExp && input instanceof RegExp) {
	            return helpers_1.default.SameRegex(stored, input);
	        }
	        else {
	            return false;
	        }
	    };
	    CacheRuleManager.prototype.findRegex = function (domain, rule) {
	        var _this = this;
	        var info = null, index, subIndex;
	        ['always', 'never', 'maxAge'].forEach(function (type) {
	            for (index = 0; index < _this.cacheRules[type].length; index++) {
	                if (_this.checkDomainMatch(_this.cacheRules[type][index].domain, domain)) {
	                    for (subIndex = 0; subIndex < _this.cacheRules[type][index].rules.length; subIndex++) {
	                        if (helpers_1.default.SameRegex(rule.regex, _this.cacheRules[type][index].rules[subIndex].regex)) {
	                            info = {
	                                type: type,
	                                index: index,
	                                subIndex: subIndex
	                            };
	                            break;
	                        }
	                    }
	                }
	            }
	        });
	        return info;
	    };
	    CacheRuleManager.prototype.add = function (domain, rule, where, found) {
	        debug('adding rule ', domain, rule, where, found);
	        debug('before: ', this.cacheRules);
	        if (found !== null) {
	            switch (this.on_existing_regex) {
	                case 'ignore':
	                    return;
	                case 'replace':
	                    debug('replacing: ', this.cacheRules[found.type][found.index].rules, found.subIndex);
	                    this.cacheRules[found.type][found.index].rules.splice(found.subIndex, 1);
	                    break;
	                case 'error':
	                    throw new Error('Adding a maxAge regex that is already defined here: ' + JSON.parse(found));
	            }
	        }
	        if (found !== null && found.type === where) {
	            this.cacheRules[where][found.index].rules.push(rule);
	        }
	        else {
	            var index2update = void 0, index = void 0;
	            for (index = 0; index < this.cacheRules[where].length; index++) {
	                if (this.checkDomainMatch(this.cacheRules[where][index].domain, domain)) {
	                    index2update = index;
	                }
	            }
	            if (typeof index2update === 'number') {
	                debug('A domain already exists, so pusing rules at index ', index2update, this.cacheRules[where][index2update]);
	                this.cacheRules[where][index2update].rules.push(rule);
	            }
	            else {
	                this.cacheRules[where].push({
	                    domain: domain,
	                    rules: [rule]
	                });
	            }
	        }
	        return;
	    };
	    return CacheRuleManager;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheRuleManager;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var pool_1 = __webpack_require__(10);
	var helpers_1 = __webpack_require__(3);
	var debug = __webpack_require__(5)('simple-url-cache');
	var CacheRulesCreator = (function () {
	    function CacheRulesCreator(instanceName, redisConfig, cb) {
	        var _this = this;
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        helpers_1.default.isNotUndefined(instanceName, redisConfig, cb);
	        debug('connecting to redis');
	        pool_1.RedisPool.connect(instanceName, redisConfig, function (err) {
	            if (err)
	                return cb('Error connecting to REDIS');
	            _this._conn = pool_1.RedisPool.getConnection(instanceName);
	            cb(null, _this);
	        });
	    }
	    CacheRulesCreator.prototype.importRules = function (rules, overwrite, cb) {
	        var _this = this;
	        helpers_1.default.isNotUndefined(rules, cb);
	        helpers_1.default.validateCacheConfig(rules);
	        this._conn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                return cb('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ': ' + err);
	            if (data !== null && !overwrite) {
	                return cb('A CacheRule definition already exists for this instance');
	            }
	            var stringified = JSON.stringify(rules, helpers_1.default.JSONRegExpReplacer, 2);
	            _this._conn.hset(helpers_1.default.getConfigKey(), _this.instanceName, stringified, function (err) {
	                if (err)
	                    cb(err);
	                cb(null);
	            });
	        });
	    };
	    return CacheRulesCreator;
	}());
	var CacheCreator = (function () {
	    function CacheCreator() {
	    }
	    CacheCreator.createCache = function (instanceName, force, redisConfig, rules, cb) {
	        helpers_1.default.isNotUndefined(instanceName, force, redisConfig, rules, cb);
	        new CacheRulesCreator(instanceName, redisConfig, function (err, creator) {
	            if (err) {
	                return cb(err);
	            }
	            creator.importRules(rules, force, function (err) {
	                if (err) {
	                    return cb(err);
	                }
	                cb(null);
	            });
	        });
	    };
	    return CacheCreator;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CacheCreator;


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTBhOTlmYWJjYWRkZjk0ZTU3NDMiLCJ3ZWJwYWNrOi8vLy4vdHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVQcm9taXNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImVzNi1wcm9taXNlXCIiLCJ3ZWJwYWNrOi8vLy4vdHMvaGVscGVycy50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkZWJ1Z1wiIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL2NhY2hlLnRzIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL0NhY2hlRW5naW5lLnRzIiwid2VicGFjazovLy8uL3RzL3JlZGlzL2luc3RhbmNlUHJvbWlzZS50cyIsIndlYnBhY2s6Ly8vLi90cy9yZWRpcy9pbnN0YW5jZUNCLnRzIiwid2VicGFjazovLy8uL3RzL3JlZGlzL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVkaXNcIiIsIndlYnBhY2s6Ly8vLi90cy9hYnN0cmFjdC9zdG9yYWdlLnRzIiwid2VicGFjazovLy8uL3RzL2NhY2hlRW5naW5lL2NhY2hlRW5naW5lQ0IudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvaW5zdGFuY2UudHMiLCJ3ZWJwYWNrOi8vLy4vdHMvcnVsZXMvQ2FjaGVSdWxlTWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi90cy9ydWxlcy9DYWNoZVJ1bGVzQ3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsK0NBQThDLGNBQWM7QUFDNUQ7Ozs7Ozs7QUMvRUEseUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0IsdUJBQXVCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RDs7Ozs7OztBQ3BLQSxpQzs7Ozs7O0FDQUEsbUM7Ozs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsNEJBQTRCO0FBQ2pEO0FBQ0EsNEJBQTJCLHFDQUFxQztBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCLDRCQUE0QjtBQUNqRDtBQUNBLDRCQUEyQixxQ0FBcUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0EsNEJBQTJCLG9DQUFvQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEOzs7Ozs7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQSxrQkFBaUI7QUFDakIsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQixrQkFBaUI7QUFDakIsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0Esa0JBQWlCO0FBQ2pCLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQixrQkFBaUI7QUFDakI7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxzQ0FBcUMsK0ZBQStGO0FBQ3BJO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBa0Ysc0NBQXNDO0FBQ3hIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXFCO0FBQ3JCLGtCQUFpQjtBQUNqQjtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNEOzs7Ozs7O0FDakhBLG1DOzs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLHNCQUFzQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQztBQUNELCtDQUE4QyxjQUFjO0FBQzVEOzs7Ozs7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFnQyxXQUFXLDBEQUEwRDtBQUNyRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXFDLHlEQUF5RDtBQUM5RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RDs7Ozs7OztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTJCLHVDQUF1QztBQUNsRTtBQUNBLHVDQUFzQyx1REFBdUQ7QUFDN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUEyQix1Q0FBdUM7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDO0FBQ0QsK0NBQThDLGNBQWM7QUFDNUQ7Ozs7Ozs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2IsVUFBUztBQUNUO0FBQ0E7QUFDQSxFQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYixVQUFTO0FBQ1Q7QUFDQTtBQUNBLEVBQUM7QUFDRCwrQ0FBOEMsY0FBYztBQUM1RCIsImZpbGUiOiJkaXN0L3JlZGlzLWNhY2hlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBhMGE5OWZhYmNhZGRmOTRlNTc0M1xuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIGNhY2hlRW5naW5lUHJvbWlzZV8xID0gcmVxdWlyZSgnLi9jYWNoZUVuZ2luZS9jYWNoZUVuZ2luZVByb21pc2UnKTtcbnZhciBjYWNoZUVuZ2luZUNCXzEgPSByZXF1aXJlKCcuL2NhY2hlRW5naW5lL2NhY2hlRW5naW5lQ0InKTtcbnZhciBpbnN0YW5jZV8xID0gcmVxdWlyZSgnLi9pbnN0YW5jZScpO1xudmFyIENhY2hlUnVsZXNDcmVhdG9yXzEgPSByZXF1aXJlKCcuL3J1bGVzL0NhY2hlUnVsZXNDcmVhdG9yJyk7XG5tb2R1bGUuZXhwb3J0cy5SZWRpc1VybENhY2hlID0ge1xuICAgIENhY2hlRW5naW5lUHJvbWlzZTogY2FjaGVFbmdpbmVQcm9taXNlXzEuZGVmYXVsdCxcbiAgICBDYWNoZUVuZ2luZUNCOiBjYWNoZUVuZ2luZUNCXzEuZGVmYXVsdCxcbiAgICBJbnN0YW5jZTogaW5zdGFuY2VfMS5kZWZhdWx0LFxuICAgIENhY2hlUnVsZXNDcmVhdG9yOiBDYWNoZVJ1bGVzQ3JlYXRvcl8xLmRlZmF1bHRcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvaW5kZXgudHNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGVzNl9wcm9taXNlXzEgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpO1xudmFyIGhlbHBlcnNfMSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKTtcbnZhciBkYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIENhY2hlRW5naW5lXzEgPSByZXF1aXJlKFwiLi9DYWNoZUVuZ2luZVwiKTtcbnZhciBpbnN0YW5jZVByb21pc2VfMSA9IHJlcXVpcmUoXCIuLi9yZWRpcy9pbnN0YW5jZVByb21pc2VcIik7XG52YXIgZGVidWcgPSBkYnVnKCdzaW1wbGUtdXJsLWNhY2hlJyk7XG52YXIgQ2FjaGVFbmdpbmVQcm9taXNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ2FjaGVFbmdpbmVQcm9taXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIENhY2hlRW5naW5lUHJvbWlzZShkZWZhdWx0RG9tYWluLCBpbnN0YW5jZSkge1xuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBkZWZhdWx0RG9tYWluLCBpbnN0YW5jZSk7XG4gICAgICAgIHRoaXMuc3RvcmFnZUluc3RhbmNlID0gbmV3IGluc3RhbmNlUHJvbWlzZV8xLmRlZmF1bHQoaW5zdGFuY2UpO1xuICAgIH1cbiAgICBDYWNoZUVuZ2luZVByb21pc2UucHJvdG90eXBlLmNsZWFyRG9tYWluID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodHlwZW9mIGRvbWFpbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGRvbWFpbiA9IHRoaXMuZGVmYXVsdERvbWFpbjtcbiAgICAgICAgfVxuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoZG9tYWluKTtcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuc3RvcmFnZUluc3RhbmNlLmNsZWFyRG9tYWluKGRvbWFpbikudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lUHJvbWlzZS5wcm90b3R5cGUuY2xlYXJJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuc3RvcmFnZUluc3RhbmNlLmNsZWFyQ2FjaGUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVQcm9taXNlLnByb3RvdHlwZS5nZXRTdG9yZWRIb3N0bmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3JhZ2VJbnN0YW5jZS5nZXRDYWNoZWREb21haW5zKCkudGhlbihmdW5jdGlvbiAoZG9tYWlucykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9tYWlucyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZVByb21pc2UucHJvdG90eXBlLmdldFN0b3JlZFVSTHMgPSBmdW5jdGlvbiAoZG9tYWluKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlb2YgZG9tYWluID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZG9tYWluID0gdGhpcy5kZWZhdWx0RG9tYWluO1xuICAgICAgICB9XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChkb21haW4pO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5zdG9yYWdlSW5zdGFuY2UuZ2V0Q2FjaGVkVVJMcyhkb21haW4pLnRoZW4oZnVuY3Rpb24gKHVybHMpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVybHMpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmVQcm9taXNlLnByb3RvdHlwZS51cmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHZhciBwYXJzZWRVUkwgPSBoZWxwZXJzXzEuZGVmYXVsdC5wYXJzZVVSTCh1cmwpO1xuICAgICAgICBpZiAocGFyc2VkVVJMLmRvbWFpbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHBhcnNlZFVSTC5kb21haW4gPSB0aGlzLmRlZmF1bHREb21haW47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNhY2hlID0gbmV3IGNhY2hlXzEuVXJsUHJvbWlzZShwYXJzZWRVUkwuZG9tYWluLCB0aGlzLnN0b3JhZ2VJbnN0YW5jZSwgdGhpcy5pbnN0YW5jZU5hbWUsIHBhcnNlZFVSTC5yZWxhdGl2ZVVSTCk7XG4gICAgICAgIHRoaXMuYWRkVXJsKGNhY2hlKTtcbiAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlRW5naW5lUHJvbWlzZTtcbn0oQ2FjaGVFbmdpbmVfMS5kZWZhdWx0KSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYWNoZUVuZ2luZVByb21pc2U7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVQcm9taXNlLnRzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXM2LXByb21pc2VcIik7XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCBcImVzNi1wcm9taXNlXCJcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBub2RldXJsID0gcmVxdWlyZSgndXJsJyk7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzaW1wbGUtdXJsLWNhY2hlJyk7XG52YXIgSGVscGVycyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSGVscGVycygpIHtcbiAgICB9XG4gICAgSGVscGVycy5pc1JlZGlzID0gZnVuY3Rpb24gKHN0b3JhZ2VDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBzdG9yYWdlQ29uZmlnLmhvc3QgIT09ICd1bmRlZmluZWQnO1xuICAgIH07XG4gICAgSGVscGVycy5pc1N0cmluZ0RlZmluZWQgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycgfHwgaW5wdXQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcigndGhpcyBzaG91bGQgYmUgYSBub24gZW1wdHkgc3RyaW5nJywgaW5wdXQpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzU3RyaW5nSW4gPSBmdW5jdGlvbiAoaW5wdXQsIHZhbHVlcykge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBzdHJpbmcgc2hvdWxkIGNvbnRhaW4gb25seSB0aGVzZSB2YWx1ZXMgOiAnICsgdmFsdWVzLmpvaW4oJywgJyksIGlucHV0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5wYXJzZVVSTCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgSGVscGVycy5pc1N0cmluZ0RlZmluZWQodXJsKTtcbiAgICAgICAgdmFyIHBhcnNlZFVSTCA9IG5vZGV1cmwucGFyc2UodXJsKTtcbiAgICAgICAgdmFyIHJlbGF0aXZlVVJMID0gcGFyc2VkVVJMLnBhdGg7XG4gICAgICAgIGlmICghL1xcLy8udGVzdChyZWxhdGl2ZVVSTCkpIHtcbiAgICAgICAgICAgIHJlbGF0aXZlVVJMID0gJy8nICsgcmVsYXRpdmVVUkw7XG4gICAgICAgIH1cbiAgICAgICAgcGFyc2VkVVJMLnBhdGhuYW1lID0gbnVsbDtcbiAgICAgICAgcGFyc2VkVVJMLnBhdGggPSBudWxsO1xuICAgICAgICBwYXJzZWRVUkwuaGFzaCA9IG51bGw7XG4gICAgICAgIHBhcnNlZFVSTC5xdWVyeSA9IG51bGw7XG4gICAgICAgIHBhcnNlZFVSTC5zZWFyY2ggPSBudWxsO1xuICAgICAgICB2YXIgZG9tYWluID0gbm9kZXVybC5mb3JtYXQocGFyc2VkVVJMKTtcbiAgICAgICAgZGVidWcoJ3BhcnNlVVJMIHJlc3VsdDogJywgZG9tYWluLCByZWxhdGl2ZVVSTCk7XG4gICAgICAgIGlmIChkb21haW4gPT09IHJlbGF0aXZlVVJMKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignaW52YWxpZCBVUkwgJywgdXJsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICAgICAgICByZWxhdGl2ZVVSTDogcmVsYXRpdmVVUkxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIEhlbHBlcnMuaXNOb3RVbmRlZmluZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgaW5wdXRbX2kgLSAwXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0Lmxlbmd0aCA9IDApIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdObyBwYXJhbWV0ZXJzIHJlcXVpcmVkJywgaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ1VuZGVmaW5lZCBwYXJhbWV0ZXIgcHJvdmlkZWQgYXQgaW5kZXggJywgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNBcnJheSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICgoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIHNob3VsZCBiZSBhbiBhcnJheScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmhhc01heEFnZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YS5tYXhBZ2UgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBydWxlIG1pc3NlcyBhIG1heEFnZSBwcm9wZXJ0eScsIGRhdGEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzQm9vbGVhbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBpcyBub3QgYSBib29sZWFuIHByb2JhYmx5IHRoZSBmb3JjZSBwYXJhbSBtaXNzaW5nJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuaXNPcHRpb25hbEJvb2xlYW4gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkYXRhICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdZb3UgcHJvdmlkZWQgYW4gb3B0aW9uYWwgYm9vbGVhbiBidXQgdGhpcyBpcyBub3QgYSBib29sZWFuJywgZGF0YSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuU2FtZVJlZ2V4ID0gZnVuY3Rpb24gKHIxLCByMikge1xuICAgICAgICBpZiAocjEgaW5zdGFuY2VvZiBSZWdFeHAgJiYgcjIgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IFtcImdsb2JhbFwiLCBcIm11bHRpbGluZVwiLCBcImlnbm9yZUNhc2VcIiwgXCJzb3VyY2VcIl07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAocjFbcHJvcF0gIT09IHIyW3Byb3BdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzTWF4QWdlUmVnZXhSdWxlID0gZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgSGVscGVycy5pc0NvbmZpZ1JlZ2V4UnVsZShydWxlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBydWxlLm1heEFnZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIGlzbnQgYSB2YWxpZCBNYXhBZ2UgUmVnZXhSdWxlIC0gb25lIG9mIHRoZSBydWxlIG1pc3NlcyBtYXhBZ2UgcHJvcCcsIHJ1bGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBIZWxwZXJzLmlzQ29uZmlnUmVnZXhSdWxlID0gZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgICAgaWYgKChydWxlLnJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yKCdUaGlzIGlzbnQgYSB2YWxpZCBSZWdleFJ1bGUgLSB0aGUgcnVsZSBpcyBub3QgYSByZWdleCcsIHJ1bGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcnVsZS5pZ25vcmVRdWVyeSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBIZWxwZXJzLmludmFsaWRQYXJhbWV0ZXJFcnJvcignVGhpcyBpc250IGEgdmFsaWQgUmVnZXhSdWxlIC0gdGhlIHJ1bGUgbWlzc2VzIGlnbm9yZVF1ZXJ5IHByb3AnLCBydWxlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy52YWxpZGF0ZUNhY2hlQ29uZmlnID0gZnVuY3Rpb24gKGNhY2hlUnVsZXMpIHtcbiAgICAgICAgSGVscGVycy5pc1N0cmluZ0luKGNhY2hlUnVsZXMuZGVmYXVsdCwgWydhbHdheXMnLCAnbmV2ZXInXSk7XG4gICAgICAgIEhlbHBlcnMuaXNOb3RVbmRlZmluZWQoY2FjaGVSdWxlcy5tYXhBZ2UsIGNhY2hlUnVsZXMuYWx3YXlzLCBjYWNoZVJ1bGVzLm5ldmVyKTtcbiAgICAgICAgWydhbHdheXMnLCAnbmV2ZXInLCAnbWF4QWdlJ10uZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAgICAgSGVscGVycy5pc0FycmF5KGNhY2hlUnVsZXNbdHlwZV0pO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNhY2hlUnVsZXNbdHlwZV0pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhY2hlUnVsZXNbdHlwZV1ba2V5XS5kb21haW4gIT09ICdzdHJpbmcnICYmIChjYWNoZVJ1bGVzW3R5cGVdW2tleV0uZG9tYWluIGluc3RhbmNlb2YgUmVnRXhwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgSGVscGVycy5pbnZhbGlkUGFyYW1ldGVyRXJyb3IoJ0RvbWFpbiBtdXN0IGJlIGVpdGhlciBhIHJlZ2V4IG9yIGEgc3RyaW5nJywgY2FjaGVSdWxlc1t0eXBlXVtrZXldLmRvbWFpbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEhlbHBlcnMuaXNBcnJheShjYWNoZVJ1bGVzW3R5cGVdW2tleV0ucnVsZXMpO1xuICAgICAgICAgICAgICAgIGNhY2hlUnVsZXNbdHlwZV1ba2V5XS5ydWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbWF4QWdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgSGVscGVycy5pc01heEFnZVJlZ2V4UnVsZShydWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEhlbHBlcnMuaXNDb25maWdSZWdleFJ1bGUocnVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBIZWxwZXJzLkpTT05SZWdFeHBSZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgcmV0dXJuIChcIl9fUkVHRVhQIFwiICsgdmFsdWUudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEhlbHBlcnMuSlNPTlJlZ0V4cFJldml2ZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUudG9TdHJpbmcoKS5pbmRleE9mKFwiX19SRUdFWFAgXCIpID09IDApIHtcbiAgICAgICAgICAgIHZhciBtID0gdmFsdWUuc3BsaXQoXCJfX1JFR0VYUCBcIilbMV0ubWF0Y2goL1xcLyguKilcXC8oLiopPy8pO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAobVsxXSwgbVsyXSB8fCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgSGVscGVycy5nZXRDb25maWdLZXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAndXJsLWNhY2hlOnJ1bGVjb25maWcnO1xuICAgIH07XG4gICAgSGVscGVycy52YWxpZGF0ZVJlZGlzU3RvcmFnZUNvbmZpZyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIEhlbHBlcnMuaW52YWxpZFBhcmFtZXRlckVycm9yID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyOiAnICsgbmFtZSArICcuIFZhbHVlIHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcbiAgICB9O1xuICAgIEhlbHBlcnMuUmVkaXNFcnJvciA9IGZ1bmN0aW9uIChkZXNjcmlwdGlvbiwgbXNnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkaXM6ICcgKyBkZXNjcmlwdGlvbiArICcuIEVycm9yIHJlY2VpdmVkOiAnICsgbXNnKTtcbiAgICB9O1xuICAgIHJldHVybiBIZWxwZXJzO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IEhlbHBlcnM7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvaGVscGVycy50c1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwidXJsXCJcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkZWJ1Z1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwiZGVidWdcIlxuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgaGVscGVyc18xID0gcmVxdWlyZSgnLi4vaGVscGVycycpO1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc2ltcGxlLXVybC1jYWNoZScpO1xudmFyIFVybENvbW1vbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVXJsQ29tbW9uKF9kb21haW4sIF9zdG9yYWdlSW5zdGFuY2UsIF9pbnN0YW5jZU5hbWUsIF91cmwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fZG9tYWluID0gX2RvbWFpbjtcbiAgICAgICAgdGhpcy5faW5zdGFuY2VOYW1lID0gX2luc3RhbmNlTmFtZTtcbiAgICAgICAgdGhpcy5fdXJsID0gX3VybDtcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnkgPSAnJztcbiAgICAgICAgdGhpcy5fbWF4QWdlID0gMDtcbiAgICAgICAgdGhpcy5nZXRSZWdleFRlc3QgPSBmdW5jdGlvbiAodSkge1xuICAgICAgICAgICAgcmV0dXJuIHUucmVnZXgudGVzdChfdGhpcy5fdXJsKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuaGFzUHJvbWlzZShfc3RvcmFnZUluc3RhbmNlKSkge1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZVByb21pc2UgPSBfc3RvcmFnZUluc3RhbmNlO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZSA9IF9zdG9yYWdlSW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdG9yYWdlQ0IgPSBfc3RvcmFnZUluc3RhbmNlO1xuICAgICAgICAgICAgdGhpcy5fc3RvcmFnZSA9IF9zdG9yYWdlSW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRDYWNoZUNhdGVnb3J5KCk7XG4gICAgfVxuICAgIFVybENvbW1vbi5wcm90b3R5cGUuaGFzUHJvbWlzZSA9IGZ1bmN0aW9uIChzdG9yYWdlKSB7XG4gICAgICAgIHJldHVybiBzdG9yYWdlLmdldE1ldGhvZCgpID09PSAncHJvbWlzZSc7XG4gICAgfTtcbiAgICBVcmxDb21tb24ucHJvdG90eXBlLmdldERvbWFpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvbWFpbjtcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYXRlZ29yeTtcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuZ2V0SW5zdGFuY2VOYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgVXJsQ29tbW9uLnByb3RvdHlwZS5nZXRVcmwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmw7XG4gICAgfTtcbiAgICBVcmxDb21tb24ucHJvdG90eXBlLmdldFRUTCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heEFnZTtcbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuY2hlY2tEb21haW4gPSBmdW5jdGlvbiAoc3RvcmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RvbWFpbi5pbmRleE9mKHN0b3JlZCkgIT09IC0xO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlZC50ZXN0KHRoaXMuX2RvbWFpbik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFVybENvbW1vbi5wcm90b3R5cGUuc2V0Q2FjaGVDYXRlZ29yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGtleSwgZG9tYWluLCBpO1xuICAgICAgICB2YXIgY29uZmlnID0gdGhpcy5fc3RvcmFnZS5nZXRDYWNoZVJ1bGVzKCk7XG4gICAgICAgIGRlYnVnKCdjb25maWcgbG9hZGVkOiAnLCBjb25maWcpO1xuICAgICAgICBmb3IgKGtleSA9IDA7IGtleSA8IGNvbmZpZy5tYXhBZ2UubGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEb21haW4oY29uZmlnLm1heEFnZVtrZXldLmRvbWFpbikpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLm1heEFnZVtrZXldLnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFJlZ2V4VGVzdChjb25maWcubWF4QWdlW2tleV0ucnVsZXNbaV0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXRlZ29yeSA9ICdtYXhBZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4QWdlID0gY29uZmlnLm1heEFnZVtrZXldLnJ1bGVzW2ldLm1heEFnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGtleSA9IDA7IGtleSA8IGNvbmZpZy5hbHdheXMubGVuZ3RoOyBrZXkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEb21haW4oY29uZmlnLmFsd2F5c1trZXldLmRvbWFpbikpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLmFsd2F5c1trZXldLnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFJlZ2V4VGVzdChjb25maWcuYWx3YXlzW2tleV0ucnVsZXNbaV0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYXRlZ29yeSA9ICdhbHdheXMnO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoa2V5ID0gMDsga2V5IDwgY29uZmlnLm5ldmVyLmxlbmd0aDsga2V5KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRG9tYWluKGNvbmZpZy5uZXZlcltrZXldLmRvbWFpbikpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLm5ldmVyW2tleV0ucnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0UmVnZXhUZXN0KGNvbmZpZy5uZXZlcltrZXldLnJ1bGVzW2ldKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2F0ZWdvcnkgPSAnbmV2ZXInO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NhdGVnb3J5ID0gY29uZmlnLmRlZmF1bHQ7XG4gICAgfTtcbiAgICA7XG4gICAgcmV0dXJuIFVybENvbW1vbjtcbn0oKSk7XG5leHBvcnRzLlVybENvbW1vbiA9IFVybENvbW1vbjtcbnZhciBVcmxQcm9taXNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVXJsUHJvbWlzZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBVcmxQcm9taXNlKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX3N0b3JhZ2VQcm9taXNlLmRlbGV0ZShfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX3N0b3JhZ2VQcm9taXNlLmdldChfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5oYXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX3N0b3JhZ2VQcm9taXNlLmhhcyhfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIF90aGlzLmdldENhdGVnb3J5KCksIF90aGlzLmdldFRUTCgpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXQgPSBmdW5jdGlvbiAoY29udGVudCwgZXh0cmEsIGZvcmNlKSB7XG4gICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoY29udGVudCk7XG4gICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc09wdGlvbmFsQm9vbGVhbihmb3JjZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZvcmNlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGZvcmNlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX3N0b3JhZ2VQcm9taXNlLnNldChfdGhpcy5nZXREb21haW4oKSwgX3RoaXMuZ2V0VXJsKCksIGNvbnRlbnQsIGV4dHJhLCBfdGhpcy5nZXRDYXRlZ29yeSgpLCBfdGhpcy5nZXRUVEwoKSwgZm9yY2UpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVXJsUHJvbWlzZTtcbn0oVXJsQ29tbW9uKSk7XG5leHBvcnRzLlVybFByb21pc2UgPSBVcmxQcm9taXNlO1xudmFyIFVybENCID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVXJsQ0IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVXJsQ0IoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICAgICAgX3RoaXMuX3N0b3JhZ2VDQi5kZWxldGUoX3RoaXMuZ2V0RG9tYWluKCksIF90aGlzLmdldFVybCgpLCBfdGhpcy5nZXRDYXRlZ29yeSgpLCBfdGhpcy5nZXRUVEwoKSwgY2IpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldCA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICAgICAgX3RoaXMuX3N0b3JhZ2VDQi5nZXQoX3RoaXMuZ2V0RG9tYWluKCksIF90aGlzLmdldFVybCgpLCBfdGhpcy5nZXRDYXRlZ29yeSgpLCBfdGhpcy5nZXRUVEwoKSwgY2IpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhcyA9IGZ1bmN0aW9uIChjYikge1xuICAgICAgICAgICAgX3RoaXMuX3N0b3JhZ2VDQi5oYXMoX3RoaXMuZ2V0RG9tYWluKCksIF90aGlzLmdldFVybCgpLCBfdGhpcy5nZXRDYXRlZ29yeSgpLCBfdGhpcy5nZXRUVEwoKSwgY2IpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnNldCA9IGZ1bmN0aW9uIChjb250ZW50LCBleHRyYSwgZm9yY2UsIGNiKSB7XG4gICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoY29udGVudCk7XG4gICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc0Jvb2xlYW4oZm9yY2UpO1xuICAgICAgICAgICAgX3RoaXMuX3N0b3JhZ2VDQi5zZXQoX3RoaXMuZ2V0RG9tYWluKCksIF90aGlzLmdldFVybCgpLCBjb250ZW50LCBleHRyYSwgX3RoaXMuZ2V0Q2F0ZWdvcnkoKSwgX3RoaXMuZ2V0VFRMKCksIGZvcmNlLCBjYik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBVcmxDQjtcbn0oVXJsQ29tbW9uKSk7XG5leHBvcnRzLlVybENCID0gVXJsQ0I7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGUudHNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi4vaGVscGVyc1wiKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBDYWNoZUVuZ2luZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVFbmdpbmUoZGVmYXVsdERvbWFpbiwgaW5zdGFuY2VEZWZpbml0aW9uKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdERvbWFpbiA9IGRlZmF1bHREb21haW47XG4gICAgICAgIHRoaXMuaW5zdGFuY2VEZWZpbml0aW9uID0gaW5zdGFuY2VEZWZpbml0aW9uO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChkZWZhdWx0RG9tYWluLCBpbnN0YW5jZURlZmluaXRpb24pO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc1N0cmluZ0RlZmluZWQoZGVmYXVsdERvbWFpbik7XG4gICAgICAgIGlmIChpbnN0YW5jZURlZmluaXRpb24uaXNJbnN0YW5jaWF0ZWQoKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciBlcnJvck1zZyA9ICdUaGlzIGluc3RhbmNlIGhhc25cXCd0IGluaXRpYXRlZCBjb3JyZWN0bHk6ICcgKyBpbnN0YW5jZURlZmluaXRpb24uZ2V0SW5zdGFuY2VOYW1lKCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yTXNnKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0YW5jZU5hbWUgPSBpbnN0YW5jZURlZmluaXRpb24uZ2V0SW5zdGFuY2VOYW1lKCk7XG4gICAgICAgIGlmIChpbnN0YW5jZURlZmluaXRpb24uZ2V0Q29uZmlnKCkub25fcHVibGlzaF91cGRhdGUgPT09IHRydWUgJiYgdHlwZW9mIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgQ2FjaGVFbmdpbmUudXJsc1t0aGlzLmluc3RhbmNlTmFtZV0gPSB7fTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBDYWNoZUVuZ2luZS51cGRhdGVBbGxVcmxDYXRlZ29yeSA9IGZ1bmN0aW9uIChpbnN0YW5jZU5hbWUpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGluc3RhbmNlTmFtZSk7XG4gICAgICAgIGlmICh0eXBlb2YgQ2FjaGVFbmdpbmUudXJsc1tpbnN0YW5jZU5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIENhY2hlRW5naW5lLnVybHNbaW5zdGFuY2VOYW1lXSkge1xuICAgICAgICAgICAgICAgIENhY2hlRW5naW5lLnVybHNbaW5zdGFuY2VOYW1lXVtrZXldLnNldENhY2hlQ2F0ZWdvcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FjaGVFbmdpbmUucHJvdG90eXBlLmdldEluc3RhbmNlTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgQ2FjaGVFbmdpbmUucHJvdG90eXBlLmFkZFVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDYWNoZUVuZ2luZS51cmxzW3RoaXMuaW5zdGFuY2VOYW1lXSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdW3RoaXMuYnVpbGRVUkxJbmRleCh1cmwpXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIENhY2hlRW5naW5lLnVybHNbdGhpcy5pbnN0YW5jZU5hbWVdW3RoaXMuYnVpbGRVUkxJbmRleCh1cmwpXSA9IHVybDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FjaGVFbmdpbmUucHJvdG90eXBlLmJ1aWxkVVJMSW5kZXggPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlTmFtZSArICdfJyArIHVybC5nZXREb21haW4oKSArICdfJyArIHVybC5nZXRVcmwoKTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lLnVybHMgPSB7fTtcbiAgICBDYWNoZUVuZ2luZS5oZWxwZXJzID0ge1xuICAgICAgICB2YWxpZGF0ZVJlZGlzU3RvcmFnZUNvbmZpZzogaGVscGVyc18xLmRlZmF1bHQudmFsaWRhdGVSZWRpc1N0b3JhZ2VDb25maWcsXG4gICAgICAgIHZhbGlkYXRlQ2FjaGVDb25maWc6IGhlbHBlcnNfMS5kZWZhdWx0LnZhbGlkYXRlQ2FjaGVDb25maWdcbiAgICB9O1xuICAgIENhY2hlRW5naW5lLmhhc2hLZXkgPSAndXJsLWNhY2hlOic7XG4gICAgcmV0dXJuIENhY2hlRW5naW5lO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlRW5naW5lO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3RzL2NhY2hlRW5naW5lL0NhY2hlRW5naW5lLnRzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xufTtcbnZhciBkZWJnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBlczZfcHJvbWlzZV8xID0gcmVxdWlyZSgnZXM2LXByb21pc2UnKTtcbnZhciBpbnN0YW5jZUNCXzEgPSByZXF1aXJlKFwiLi9pbnN0YW5jZUNCXCIpO1xudmFyIHN0b3JhZ2VfMSA9IHJlcXVpcmUoXCIuLi9hYnN0cmFjdC9zdG9yYWdlXCIpO1xudmFyIGRlYnVnID0gZGViZygnc2ltcGxlLXVybC1jYWNoZS1SRURJUycpO1xudmFyIFJlZGlzU3RvcmFnZVByb21pc2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhSZWRpc1N0b3JhZ2VQcm9taXNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlZGlzU3RvcmFnZVByb21pc2UoaW5zdGFuY2UpIHtcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICAgICAgdGhpcy5oYXNoS2V5ID0gJ3NpbXBsZS11cmwtY2FjaGU6JyArIGluc3RhbmNlLmdldEluc3RhbmNlTmFtZSgpO1xuICAgICAgICB0aGlzLmNiSW5zdGFuY2UgPSBuZXcgaW5zdGFuY2VDQl8xLmRlZmF1bHQoaW5zdGFuY2UpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9ICdwcm9taXNlJztcbiAgICB9XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuZ2V0Q2FjaGVSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0TWFuYWdlcigpLmdldFJ1bGVzKCk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5jbGVhckNhY2hlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmNsZWFyQ2FjaGUoZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmNsZWFyRG9tYWluID0gZnVuY3Rpb24gKGRvbWFpbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmNsZWFyRG9tYWluKGRvbWFpbiwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmdldENhY2hlZERvbWFpbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgZXM2X3Byb21pc2VfMS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIF90aGlzLmNiSW5zdGFuY2UuZ2V0Q2FjaGVkRG9tYWlucyhmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlUHJvbWlzZS5wcm90b3R5cGUuZ2V0Q2FjaGVkVVJMcyA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5nZXRDYWNoZWRVUkxzKGRvbWFpbiwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChkb21haW4sIHVybCwgY2F0ZWdvcnksIHR0bCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IGVzNl9wcm9taXNlXzEuUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBfdGhpcy5jYkluc3RhbmNlLmRlbGV0ZShkb21haW4sIHVybCwgY2F0ZWdvcnksIHR0bCwgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZVByb21pc2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2JJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5nZXQoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5oYXMoZG9tYWluLCB1cmwsIGNhdGVnb3J5LCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VQcm9taXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIHZhbHVlLCBleHRyYSwgY2F0ZWdvcnksIHR0bCwgZm9yY2UpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBlczZfcHJvbWlzZV8xLlByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgX3RoaXMuY2JJbnN0YW5jZS5zZXQoZG9tYWluLCB1cmwsIHZhbHVlLCBleHRyYSwgY2F0ZWdvcnksIHR0bCwgZm9yY2UsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKGVycik7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gUmVkaXNTdG9yYWdlUHJvbWlzZTtcbn0oc3RvcmFnZV8xLlN0b3JhZ2VQcm9taXNlKSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmF1bHQgPSBSZWRpc1N0b3JhZ2VQcm9taXNlO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3RzL3JlZGlzL2luc3RhbmNlUHJvbWlzZS50c1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCBmdW5jdGlvbiAoZCwgYikge1xuICAgIGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbn07XG52YXIgcG9vbF8xID0gcmVxdWlyZSgnLi9wb29sJyk7XG52YXIgZGViZyA9IHJlcXVpcmUoJ2RlYnVnJyk7XG52YXIgQ2FjaGVFbmdpbmVfMSA9IHJlcXVpcmUoXCIuLi9jYWNoZUVuZ2luZS9DYWNoZUVuZ2luZVwiKTtcbnZhciBzdG9yYWdlXzEgPSByZXF1aXJlKFwiLi4vYWJzdHJhY3Qvc3RvcmFnZVwiKTtcbnZhciBkZWJ1ZyA9IGRlYmcoJ3NpbXBsZS11cmwtY2FjaGUtUkVESVMnKTtcbnZhciBSZWRpc1N0b3JhZ2VDQiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFJlZGlzU3RvcmFnZUNCLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJlZGlzU3RvcmFnZUNCKGluc3RhbmNlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLmluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgICAgIHRoaXMuX2Nvbm4gPSBwb29sXzEuUmVkaXNQb29sLmdldENvbm5lY3Rpb24oaW5zdGFuY2UuZ2V0SW5zdGFuY2VOYW1lKCkpO1xuICAgICAgICB0aGlzLmhhc2hLZXkgPSBDYWNoZUVuZ2luZV8xLmRlZmF1bHQuaGFzaEtleSArIHRoaXMuaW5zdGFuY2UuZ2V0SW5zdGFuY2VOYW1lKCk7XG4gICAgICAgIHRoaXMubWV0aG9kID0gJ2NhbGxiYWNrJztcbiAgICB9XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGJhdGNoID0gdGhpcy5fY29ubi5iYXRjaCgpO1xuICAgICAgICB0aGlzLl9jb25uLmhrZXlzKHRoaXMuaGFzaEtleSwgZnVuY3Rpb24gKGVyciwgZG9tYWlucykge1xuICAgICAgICAgICAgZGVidWcoZXJyKTtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICBpZiAoZG9tYWlucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmIgPSAwO1xuICAgICAgICAgICAgZG9tYWlucy5mb3JFYWNoKGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgICAgICAgICBiYXRjaC5kZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pKTtcbiAgICAgICAgICAgICAgICBiYXRjaC5oZGVsKF90aGlzLmhhc2hLZXksIGRvbWFpbik7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2Nvbm4uaGtleXMoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCBmdW5jdGlvbiAoZXJyLCBrZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCdrZXlzID0gJywga2V5cyk7XG4gICAgICAgICAgICAgICAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaC5kZWwoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwga2V5KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBuYisrO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmIgPT09IGRvbWFpbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaC5leGVjKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1ZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuY2xlYXJEb21haW4gPSBmdW5jdGlvbiAoZG9tYWluLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9jb25uLmhkZWwodGhpcy5oYXNoS2V5LCBkb21haW4sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICBfdGhpcy5fY29ubi5oa2V5cyhfdGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIGZ1bmN0aW9uIChlcnIsIHVybHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodXJscy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbmIgPSAwO1xuICAgICAgICAgICAgICAgIHVybHMuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRlbGV0ZShkb21haW4sIHVybCwgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5iKys7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmIgPT09IHVybHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLmdldENhY2hlZERvbWFpbnMgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgdGhpcy5fY29ubi5oa2V5cyh0aGlzLmhhc2hLZXksIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgcmVzdWx0cyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgUmVkaXNTdG9yYWdlQ0IucHJvdG90eXBlLmdldENhY2hlZFVSTHMgPSBmdW5jdGlvbiAoZG9tYWluLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgY2FjaGVkVXJscyA9IFtdO1xuICAgICAgICB0aGlzLl9jb25uLmhrZXlzKHRoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCBmdW5jdGlvbiAoZXJyLCB1cmxzKSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgaWYgKHVybHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGNhY2hlZFVybHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG5iID0gMDtcbiAgICAgICAgICAgIHVybHMuZm9yRWFjaChmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2Nvbm4uZ2V0KF90aGlzLmdldFVybEtleShkb21haW4sIHVybCksIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVkVXJscy5wdXNoKHVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5iID09PSB1cmxzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBjYWNoZWRVcmxzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLmhkZWwoX3RoaXMuZ2V0RG9tYWluSGFzaEtleShkb21haW4pLCB1cmwsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gdXJscy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGNhY2hlZFVybHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0Q2FjaGVSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UuZ2V0TWFuYWdlcigpLmdldFJ1bGVzKCk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmhhcyhkb21haW4sIHVybCwgY2F0ZWdvcnksIHR0bCwgZnVuY3Rpb24gKGVyciwgaXNDYWNoZWQpIHtcbiAgICAgICAgICAgIGlmICghaXNDYWNoZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ3VybCBpcyBub3QgY2FjaGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5kZWwoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5oZGVsKF90aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgdXJsLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwb29sXzEuUmVkaXNQb29sLmtpbGwodGhpcy5pbnN0YW5jZS5nZXRJbnN0YW5jZU5hbWUoKSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9jb25uLmhnZXQodGhpcy5nZXREb21haW5IYXNoS2V5KGRvbWFpbiksIHVybCwgZnVuY3Rpb24gKGVyciwgY29udGVudCkge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKCd1cmwgbm90IGNhY2hlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3RoaXMuX2Nvbm4uZ2V0KF90aGlzLmdldFVybEtleShkb21haW4sIHVybCksIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5oZGVsKF90aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYigndXJsIG5vdCBjYWNoZWQgLSBjbGVhbmluZyB0aW1lc3RhbXAgaW5mb3JtYXRpb25zJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc2VyaWFsaXplZENvbnRlbnQgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgeyBjb250ZW50OiBjb250ZW50LCBjcmVhdGVkT246IGRlc2VyaWFsaXplZENvbnRlbnQudGltZXN0YW1wLCBleHRyYTogZGVzZXJpYWxpemVkQ29udGVudC5leHRyYSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsLCBjYXRlZ29yeSwgdHRsLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9jb25uLmdldCh0aGlzLmdldFVybEtleShkb21haW4sIHVybCksIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnRXJyb3Igd2hpbGUgcXVlcnlpbmcgaXMgY2FjaGVkIG9uIHJlZGlzOiAnLCBkb21haW4sIHVybCwgZXJyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBpc0NhY2hlZCA9IGRhdGEgIT09IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0NhY2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5oZGVsKF90aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgdXJsLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoZG9tYWluLCB1cmwsIHZhbHVlLCBleHRyYSwgY2F0ZWdvcnksIHR0bCwgZm9yY2UsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChmb3JjZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZShkb21haW4sIHVybCwgdmFsdWUsIGV4dHJhLCB0dGwsIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2F0ZWdvcnkgPT09ICduZXZlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhhcyhkb21haW4sIHVybCwgY2F0ZWdvcnksIHR0bCwgZnVuY3Rpb24gKGVyciwgaGFzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgaWYgKGhhcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3RvcmUoZG9tYWluLCB1cmwsIHZhbHVlLCBleHRyYSwgdHRsLCBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIDtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0RG9tYWluSGFzaEtleSA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzaEtleSArICc6JyArIGRvbWFpbjtcbiAgICB9O1xuICAgIFJlZGlzU3RvcmFnZUNCLnByb3RvdHlwZS5zdG9yZSA9IGZ1bmN0aW9uIChkb21haW4sIHVybCwgdmFsdWUsIGV4dHJhLCB0dGwsIGNiKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2Nvbm4uaHNldCh0aGlzLmhhc2hLZXksIGRvbWFpbiwgZG9tYWluLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5oc2V0KF90aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSwgdXJsLCB2YWx1ZSwgZnVuY3Rpb24gKGVyciwgZXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb25uLnNldChfdGhpcy5nZXRVcmxLZXkoZG9tYWluLCB1cmwpLCBKU09OLnN0cmluZ2lmeSh7IHRpbWVzdGFtcDogRGF0ZS5ub3coKSwgZXh0cmE6IGV4dHJhIH0pLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR0bCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fY29ubi5leHBpcmUoX3RoaXMuZ2V0VXJsS2V5KGRvbWFpbiwgdXJsKSwgdHRsLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBSZWRpc1N0b3JhZ2VDQi5wcm90b3R5cGUuZ2V0VXJsS2V5ID0gZnVuY3Rpb24gKGRvbWFpbiwgdXJsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldERvbWFpbkhhc2hLZXkoZG9tYWluKSArICc6JyArIHVybDtcbiAgICB9O1xuICAgIHJldHVybiBSZWRpc1N0b3JhZ2VDQjtcbn0oc3RvcmFnZV8xLlN0b3JhZ2VDQikpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gUmVkaXNTdG9yYWdlQ0I7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvcmVkaXMvaW5zdGFuY2VDQi50c1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHJlZGlzID0gcmVxdWlyZSgncmVkaXMnKTtcbnZhciBkYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBkZWJ1ZyA9IGRidWcoJ3NpbXBsZS11cmwtY2FjaGUtUkVESVMnKTtcbnZhciBSZWRpc1Bvb2wgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJlZGlzUG9vbCgpIHtcbiAgICB9XG4gICAgUmVkaXNQb29sLmNvbm5lY3QgPSBmdW5jdGlvbiAoaW5zdGFuY2VOYW1lLCBjb25maWcsIGNiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgUmVkaXNQb29sLl9wb29sW2luc3RhbmNlTmFtZV0gPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXSA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgdHlwZW9mIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0gPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdID09PSBudWxsKSB7XG4gICAgICAgICAgICBkZWJ1ZygnVGhpcyByZWRpcyBjb25uZWN0aW9uIGhhcyBuZXZlciBiZWVuIGluc3RhbmNpYXRlZCBiZWZvcmUnLCBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXSA9IHtcbiAgICAgICAgICAgICAgICBvbmxpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9vbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHN1YjogZmFsc2VcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxhc3RFcnJvcjogbnVsbCxcbiAgICAgICAgICAgICAgICB3YXJuaW5nczogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXSA9IHJlZGlzLmNyZWF0ZUNsaWVudChjb25maWcpO1xuICAgICAgICAgICAgUmVkaXNQb29sLl9zdWJbaW5zdGFuY2VOYW1lXSA9IHJlZGlzLmNyZWF0ZUNsaWVudChjb25maWcpO1xuICAgICAgICAgICAgdmFyIG5iID0gMDtcbiAgICAgICAgICAgIHZhciBuYkVycm9ycyA9IDA7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignY29ubmVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5wb29sID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncG9vbCByZWRpcyBjb25uZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICBuYisrO1xuICAgICAgICAgICAgICAgIGlmIChuYiA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1ZygnUE9PTCBDT05ORUNURUQgMiBjb25ucycpO1xuICAgICAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0ub24oJ2Nvbm5lY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUuc3ViID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygncmVkaXMgY29ubmVjdGVkJyk7XG4gICAgICAgICAgICAgICAgbmIrKztcbiAgICAgICAgICAgICAgICBpZiAobmIgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoJ1BPT0wgQ09OTkVDVEVEIDIgY29ubnMnKTtcbiAgICAgICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignZXJyb3InLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ubGFzdEVycm9yID0gZTtcbiAgICAgICAgICAgICAgICBuYkVycm9ycysrO1xuICAgICAgICAgICAgICAgIGRlYnVnKG5iRXJyb3JzLCBlKTtcbiAgICAgICAgICAgICAgICBpZiAobmJFcnJvcnMgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignZW5kJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fcG9vbFtpbnN0YW5jZU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5wb29sID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLmtpbGwoaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlZGlzIENvbm5lY3Rpb24gY2xvc2VkIGZvciBpbnN0YW5jZSAnICsgaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnQ29ubmVjdGlvbiBjbG9zZWQnLCBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5vbignd2FybmluZycsIGZ1bmN0aW9uIChtc2cpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1JlZGlzIHdhcm5pbmcgZm9yIGluc3RhbmNlICcgKyBpbnN0YW5jZU5hbWUgKyAnLiBNU0cgPSAnLCBtc2cpO1xuICAgICAgICAgICAgICAgIFJlZGlzUG9vbC5fc3RhdHVzW2luc3RhbmNlTmFtZV0ud2FybmluZ3MucHVzaChtc2cpO1xuICAgICAgICAgICAgICAgIGRlYnVnKCdXYXJuaW5nIGNhbGxlZDogJywgaW5zdGFuY2VOYW1lLCBtc2cpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5sYXN0RXJyb3IgPSBlO1xuICAgICAgICAgICAgICAgIG5iRXJyb3JzKys7XG4gICAgICAgICAgICAgICAgZGVidWcobmJFcnJvcnMsIGUpO1xuICAgICAgICAgICAgICAgIGlmIChuYkVycm9ycyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjYihlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0ub24oJ2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5zdWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wua2lsbChpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignUmVkaXMgQ29ubmVjdGlvbiBjbG9zZWQgZm9yIGluc3RhbmNlICcgKyBpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgICAgIGRlYnVnKCdDb25uZWN0aW9uIGNsb3NlZCcsIGluc3RhbmNlTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFJlZGlzUG9vbC5fc3ViW2luc3RhbmNlTmFtZV0ub24oJ3dhcm5pbmcnLCBmdW5jdGlvbiAobXNnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdSZWRpcyB3YXJuaW5nIGZvciBpbnN0YW5jZSAnICsgaW5zdGFuY2VOYW1lICsgJy4gTVNHID0gJywgbXNnKTtcbiAgICAgICAgICAgICAgICBSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLndhcm5pbmdzLnB1c2gobXNnKTtcbiAgICAgICAgICAgICAgICBkZWJ1ZygnV2FybmluZyBjYWxsZWQ6ICcsIGluc3RhbmNlTmFtZSwgbXNnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFJlZGlzUG9vbC5raWxsID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSkge1xuICAgICAgICBpZiAoUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUuc3ViID09PSB0cnVlKSB7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdLmVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZS5wb29sID09PSB0cnVlKSB7XG4gICAgICAgICAgICBSZWRpc1Bvb2wuX3Bvb2xbaW5zdGFuY2VOYW1lXS5lbmQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUmVkaXNQb29sLmdldENvbm5lY3Rpb24gPSBmdW5jdGlvbiAoaW5zdGFuY2VOYW1lKSB7XG4gICAgICAgIGlmIChSZWRpc1Bvb2wuX3N0YXR1c1tpbnN0YW5jZU5hbWVdLm9ubGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZGlzUG9vbC5fcG9vbFtpbnN0YW5jZU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKCdSZWRpcyBQb29sIGlzblxcJ3Qgb25saW5lIHlldCcpO1xuICAgIH07XG4gICAgUmVkaXNQb29sLmdldFN1YnNjcmliZXJDb25uZWN0aW9uID0gZnVuY3Rpb24gKGluc3RhbmNlTmFtZSkge1xuICAgICAgICBpZiAoUmVkaXNQb29sLl9zdGF0dXNbaW5zdGFuY2VOYW1lXS5vbmxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBSZWRpc1Bvb2wuX3N1YltpbnN0YW5jZU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlYnVnKCdSZWRpcyBQb29sIGlzblxcJ3Qgb25saW5lIHlldCcpO1xuICAgIH07XG4gICAgUmVkaXNQb29sLl9wb29sID0ge307XG4gICAgUmVkaXNQb29sLl9zdWIgPSB7fTtcbiAgICBSZWRpc1Bvb2wuX3N0YXR1cyA9IHt9O1xuICAgIHJldHVybiBSZWRpc1Bvb2w7XG59KCkpO1xuZXhwb3J0cy5SZWRpc1Bvb2wgPSBSZWRpc1Bvb2w7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvcmVkaXMvcG9vbC50c1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWRpc1wiKTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIFwicmVkaXNcIlxuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIFN0b3JhZ2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0b3JhZ2UoKSB7XG4gICAgfVxuICAgIFN0b3JhZ2UucHJvdG90eXBlLmdldE1ldGhvZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWV0aG9kO1xuICAgIH07XG4gICAgcmV0dXJuIFN0b3JhZ2U7XG59KCkpO1xudmFyIFN0b3JhZ2VQcm9taXNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RvcmFnZVByb21pc2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3RvcmFnZVByb21pc2UoKSB7XG4gICAgICAgIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICByZXR1cm4gU3RvcmFnZVByb21pc2U7XG59KFN0b3JhZ2UpKTtcbmV4cG9ydHMuU3RvcmFnZVByb21pc2UgPSBTdG9yYWdlUHJvbWlzZTtcbnZhciBTdG9yYWdlQ0IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTdG9yYWdlQ0IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3RvcmFnZUNCKCkge1xuICAgICAgICBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgcmV0dXJuIFN0b3JhZ2VDQjtcbn0oU3RvcmFnZSkpO1xuZXhwb3J0cy5TdG9yYWdlQ0IgPSBTdG9yYWdlQ0I7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvYWJzdHJhY3Qvc3RvcmFnZS50c1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgZnVuY3Rpb24gKGQsIGIpIHtcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG59O1xudmFyIGluc3RhbmNlQ0JfMSA9IHJlcXVpcmUoXCIuLi9yZWRpcy9pbnN0YW5jZUNCXCIpO1xudmFyIGhlbHBlcnNfMSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMnKTtcbnZhciBjYWNoZV8xID0gcmVxdWlyZSgnLi9jYWNoZScpO1xudmFyIENhY2hlRW5naW5lXzEgPSByZXF1aXJlKFwiLi9DYWNoZUVuZ2luZVwiKTtcbnZhciBkYnVnID0gcmVxdWlyZSgnZGVidWcnKTtcbnZhciBkZWJ1ZyA9IGRidWcoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBDYWNoZUVuZ2luZUNCID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ2FjaGVFbmdpbmVDQiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDYWNoZUVuZ2luZUNCKGRlZmF1bHREb21haW4sIGluc3RhbmNlKSB7XG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGRlZmF1bHREb21haW4sIGluc3RhbmNlKTtcbiAgICAgICAgdGhpcy5zdG9yYWdlSW5zdGFuY2UgPSBuZXcgaW5zdGFuY2VDQl8xLmRlZmF1bHQoaW5zdGFuY2UpO1xuICAgIH1cbiAgICBDYWNoZUVuZ2luZUNCLnByb3RvdHlwZS5jbGVhckRvbWFpbiA9IGZ1bmN0aW9uIChkb21haW4sIGNiKSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nRGVmaW5lZChkb21haW4pO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJbnN0YW5jZS5jbGVhckRvbWFpbihkb21haW4sIGNiKTtcbiAgICB9O1xuICAgIENhY2hlRW5naW5lQ0IucHJvdG90eXBlLmNsZWFySW5zdGFuY2UgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlSW5zdGFuY2UuY2xlYXJDYWNoZShjYik7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZUNCLnByb3RvdHlwZS5nZXRTdG9yZWRIb3N0bmFtZXMgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlSW5zdGFuY2UuZ2V0Q2FjaGVkRG9tYWlucyhjYik7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZUNCLnByb3RvdHlwZS5nZXRTdG9yZWRVUkxzID0gZnVuY3Rpb24gKGRvbWFpbiwgY2IpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNTdHJpbmdEZWZpbmVkKGRvbWFpbik7XG4gICAgICAgIHRoaXMuc3RvcmFnZUluc3RhbmNlLmdldENhY2hlZFVSTHMoZG9tYWluLCBjYik7XG4gICAgfTtcbiAgICBDYWNoZUVuZ2luZUNCLnByb3RvdHlwZS51cmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHZhciBwYXJzZWRVUkwgPSBoZWxwZXJzXzEuZGVmYXVsdC5wYXJzZVVSTCh1cmwpO1xuICAgICAgICBpZiAocGFyc2VkVVJMLmRvbWFpbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHBhcnNlZFVSTC5kb21haW4gPSB0aGlzLmRlZmF1bHREb21haW47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNhY2hlID0gbmV3IGNhY2hlXzEuVXJsQ0IocGFyc2VkVVJMLmRvbWFpbiwgdGhpcy5zdG9yYWdlSW5zdGFuY2UsIHRoaXMuaW5zdGFuY2VOYW1lLCBwYXJzZWRVUkwucmVsYXRpdmVVUkwpO1xuICAgICAgICB0aGlzLmFkZFVybChjYWNoZSk7XG4gICAgICAgIHJldHVybiBjYWNoZTtcbiAgICB9O1xuICAgIHJldHVybiBDYWNoZUVuZ2luZUNCO1xufShDYWNoZUVuZ2luZV8xLmRlZmF1bHQpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlRW5naW5lQ0I7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvY2FjaGVFbmdpbmUvY2FjaGVFbmdpbmVDQi50c1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBoZWxwZXJzXzEgPSByZXF1aXJlKFwiLi9oZWxwZXJzXCIpO1xudmFyIHBvb2xfMSA9IHJlcXVpcmUoXCIuL3JlZGlzL3Bvb2xcIik7XG52YXIgQ2FjaGVFbmdpbmVfMSA9IHJlcXVpcmUoJy4vY2FjaGVFbmdpbmUvQ2FjaGVFbmdpbmUnKTtcbnZhciBDYWNoZVJ1bGVNYW5hZ2VyXzEgPSByZXF1aXJlKCcuL3J1bGVzL0NhY2hlUnVsZU1hbmFnZXInKTtcbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ3NpbXBsZS11cmwtY2FjaGUnKTtcbnZhciBJbnN0YW5jZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSW5zdGFuY2UoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY29uZmlnLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoY29uZmlnID09PSB2b2lkIDApIHsgY29uZmlnID0geyBvbl9leGlzdGluZ19yZWdleDogJ3JlcGxhY2UnLCBvbl9wdWJsaXNoX3VwZGF0ZTogZmFsc2UgfTsgfVxuICAgICAgICB0aGlzLmluc3RhbmNlTmFtZSA9IGluc3RhbmNlTmFtZTtcbiAgICAgICAgdGhpcy5yZWRpc0NvbmZpZyA9IHJlZGlzQ29uZmlnO1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5pbnN0YW5jaWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgY29uZmlnLCBjYik7XG4gICAgICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7IG9uX2V4aXN0aW5nX3JlZ2V4OiAncmVwbGFjZScsIG9uX3B1Ymxpc2hfdXBkYXRlOiBmYWxzZSB9LCBjb25maWcpO1xuICAgICAgICBwb29sXzEuUmVkaXNQb29sLmNvbm5lY3QoaW5zdGFuY2VOYW1lLCByZWRpc0NvbmZpZywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ0Vycm9yIGNvbm5lY3RpbmcgdG8gUkVESVM6ICcgKyBlcnIpO1xuICAgICAgICAgICAgdmFyIHJlZGlzQ29ubiA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0Q29ubmVjdGlvbihpbnN0YW5jZU5hbWUpO1xuICAgICAgICAgICAgcmVkaXNDb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIF90aGlzLmluc3RhbmNlTmFtZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArICcgLT4gJyArIGVycik7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNiKCdObyBDYWNoZVJ1bGUgZGVmaW5lZCBmb3IgdGhpcyBpbnN0YW5jZSAnICsgX3RoaXMuaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmluc3RhbmNpYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmV2aXZlcik7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1hbmFnZXIgPSBuZXcgQ2FjaGVSdWxlTWFuYWdlcl8xLmRlZmF1bHQocGFyc2VkRGF0YSwgY29uZmlnLm9uX2V4aXN0aW5nX3JlZ2V4KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGF1bmNoU3Vic2NyaWJlcigpO1xuICAgICAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEluc3RhbmNlLnByb3RvdHlwZS5sYXVuY2hTdWJzY3JpYmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgc3Vic2NyaWJlciA9IHBvb2xfMS5SZWRpc1Bvb2wuZ2V0U3Vic2NyaWJlckNvbm5lY3Rpb24odGhpcy5pbnN0YW5jZU5hbWUpO1xuICAgICAgICBzdWJzY3JpYmVyLnN1YnNjcmliZSh0aGlzLmdldENoYW5uZWwoKSk7XG4gICAgICAgIHN1YnNjcmliZXIub24oJ21lc3NhZ2UnLCBmdW5jdGlvbiAoY2hhbm5lbCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdQVVNIRUQnKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub25QdWJsaXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldENoYW5uZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSArIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIENhY2hlRW5naW5lXzEuZGVmYXVsdC51cGRhdGVBbGxVcmxDYXRlZ29yeSh0aGlzLmluc3RhbmNlTmFtZSk7XG4gICAgICAgIHZhciByZWRpc0Nvbm4gPSBwb29sXzEuUmVkaXNQb29sLmdldENvbm5lY3Rpb24odGhpcy5pbnN0YW5jZU5hbWUpO1xuICAgICAgICB2YXIgc3RyaW5naWZpZWQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm1hbmFnZXIuZ2V0UnVsZXMoKSwgaGVscGVyc18xLmRlZmF1bHQuSlNPTlJlZ0V4cFJlcGxhY2VyLCAyKTtcbiAgICAgICAgcmVkaXNDb25uLmhzZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBzdHJpbmdpZmllZCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5SZWRpc0Vycm9yKCd3aGlsZSBwdWJsaXNoaW5nIGNvbmZpZyAnICsgc3RyaW5naWZpZWQsIGVycik7XG4gICAgICAgICAgICByZWRpc0Nvbm4ucHVibGlzaChfdGhpcy5nZXRDaGFubmVsKCksICdQVVNIRUQnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBJbnN0YW5jZS5wcm90b3R5cGUub25QdWJsaXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcmVkaXNDb25uID0gcG9vbF8xLlJlZGlzUG9vbC5nZXRDb25uZWN0aW9uKHRoaXMuaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgcmVkaXNDb25uLmhnZXQoaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCksIHRoaXMuaW5zdGFuY2VOYW1lLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkaXMgZXJyb3IgLSByZXRyaWV2aW5nICcgKyBoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQmlnIG1lc3MnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmV2aXZlcik7XG4gICAgICAgICAgICBfdGhpcy5tYW5hZ2VyLnVwZGF0ZVJ1bGVzKHBhcnNlZERhdGEpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIEluc3RhbmNlLnByb3RvdHlwZS5nZXRNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5hZ2VyO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldENvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldEluc3RhbmNlTmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VOYW1lO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmdldFJlZGlzQ29uZmlnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWRpc0NvbmZpZztcbiAgICB9O1xuICAgIEluc3RhbmNlLnByb3RvdHlwZS5pc0luc3RhbmNpYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2lhdGVkO1xuICAgIH07XG4gICAgSW5zdGFuY2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBvb2xfMS5SZWRpc1Bvb2wua2lsbCh0aGlzLmluc3RhbmNlTmFtZSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2lhdGVkID0gZmFsc2U7XG4gICAgfTtcbiAgICByZXR1cm4gSW5zdGFuY2U7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gSW5zdGFuY2U7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vdHMvaW5zdGFuY2UudHNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgaGVscGVyc18xID0gcmVxdWlyZShcIi4uL2hlbHBlcnNcIik7XG52YXIgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdzaW1wbGUtdXJsLWNhY2hlJyk7XG52YXIgQ2FjaGVSdWxlTWFuYWdlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVSdWxlTWFuYWdlcihjYWNoZVJ1bGVzLCBvbl9leGlzdGluZ19yZWdleCkge1xuICAgICAgICB0aGlzLmNhY2hlUnVsZXMgPSBjYWNoZVJ1bGVzO1xuICAgICAgICB0aGlzLm9uX2V4aXN0aW5nX3JlZ2V4ID0gb25fZXhpc3RpbmdfcmVnZXg7XG4gICAgfVxuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmFkZE1heEFnZVJ1bGUgPSBmdW5jdGlvbiAoZG9tYWluLCByZWdleCwgbWF4QWdlLCBpZ25vcmVRdWVyeSkge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChkb21haW4sIHJlZ2V4LCBtYXhBZ2UpO1xuICAgICAgICB2YXIgcmVnZXhSdWxlID0geyByZWdleDogcmVnZXgsIG1heEFnZTogbWF4QWdlLCBpZ25vcmVRdWVyeTogaWdub3JlUXVlcnkgPyBpZ25vcmVRdWVyeSA6IGZhbHNlIH07XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzTWF4QWdlUmVnZXhSdWxlKHJlZ2V4UnVsZSk7XG4gICAgICAgIHZhciBmb3VuZCA9IHRoaXMuZmluZFJlZ2V4KGRvbWFpbiwgcmVnZXhSdWxlKTtcbiAgICAgICAgdGhpcy5hZGQoZG9tYWluLCByZWdleFJ1bGUsICdtYXhBZ2UnLCBmb3VuZCk7XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5hZGROZXZlclJ1bGUgPSBmdW5jdGlvbiAoZG9tYWluLCByZWdleCwgaWdub3JlUXVlcnkpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQocmVnZXgpO1xuICAgICAgICB2YXIgcmVnZXhSdWxlID0geyByZWdleDogcmVnZXgsIGlnbm9yZVF1ZXJ5OiBpZ25vcmVRdWVyeSA/IGlnbm9yZVF1ZXJ5IDogZmFsc2UgfTtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNDb25maWdSZWdleFJ1bGUocmVnZXhSdWxlKTtcbiAgICAgICAgdmFyIGZvdW5kID0gdGhpcy5maW5kUmVnZXgoZG9tYWluLCByZWdleFJ1bGUpO1xuICAgICAgICB0aGlzLmFkZChkb21haW4sIHJlZ2V4UnVsZSwgJ25ldmVyJywgZm91bmQpO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuYWRkQWx3YXlzUnVsZSA9IGZ1bmN0aW9uIChkb21haW4sIHJlZ2V4LCBpZ25vcmVRdWVyeSkge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChyZWdleCk7XG4gICAgICAgIHZhciByZWdleFJ1bGUgPSB7IHJlZ2V4OiByZWdleCwgaWdub3JlUXVlcnk6IGlnbm9yZVF1ZXJ5ID8gaWdub3JlUXVlcnkgOiBmYWxzZSB9O1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc0NvbmZpZ1JlZ2V4UnVsZShyZWdleFJ1bGUpO1xuICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmZpbmRSZWdleChkb21haW4sIHJlZ2V4UnVsZSk7XG4gICAgICAgIHRoaXMuYWRkKGRvbWFpbiwgcmVnZXhSdWxlLCAnYWx3YXlzJywgZm91bmQpO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuZ2V0UnVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUnVsZXM7XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5zZXREZWZhdWx0ID0gZnVuY3Rpb24gKHN0cmF0ZWd5KSB7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzU3RyaW5nSW4oc3RyYXRlZ3ksIFsnYWx3YXlzJywgJ25ldmVyJ10pO1xuICAgICAgICB0aGlzLmNhY2hlUnVsZXMuZGVmYXVsdCA9IHN0cmF0ZWd5O1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlUnVsZSA9IGZ1bmN0aW9uIChkb21haW4sIHJ1bGUpIHtcbiAgICAgICAgaGVscGVyc18xLmRlZmF1bHQuaXNOb3RVbmRlZmluZWQocnVsZSk7XG4gICAgICAgIGhlbHBlcnNfMS5kZWZhdWx0LmlzQ29uZmlnUmVnZXhSdWxlKHJ1bGUpO1xuICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmZpbmRSZWdleChkb21haW4sIHJ1bGUpO1xuICAgICAgICBpZiAoZm91bmQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVSdWxlc1tmb3VuZC50eXBlXVtmb3VuZC5pbmRleF0ucnVsZXMuc3BsaWNlKGZvdW5kLnN1YkluZGV4LCAxKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNhY2hlUnVsZXNbZm91bmQudHlwZV1bZm91bmQuaW5kZXhdLnJ1bGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVSdWxlc1tmb3VuZC50eXBlXS5zcGxpY2UoZm91bmQuaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGxNYXhBZ2VSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYWNoZVJ1bGVzLm1heEFnZSA9IFtdO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUucmVtb3ZlQWxsTmV2ZXJSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYWNoZVJ1bGVzLm5ldmVyID0gW107XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5yZW1vdmVBbGxBbHdheXNSdWxlcyA9IGZ1bmN0aW9uIChkb21haW4pIHtcbiAgICAgICAgdGhpcy5jYWNoZVJ1bGVzLmFsd2F5cyA9IFtdO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUudXBkYXRlUnVsZXMgPSBmdW5jdGlvbiAoY2FjaGVSdWxlcykge1xuICAgICAgICB0aGlzLmNhY2hlUnVsZXMgPSBjYWNoZVJ1bGVzO1xuICAgIH07XG4gICAgQ2FjaGVSdWxlTWFuYWdlci5wcm90b3R5cGUuY2hlY2tEb21haW5NYXRjaCA9IGZ1bmN0aW9uIChzdG9yZWQsIGlucHV0KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmVkID09PSBpbnB1dDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdG9yZWQgaW5zdGFuY2VvZiBSZWdFeHAgJiYgaW5wdXQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJldHVybiBoZWxwZXJzXzEuZGVmYXVsdC5TYW1lUmVnZXgoc3RvcmVkLCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENhY2hlUnVsZU1hbmFnZXIucHJvdG90eXBlLmZpbmRSZWdleCA9IGZ1bmN0aW9uIChkb21haW4sIHJ1bGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGluZm8gPSBudWxsLCBpbmRleCwgc3ViSW5kZXg7XG4gICAgICAgIFsnYWx3YXlzJywgJ25ldmVyJywgJ21heEFnZSddLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IF90aGlzLmNhY2hlUnVsZXNbdHlwZV0ubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmNoZWNrRG9tYWluTWF0Y2goX3RoaXMuY2FjaGVSdWxlc1t0eXBlXVtpbmRleF0uZG9tYWluLCBkb21haW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoc3ViSW5kZXggPSAwOyBzdWJJbmRleCA8IF90aGlzLmNhY2hlUnVsZXNbdHlwZV1baW5kZXhdLnJ1bGVzLmxlbmd0aDsgc3ViSW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhlbHBlcnNfMS5kZWZhdWx0LlNhbWVSZWdleChydWxlLnJlZ2V4LCBfdGhpcy5jYWNoZVJ1bGVzW3R5cGVdW2luZGV4XS5ydWxlc1tzdWJJbmRleF0ucmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mbyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJJbmRleDogc3ViSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZm87XG4gICAgfTtcbiAgICBDYWNoZVJ1bGVNYW5hZ2VyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZG9tYWluLCBydWxlLCB3aGVyZSwgZm91bmQpIHtcbiAgICAgICAgZGVidWcoJ2FkZGluZyBydWxlICcsIGRvbWFpbiwgcnVsZSwgd2hlcmUsIGZvdW5kKTtcbiAgICAgICAgZGVidWcoJ2JlZm9yZTogJywgdGhpcy5jYWNoZVJ1bGVzKTtcbiAgICAgICAgaWYgKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMub25fZXhpc3RpbmdfcmVnZXgpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdpZ25vcmUnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAncmVwbGFjZSc6XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnKCdyZXBsYWNpbmc6ICcsIHRoaXMuY2FjaGVSdWxlc1tmb3VuZC50eXBlXVtmb3VuZC5pbmRleF0ucnVsZXMsIGZvdW5kLnN1YkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZVJ1bGVzW2ZvdW5kLnR5cGVdW2ZvdW5kLmluZGV4XS5ydWxlcy5zcGxpY2UoZm91bmQuc3ViSW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQWRkaW5nIGEgbWF4QWdlIHJlZ2V4IHRoYXQgaXMgYWxyZWFkeSBkZWZpbmVkIGhlcmU6ICcgKyBKU09OLnBhcnNlKGZvdW5kKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvdW5kICE9PSBudWxsICYmIGZvdW5kLnR5cGUgPT09IHdoZXJlKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlUnVsZXNbd2hlcmVdW2ZvdW5kLmluZGV4XS5ydWxlcy5wdXNoKHJ1bGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGluZGV4MnVwZGF0ZSA9IHZvaWQgMCwgaW5kZXggPSB2b2lkIDA7XG4gICAgICAgICAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmNhY2hlUnVsZXNbd2hlcmVdLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRG9tYWluTWF0Y2godGhpcy5jYWNoZVJ1bGVzW3doZXJlXVtpbmRleF0uZG9tYWluLCBkb21haW4pKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4MnVwZGF0ZSA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5kZXgydXBkYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGRlYnVnKCdBIGRvbWFpbiBhbHJlYWR5IGV4aXN0cywgc28gcHVzaW5nIHJ1bGVzIGF0IGluZGV4ICcsIGluZGV4MnVwZGF0ZSwgdGhpcy5jYWNoZVJ1bGVzW3doZXJlXVtpbmRleDJ1cGRhdGVdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlUnVsZXNbd2hlcmVdW2luZGV4MnVwZGF0ZV0ucnVsZXMucHVzaChydWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVSdWxlc1t3aGVyZV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgICAgICAgICAgICAgICBydWxlczogW3J1bGVdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH07XG4gICAgcmV0dXJuIENhY2hlUnVsZU1hbmFnZXI7XG59KCkpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FjaGVSdWxlTWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90cy9ydWxlcy9DYWNoZVJ1bGVNYW5hZ2VyLnRzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIlwidXNlIHN0cmljdFwiO1xudmFyIHBvb2xfMSA9IHJlcXVpcmUoXCIuLi9yZWRpcy9wb29sXCIpO1xudmFyIGhlbHBlcnNfMSA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzXCIpO1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnc2ltcGxlLXVybC1jYWNoZScpO1xudmFyIENhY2hlUnVsZXNDcmVhdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDYWNoZVJ1bGVzQ3JlYXRvcihpbnN0YW5jZU5hbWUsIHJlZGlzQ29uZmlnLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmluc3RhbmNlTmFtZSA9IGluc3RhbmNlTmFtZTtcbiAgICAgICAgdGhpcy5yZWRpc0NvbmZpZyA9IHJlZGlzQ29uZmlnO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChpbnN0YW5jZU5hbWUsIHJlZGlzQ29uZmlnLCBjYik7XG4gICAgICAgIGRlYnVnKCdjb25uZWN0aW5nIHRvIHJlZGlzJyk7XG4gICAgICAgIHBvb2xfMS5SZWRpc1Bvb2wuY29ubmVjdChpbnN0YW5jZU5hbWUsIHJlZGlzQ29uZmlnLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYignRXJyb3IgY29ubmVjdGluZyB0byBSRURJUycpO1xuICAgICAgICAgICAgX3RoaXMuX2Nvbm4gPSBwb29sXzEuUmVkaXNQb29sLmdldENvbm5lY3Rpb24oaW5zdGFuY2VOYW1lKTtcbiAgICAgICAgICAgIGNiKG51bGwsIF90aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIENhY2hlUnVsZXNDcmVhdG9yLnByb3RvdHlwZS5pbXBvcnRSdWxlcyA9IGZ1bmN0aW9uIChydWxlcywgb3ZlcndyaXRlLCBjYikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChydWxlcywgY2IpO1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC52YWxpZGF0ZUNhY2hlQ29uZmlnKHJ1bGVzKTtcbiAgICAgICAgdGhpcy5fY29ubi5oZ2V0KGhlbHBlcnNfMS5kZWZhdWx0LmdldENvbmZpZ0tleSgpLCB0aGlzLmluc3RhbmNlTmFtZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKGVycilcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ1JlZGlzIGVycm9yIC0gcmV0cmlldmluZyAnICsgaGVscGVyc18xLmRlZmF1bHQuZ2V0Q29uZmlnS2V5KCkgKyAnOiAnICsgZXJyKTtcbiAgICAgICAgICAgIGlmIChkYXRhICE9PSBudWxsICYmICFvdmVyd3JpdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoJ0EgQ2FjaGVSdWxlIGRlZmluaXRpb24gYWxyZWFkeSBleGlzdHMgZm9yIHRoaXMgaW5zdGFuY2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KHJ1bGVzLCBoZWxwZXJzXzEuZGVmYXVsdC5KU09OUmVnRXhwUmVwbGFjZXIsIDIpO1xuICAgICAgICAgICAgX3RoaXMuX2Nvbm4uaHNldChoZWxwZXJzXzEuZGVmYXVsdC5nZXRDb25maWdLZXkoKSwgX3RoaXMuaW5zdGFuY2VOYW1lLCBzdHJpbmdpZmllZCwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpXG4gICAgICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVSdWxlc0NyZWF0b3I7XG59KCkpO1xudmFyIENhY2hlQ3JlYXRvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ2FjaGVDcmVhdG9yKCkge1xuICAgIH1cbiAgICBDYWNoZUNyZWF0b3IuY3JlYXRlQ2FjaGUgPSBmdW5jdGlvbiAoaW5zdGFuY2VOYW1lLCBmb3JjZSwgcmVkaXNDb25maWcsIHJ1bGVzLCBjYikge1xuICAgICAgICBoZWxwZXJzXzEuZGVmYXVsdC5pc05vdFVuZGVmaW5lZChpbnN0YW5jZU5hbWUsIGZvcmNlLCByZWRpc0NvbmZpZywgcnVsZXMsIGNiKTtcbiAgICAgICAgbmV3IENhY2hlUnVsZXNDcmVhdG9yKGluc3RhbmNlTmFtZSwgcmVkaXNDb25maWcsIGZ1bmN0aW9uIChlcnIsIGNyZWF0b3IpIHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNyZWF0b3IuaW1wb3J0UnVsZXMocnVsZXMsIGZvcmNlLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FjaGVDcmVhdG9yO1xufSgpKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmYXVsdCA9IENhY2hlQ3JlYXRvcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi90cy9ydWxlcy9DYWNoZVJ1bGVzQ3JlYXRvci50c1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9