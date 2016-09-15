# simple-cache

This is a cache library used to cache URL and HTML, that supports : 

- File system storage
- Written in typescript (1.8), compiled with webpack
- Redis storage
- Cache rules definitions (regexes)
- TTL per URLs (regexes)

[![Build Status](https://travis-ci.org/a-lucas/simple-cache.svg?branch=master)](https://travis-ci.org/a-lucas/simple-cache)

[![Coverage Status](https://coveralls.io/repos/github/a-lucas/simple-cache/badge.svg?branch=master)](https://coveralls.io/github/a-lucas/simple-cache?branch=master)

# API documentation

You can find it under the folder `doc/index.html`, and it's been generated with 


# Installation

```
npm install --save simple-cache
```

# Usage

So far, we support two storage engines : file system, and redis.

The usage accross both storage engines is the same, only the storage config file differs.


```javascript
var simpleCache = require('simple-cache');
var storageConfig = require('./config'); // get your config file
var cacheRules = require('./cacheRules'); //get your cache rule definition file


var cacheEngine = new simpleCache(storageConfig, cacheRules);

var url = '/someURL.html';
var html = '<b>I ama content</b>';

var cacheUrl = cacheEngine.url(url);

// is Cached?

cacheUrl.isCached().then(function(res) {
    console.log(res); // -> false
});

// cache it

cacheUrl.cache(html).then(function(res) {
    console.log(res); // -> true
});

// is Cached?

cacheUrl.isCached().then(function(res) {
    console.log(res); // -> true
});

// Get content

cacheUrl.getUrl().then(function(res) {
    console.log(res); // -> <b>I ama content</b>
});

// remove it

cacheUrl.removeUrl().then(function(res) {
    console.log(res); // -> true
});


```

# Config Files

## Regex Rules

This is an object describe which URL will be cached, which URLs won't be cached, and which ones will have a ttl expiration.

This is the same object, independently of the storage engine used.

An example worth 1000 words, so here is one : 

```javascript

exports.cacheConfig = {
    // Will cache all URL starting with /posts/ and ending with html for 24 hours
    cacheMaxAge: [ 
        {
            regex: /posts\/.*html$/,  
            maxAge: 3600
        }
    ],
    // Will cache about-use.html, contact-us.html and /prices.html indefinitively
    cacheAlways: [  
        {
            regex: /about-us.html$/, 
            regex: /contact-us.html$/,
            regex: /prices.html$/
        }
    ],
    // will never cache the url /sitemaps.html
    cacheNever: [ 
        {
            regex: /sitemaps.html$/
        }
    ], 
    // If no URL is matched against these rules, then the default is to never cache it. can be 'never' or 'always'
    default: 'never' 
};

```

## FileStorage config

The simplest config ou there

```javascript

export.fileStorageCOnfig = {
    type: 'file', 
    dir: '/var/cache'
}

```

## Redis Stoarge config

A bit more complex. The library node_redis is used here, so a valid redis node config fle is needed. You can see it here : https://github.com/NodeRedis/node_redis 

As an example : 

```javascript

export.redisStorageConfig = {
    type: 'redis',
    type: 'redis',
    host: '127.0.0.1',
    port: 6379,
    socket_keepalive: true
}

```


## Adding file Storages

It is easy with typescript.

###     Define a new storage file, for example `mongoStorage.ts`

```javascript

export default class RedisStorage extends CacheCategory implements CacheStorage{
    // define all required methods from the CacheStorage interface 
}

```

And compile it with : `npm run build`

###     Add a test file `mongooStorage.spec.js`
 
```javascript

var simpleCache = require('./../dist/simple-cache.min');

var common = require('./helper/common');

var config = {
    type: 'mongoo',
    ... other config values here
};

var urlConfig = {
    cacheMaxAge: [
        {
            regex: /maxAge.html$/,
            maxAge: 1
        }
    ],
    cacheAlways: [
        {
            regex: /always.html$/
        }
    ],
    cacheNever: [
        {
            regex: /never.html$/
        }
    ],
    default: 'never'
};

var mongooCache = new simpleCache(config, urlConfig);

describe('The mongoStorage', function () {
    common(mongoCache);
});
```

and make sure the test passes with 

`npm test`

###     Do the same with `mongoStorageWeirdUrl.js`

###     Send me oru Pull Request