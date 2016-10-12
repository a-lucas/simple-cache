### Bugs

#### ignoreQuery
Some conflicts may arise with the ignoreQuery

for example : 


/aaa?key1=value matches /aaa/ with ignoreQuery and will store the key /aaa?key1=value
/aaa?key2=value matches /aaa/ with ignoreQuery and will store the key /aaa?key2=value

In scenario where cache is canceled with 
/aaa?timestamp=12345 , the url will be cached many times blowing up storage


#### publish

Must go trough all existing cached URL and clear the urls that shouldnt be cached anymore otherwise, get() & has() will return the wrong result



#### testing

- Test validation errors
- Test the redis pool
- test the redis call back errors


- coverage
    - cacheEngine 
        - constructor, not instanciated exception
        - getInstanceName
    - RedisSToragePromise
        - clearCache calback err
        - clearDomain callback error
        - getCachedDomains callback error
        - getCachedURLs callback error
        - destroy()
        - has cb error
        - set cb error
        - delete cb error
        - get
            - connection error
            - timestamp verification
    - RedisStorageCB
        - store
    - Redis pool
        - onError
        - onEnd
        - onWarning
        - kill
    - Instance
        - default config value
        - redis cb error
        - publish cb werror
        - getRedisConfig
    - CacheRuleManager
        - AddMaxAgeRule
        - removeRule
        - remove all(MaxAge/never/always)Rules
        - add (When config value is invalid)
    - CacheRule Creator
        - Redis cb error
        - import rule: redis cb error
        

#### fixes

- Fix the redis pool

#### todo

- regexes per domain too
- ignore query param

never: [
    domain: /aaa/,
    rules: [
        {
            regex: /bbb/,
            ignore_query: true
        }
    ]
    
]






