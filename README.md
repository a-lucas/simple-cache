# Redis Url Cache [![Build Status](https://travis-ci.org/a-lucas/redis-url-cache.svg?branch=master)](https://travis-ci.org/a-lucas/redis-url-cache)  [![codecov](https://codecov.io/gh/a-lucas/redis-url-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/a-lucas/redis-url-cache)


Conditionally cache your URL's content on REDIS with RegExp. Also supports cache instance sharing and isolation.


<!--## API documentation
https://a-lucas.github.io/redis-url-cache
-->

## Installation


```bash
npm install redis-url-cache
```

## API

- **CacheEngine**
    - methods
        - [constructor](#constructor)
        - [url()](#url)
        - [clearDomain()](#cleardomain)
        - [clearInstance()](#clearinstance)
        - [getStoredHostnames()](#getstoredhostnames)
        - [getStoredURLs()](#getstoredurls)
    - static properties
        - [helpers](#helpers)
    
- **CacheStorage**
    - setters/getters
        - [delete()](#delete)
        - [get()](#get)
        - [has()](#has)
        - [set()](#set)
    - methods
        - [getCategory()](#getcategory)
        - [getDomain()](#getdomain)
        - [getInstanceName()](#getinstancename)
        - [getStorageType()](#getstoragetype)
        - [getUrl()](#geturl)
- **Configuration**
    - [Cache config](#cache-config)
    - [Redis storage config](#redis-storage-config)
    

## Cache Engine

### methods

#### constructor


```typescript
constructor( defaultDomain: string, instanceName: string, storageConfig: Object, cacheConfig: Object)
```

**defaultDomain** Every URL that miss a hostname will get classified under this domain

**instanceName** The isolated instance where this cacheEngine will store urls.
If another cacheEngine has the same storage type and the same instance name, they will share the pool.

**storageConfig**  [Redis Storage Config](#redis-storage-config)
Defines how & where url content is stored
 
**cacheConfig** [Cache config](#cache-config)
Supports TTL and inclusion/exclusion for any URL rules you need
 
Example: 

```javascript

var CacheEngine = require('redis-url-cache');

var engine1 = new CachEngine('http://localhost:3333', 'I1', {host: '127.0.0.1',port: 6379}, cacheRules); 
var engine2 = new CachEngine('http://localhost:4444', 'I1', {host: '127.0.0.1',port: 6379}, cacheRules);
var engine3 = new CachEngine('http://localhost:5555', 'I2', {host: '127.0.0.1',port: 6379}, cacheRules);

// At this stage, engine1 and engine2 share the same pool.

engine1.url('http://a.com/index.html').set('some content', {}); 
// resolve(true)

engine2.url('http://b.com/index.html').set('some content', {});
// resolve(true)

engine1.url('http://b.com/index.html').set('some content', {}); 
// resolves(false) - already cached

engine3.url('http://a.com/index.html').set('some content', {});
// resolve(true)

engine1.url('http://b.com/index.html').get() 
//resolve(true) -> shared pool with engine1 

engine3.url('http://b.com/index.html').get()
// reject(false) -> not set

```

#### url


```typescript
url(url: string): CacheStorage
```

**url**
Initialize a new [CacheStorage](#cachestorage) instance ready to be [get()](#get), [set()](#set), [delete()](#delete) and [has()](#has).

#### clearDomain


```typescript
clearDomain(domain: string): Promise<boolean>
```

Delete all the cached urls stored within this instance under the specified domain.


#### clearInstance


```typescript
clearInstance(): Promise<boolean>
```

Removes all the cached URLs for all domains for this instance.

#### getStoredHostnames


```typescript
getAllCachedURL(): Promise<string[]>
```

Retrieves an array of all the domains cached.
 
example: 

```javascript
var CacheEngine = require('redis-url-cache');

var engine1 = new CachEngine('http://localhost:3333', 'I1', {host: '127.0.0.1',port: 6379}, cacheRules); 

engine1.url('http://a.com/index.html').set('content').then( ... )
engine1.url('http://b.com/index.html').set('content').then( ... )

CacheEngine.getStoredHostnames().then(function(results) {
    console.log(results);
    // ['http://a.com', 'http://b.com']
});
```

**domain** if none provided, then the default domain will be used

#### getStoredURLs


```typescript
getCachedDomains(idomain:string): Promise<string[]>
```

Get the array of cached URLs associated with this domain & instance

**domain** All the stored URLs retrived had this domain prepended 

example:


```javascript
var CacheEngine = require('redis-url-cache');

var engine1 = new CachEngine('http://localhost:3333', 'I1', {host: '127.0.0.1',port: 6379}, cacheRules); 

engine1.url('http://a.com/index.html').set('content').then( ... )
engine1.url('http://a.com/about.html').set('content').then( ... )

CacheEngine.getStoredURLs().then(function(results) {
    console.log(results);
    // ['/index.html', '/about.html']
});
```

### Static helper


The methods used to validate the CacheConfig and the RedisStorageConfig objects are exposed statically.

They all throw a`TypeError` when invalid

#### validateCacheConfig()


```typescript
validateCacheConfig(config: CacheRules)
```

#### validateRedisStorageConfig()


```typescript
validateRedisStorageConfig(config: RedisStorageConfig)
```

## CacheStorage

### getters & setters

#### delete


```typescript
delete(): Promise<boolean>
```

Resolve to true if the url has been suppressed, false if the url wasn't cached
Reject an Error if any

#### get


```typescript
get(): Promise<IGetObjects>
```

Resolve to the stored url's informations. 
Reject if the url wasn't cached

The format of the response is :
 
```typescript
interface IGetResults {
    content: string,
    createdOn: number,
    extra: Object
}
```


#### has


```typescript
has(): Promise<boolean>
```

Resolve to true if the url is cached, false if the url is not cached, rejected on error

#### set


```typescript
set(content: string , extra: Object [, force: boolean]) : Promise<boolean>
```

Resolve to true if the url has been cached successfully, 
Rejects false if 
    - the url matches the `never` rule.
    - The url has already been cached
Rejects on Error

**html**: the content of the url to be cached, must be UTF-8

**extra**: A JSON object taht contans information that you want to associate with this URL.

**force**: 
    - Actualize the TTL for maxAge already cached urls
    - Force the caching for url matching the `never` rule.
     
### methods

#### getCategory()


Returns the url's internal category name. `always`, `maxAge` or `never`

#### getDomain()


Returns the domain which the URL has been stored with.

```javascript

var url = CacheEngine.url('http://a.com/index.html');
url.set('content').then()

url.getDomain() // http://a.com

```

#### getInstanceName()


The instanceName set when this url has been stored

```javascript
var CacheEngine = require('redis-url-cache');

var engine1 = new CachEngine('http://localhost:3333', 'I1', {host: '127.0.0.1',port: 6379}, cacheRules); 
var engine2 = new CachEngine('http://localhost:3333', 'I2', {host: '127.0.0.1',port: 6379}, cacheRules); 

var url1 = engine1.url('http://a.com/index.html')
var url2 = engine1.url('http://a.com/about.html')

url1.getInstanceName() // I1
url2.getInstanceName() // I2

```

#### getStorageType()


Same as `getInstanceName()`, will return `redis`

## Storage engines


So far, only redis is supported, but it is not hard to add more, PR are welcome.

Initially, FileSystem storage was supported, but it has been removed for several reasons : 

- Performances issues.
- Huge complexity issues when dealing with large sets of data, specially when `getStoredURLs()` is called or if a power outage happens.
 
> it had to replay the whole Regex test against each stored URL, and then make a stat on the file in case it matches a maxAge rule to check the creation time.

But if you need to add another storage engine, like mongo for example, the code is designed in a way were the `CacheStorage` and `CacheEngine` APIs are completly storage independent.

## Config Files

### Cache Config


This is an object describing which URL will be cached, which URLs won't be cached, and which ones will have a ttl expiration.

This is the same object, independently of the storage engine used.

An example worth 1000 words : 

```javascript

exports.cacheConfig = {
    // Will cache all URL starting with /posts/ and ending with html for 24 hours for mydomain.com
    cacheMaxAge: [
        
        {
            domain: 'mydomain.com',
            rules; [
                {
                    regex: /^\/posts.*html$/,  
                    maxAge: 3600    
                }
            ]
            
        }
    ],
    // Will cache about-us.html, contact-us.html and /prices.html indefinitively for mydomain.com, and same for any hostname containing `cdn`.
    cacheAlways: [
        {
            domain: /mydomain\.com/,
            rules: [
                {regex: /^about-us\.html$/},
                {regex: /^contact-us\.html$/},
                {regex: /^prices\.html$/}    
            ]
            
        },
        {
            domain: /cnd/,
            rules: [ { regex: /.*/ } ]
        }
    ],
    // will never cache sockets
    cacheNever: [ 
        {   
            domain: /.*/,
            rules: [
                {regex: /socket/}
            ]           
        }
    ], 
    // If no URL is matched against these rules, then the default is to never cache it. can be 'never' or 'always'
    default: 'never' 
};

```

### Redis storage config


A bit more complex. The library [noderedis](https://github.com/NodeRedis/node_redis ) is used here, so a valid redis node config file is needed. 

example : 

```javascript

export.redisStorageConfig = {
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
}

```


<!--
## Adding Storages

It is easy with typescript.

###     Define a new storage file, for example `mongoStorage.ts`

```typescript

export default class RedisStorage extends CacheCategory implements CacheStorage{
    // define all required methods from the CacheStorage interface 
}

```

And compile it with : `npm run build`

###     Add a test file `mongooStorage.spec.js`
 
```javascript

var simpleCache = require('./../dist/simple-cache.min').CacheEngine;
var common = require('./helper/common');
var cacheRules = require('./helper/cacheRules');

describe('The fileStorage', function() {

    var storageConfig = {
        type: 'mongo',
        ... other config values here
    };

    var mongoCache = new simpleCache(storageConfig, cacheRules);

    common(mongoCache);

});
```

and make sure the test passes with 

`npm test`

If you need to debug, you can use `debug` extensively with: 

```bash
DEBUG=redis-url-cache-FS,redis-url-cache-REDIS npm test
```

###     Do the same with `mongoStorageWeirdUrl.js`

##      Update te index.d.ts to file include your new typing definitions

###     Send me your Pull Request

-->