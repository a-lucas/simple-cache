import {StorageInstanceCB} from "./../interfaces";
import {RedisPool} from './pool'
import * as debg from 'debug';
import Instance from "../instance";
const debug = debg('simple-url-cache-REDIS');

export default class RedisStorageInstanceCB extends StorageInstanceCB {

    private _conn: RedisPool;
    private hashKey;
    public type = 'cb';

    constructor(private instance: Instance) {
        super();
        this._conn = new RedisPool(instance.getRedisConfig());
        this.hashKey = 'simple-url-cache:' + this.instance.getInstanceName();
    }

    clearCache(cb:Function):void {
        const client = this._conn.getConnection();
        const batch = client.batch();

        client.hkeys(this.hashKey, (err, domains) => {
            debug(err);
            if (err) return cb(err);

            if (domains.length === 0) {
                return cb(null, true);
            }
            var nb = 0;

            domains.forEach(domain => {
                batch.del(this.getDomainHashKey(domain));
                batch.hdel(this.hashKey, domain);
                client.hkeys(this.getDomainHashKey(domain), (err, keys) => {
                    debug('keys = ', keys);
                    keys.forEach(key => {
                        batch.del(this.getUrlKey(domain, key));
                    });
                    nb++;
                    if (nb === domains.length) {
                        batch.exec(err => {
                            debug(err);
                            if (err) return cb(err);
                            return cb(null, true);
                        });
                    }
                });
            });
        });

    }

    clearDomain(domain:string, cb:Function):void {

        const client = this._conn.getConnection();
        //debug('Clear all cache called');

        client.hdel(this.hashKey, domain, (err) => {
            if (err) return cb(err);
            client.hkeys(this.getDomainHashKey(domain), (err, urls) => {
                //debug('getting keys for ', this.getDomainHashKey(domain), urls);
                if (urls.length === 0) {
                    return cb(null, true);
                }

                let nb = 0;
                urls.forEach(url => {
                    //debug('Deleting key ', this.getUrlKey(domain, url));

                    this.delete(domain, url, null, null, (err) => {
                        if (err) return cb(err);
                        nb++;
                        if (nb === urls.length) {
                            cb(null, true);
                        }
                    });
                });
            });
        });

    }

    getCachedDomains(cb:Function):void {
        //debug('getAllCachedDomains called');
        this._conn.getConnection().hkeys(this.hashKey, (err, results) => {
            if (err) return cb(err);
            //debug('hkeys() ', this.hashKey, results);
            return cb(null, results);
        });
    }

    getCachedURLs(domain:string, cb:Function): void {
        const client = this._conn.getConnection();
        var cachedUrls = [];

        client.hkeys(this.getDomainHashKey(domain), (err, urls) => {
            if (err) return cb(err);
            if (urls.length === 0) {
                return cb(null, cachedUrls);
            }

            //debug('found these urls in ', this.getDomainHashKey(domain), urls);
            let nb = 0;
            urls.forEach(url => {

                client.get(this.getUrlKey(domain, url), (err, data) => {
                    if (err) return cb(err);
                    //debug('for url, got content ', url, data);
                    if (data !== null) {
                        cachedUrls.push(url);
                        nb++;
                        if (nb === urls.length) {
                            return cb(null, cachedUrls);
                        }
                    } else {
                        client.hdel(this.getDomainHashKey(domain), url, err => {
                            if (err) return cb(err);
                            nb++;
                            if (nb === urls.length) {
                                return cb(null, cachedUrls);
                            }
                        });
                    }
                });

            });
        });
    }

    /**
     *
     * DEL domain:instance:key
     * HMDEL domain:instance key
     *
     */
    delete(domain:string, url:string, category, ttl,  cb):void {
        //debug('removing url cache: ', domain, url);
        const client = this._conn.getConnection();
        this.has(domain, url, category, ttl, (err, isCached) => {
            if (!isCached) {
                return cb('url is not cached');
            } else {
                client.del(this.getUrlKey(domain, url), (err) => {
                    if (err) {
                        //debug('REDIS ERROR, ', err);
                        return cb(err);
                    }
                    //debug('DELETING HASH ', this.getDomainHashKey(domain));

                    client.hdel(this.getDomainHashKey(domain), url, (err) => {
                        if (err) {
                            //debug('REDIS ERROR', err);
                            return cb(err);
                        }
                        return cb(null, true);
                    });
                });
            }
        });
    }

    destroy() {
        this._conn.kill();
    }

    /**
     * This is how internally stuff are trieved in REDIS
     *
     * HMGET domain:instance key
     * -> if not set, not cached
     * -> if set
     *      GET domain:instance:key
     *      -> if set, cached
     *      -> if not set, not cached
     *          HMDEL domain:instance key
     */
    get(domain: string, url: string, category, ttl, cb:Function):void {
        //debug('Retrieving url cache: ', domain, url);

        const client = this._conn.getConnection();

        client.hget(this.getDomainHashKey(domain), url, (err, content) => {
            if (err) return cb(err);
            if (content === null) {
                return cb('url not cached');
            }

            client.get(this.getUrlKey(domain, url), (err, timestamp) => {
                if (err) return cb(err);
                if (timestamp === null) {
                    //todo->delete
                    client.hdel(this.getDomainHashKey(domain), this.getUrlKey(domain, url), (err) => {
                        if (err) return cb(err);
                        return cb('url not cached - cleaning timestamp informations');
                    });
                } else {
                    return cb(null, content);
                }
            });
        });
    }

    /**
     * GET domain:instance:key
     *  -> if not set
     *      HDEL domain:instance key
     */
    has(domain, url, category, ttl,  cb:Function):void {

        const client = this._conn.getConnection();
        client.get(this.getUrlKey(domain, url), (err, data) => {
            if (err) {
                debug('Error while querying is cached on redis: ', domain, url, err);
                return cb(err);
            } else {
                let isCached = data !== null;
                //debug('HAS, key ', this.getUrlKey(domain, url), 'is cached? ', isCached);
                if (!isCached) {
                    client.hdel(this.getDomainHashKey(domain), url, (err) => {
                        //debug('hdel executed', this.getDomainHashKey(domain), url);
                        if (err) return cb(err);
                        return cb(null, false);
                    });
                } else {
                    return cb(null, true);
                }
            }
        });

    }

    /**
     * HMSET simple-url-cache:instance domain "domain:instance"
     * HMSET domain:instance key value
     * -> if 0, then resolve(true)
     *      HGET domain:instance:key
     *      -> if set, don't update the ttl neither the creation time
     *      -> if not set
     *          HSET domain:instance:key timestamp
     *          if (ttl)
     *          HEXPIRE domain:instance:key ttl
     *
     */
    set(domain, url, value, category, ttl, force, cb:Function):void {
        if (force === true) {
            let ttl = 0;

            this.store(domain, url, value, ttl, force, (err, result) => {
                if (err) return cb(err);
                return cb(null, result);
            });
        }
        else if (category === 'never') {
            //debug('this url should never been stored');
            return cb(null, false);
        }
        else {
            this.has(domain, url, category, ttl, (err, has) => {
                if (err) return cb(err);
                if (has === true) {
                    //debug('This url is already cached - not storing it: ', domain, url);
                    return cb(null, false);
                } else {

                    this.store(domain, url, value, ttl, force, (err, result) => {
                        if(err) return cb(err);
                        return cb(null, result);
                    });
                }
            });
        }
    };

    private getDomainHashKey(domain):string {
        return this.hashKey + ':' + domain;
    }

    private store(domain:string, url:string, value:string, ttl:number, force:boolean, cb:Function) {
        const client = this._conn.getConnection();

        client.hset(this.hashKey, domain, domain, (err) => {
            if (err) {
                return cb(err)
            } else {
                client.hset(this.getDomainHashKey(domain), url, value, (err, exists) => {
                    if (err) {
                        return cb(err);
                    }
                    if (exists === 0) {
                        //debug('Already set ');
                        return cb(null, true);

                    }
                    client.get(this.getUrlKey(domain, url), (err, result) => {
                        if (err) {
                            return cb(err);
                        }
                        if (result === null) {
                            //debug('REDIS timestamp not set');
                            client.set(this.getUrlKey(domain, url), Date.now(), (err) => {
                                if (err) return cb(err);
                                if (ttl > 0) {
                                    client.expire(this.getUrlKey(domain, url), ttl, (err) => {
                                        if (err) return cb(err);
                                        return cb(null, true);
                                    });
                                } else {
                                    return cb(null, true);
                                }
                            });
                        } else if (force === true) {
                            if (ttl > 0) {
                                client.expire(this.getUrlKey(domain, url), ttl, (err) => {
                                    if (err) return cb(err);
                                    return cb(null, true);
                                });
                            } else {
                                return cb(null, true);
                            }
                        }

                    });


                });
            }

        });
    }

    private getUrlKey(domain:string, url:string):string {
        return this.getDomainHashKey(domain) + ':' + url;
    }

}

