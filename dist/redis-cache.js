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
	        ['always', 'never', 'maxAge'].forEach(function (type) {
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
	        this.set = function (html, force) {
	            helpers_1.default.isStringDefined(html);
	            helpers_1.default.isOptionalBoolean(force);
	            if (typeof force === 'undefined') {
	                force = false;
	            }
	            return _this._storagePromise.set(_this.getDomain(), _this.getUrl(), html, _this.getCategory(), _this.getTTL(), force);
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
	        this.set = function (html, force, cb) {
	            helpers_1.default.isStringDefined(html);
	            helpers_1.default.isBoolean(force);
	            _this._storageCB.set(_this.getDomain(), _this.getUrl(), html, _this.getCategory(), _this.getTTL(), force, cb);
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
	    RedisStoragePromise.prototype.set = function (domain, url, value, category, ttl, force) {
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
	            _this._conn.get(_this.getUrlKey(domain, url), function (err, timestamp) {
	                if (err)
	                    return cb(err);
	                if (timestamp === null) {
	                    _this._conn.hdel(_this.getDomainHashKey(domain), _this.getUrlKey(domain, url), function (err) {
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
	    RedisStorageCB.prototype.set = function (domain, url, value, category, ttl, force, cb) {
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
	    RedisStorageCB.prototype.getDomainHashKey = function (domain) {
	        return this.hashKey + ':' + domain;
	    };
	    RedisStorageCB.prototype.store = function (domain, url, value, ttl, force, cb) {
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
	                    if (exists === 0) {
	                        return cb(null, true);
	                    }
	                    _this._conn.get(_this.getUrlKey(domain, url), function (err, result) {
	                        if (err) {
	                            return cb(err);
	                        }
	                        if (result === null) {
	                            _this._conn.set(_this.getUrlKey(domain, url), Date.now(), function (err) {
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
	                        }
	                        else if (force === true) {
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
	                online: false,
	                lastError: null,
	                warnings: []
	            };
	            RedisPool._pool[instanceName] = redis.createClient(config);
	            RedisPool._sub[instanceName] = redis.createClient(config);
	            var nb = 0;
	            var nbErrors = 0;
	            RedisPool._pool[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online = true;
	                debug('redis connected');
	                nb++;
	                if (nb === 2) {
	                    debug('POOL CONNECTED 2 conns');
	                    cb(null);
	                }
	            });
	            RedisPool._sub[instanceName].on('connect', function () {
	                RedisPool._status[instanceName].online = true;
	                debug('redis connected');
	                nb++;
	                if (nb === 2) {
	                    debug('POOL CONNECTED 2 conns');
	                    cb(null);
	                }
	            });
	            RedisPool._pool[instanceName].on('error', function (e) {
	                debug(e);
	                RedisPool._status[instanceName].lastError = e;
	                nbErrors++;
	                if (nbErrors === 1) {
	                    cb(e);
	                }
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
	            RedisPool._sub[instanceName].on('error', function (e) {
	                debug(e);
	                RedisPool._status[instanceName].lastError = e;
	                nbErrors++;
	                if (nbErrors === 1) {
	                    cb(e);
	                }
	            });
	            RedisPool._sub[instanceName].on('end', function () {
	                RedisPool._sub[instanceName] = null;
	                RedisPool._status[instanceName].online = false;
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
	            cb();
	        }
	    };
	    RedisPool.kill = function (instanceName) {
	        if (RedisPool._status[instanceName].online === true) {
	            RedisPool._pool[instanceName].end();
	            RedisPool._sub[instanceName].end();
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
	                cb('Error connecting to REDIS: ' + err);
	            var redisConn = pool_1.RedisPool.getConnection(instanceName);
	            redisConn.hget(helpers_1.default.getConfigKey(), _this.instanceName, function (err, data) {
	                if (err)
	                    cb('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ' -> ' + err);
	                if (data === null) {
	                    cb('No CacheRule defined for this instance ' + _this.instanceName);
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
	        this.cacheRules.maxAge = {};
	    };
	    CacheRuleManager.prototype.removeAllNeverRules = function () {
	        this.cacheRules.never = {};
	    };
	    CacheRuleManager.prototype.removeAllAlwaysRules = function (domain) {
	        this.cacheRules.always = {};
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
	var CacheRulesCreator = (function () {
	    function CacheRulesCreator(instanceName, redisConfig, cb) {
	        var _this = this;
	        this.instanceName = instanceName;
	        this.redisConfig = redisConfig;
	        helpers_1.default.isNotUndefined(instanceName, redisConfig, cb);
	        pool_1.RedisPool.connect(instanceName, redisConfig, function (err) {
	            if (err)
	                cb('Error connecting to REDIS');
	            _this._conn = pool_1.RedisPool.getConnection(instanceName);
	            cb(null);
	        });
	    }
	    CacheRulesCreator.prototype.importRules = function (rules, cb) {
	        var _this = this;
	        helpers_1.default.isNotUndefined(rules, cb);
	        helpers_1.default.validateCacheConfig(rules);
	        this._conn.hget(helpers_1.default.getConfigKey(), this.instanceName, function (err, data) {
	            if (err)
	                cb('Redis error - retrieving ' + helpers_1.default.getConfigKey() + ': ' + err);
	            if (data !== null) {
	                cb('A CacheRule definition already exists for this instance');
	            }
	            else {
	                var stringified = JSON.stringify(rules, helpers_1.default.JSONRegExpReplacer, 2);
	                _this._conn.hset(helpers_1.default.getConfigKey(), _this.instanceName, stringified, function (err) {
	                    if (err)
	                        cb(err);
	                    cb(null);
	                });
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