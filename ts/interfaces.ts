
export interface RegexRule {
    regex: RegExp
}

export interface MaxAgeRegexRule extends RegexRule{
    maxAge: number
}

export interface CacheRules{
    maxAge: MaxAgeRegexRule[],
    always: RegexRule[],
    never: RegexRule[],
    default: string
}

export interface RedisStorageConfig{
    host: string;
    port: number;
    path?: string;
    url?: string;
    socket_keepalive?: boolean;
    password?: string;
    db?: string;
}

export interface parsedURL {
    domain: string,
    relativeURL: string
}

export interface CallBackBooleanParam {
    (err: string, res: boolean): any
}

export interface CallBackStringParam {
    (err: string, res: string): any
}

export interface CallBackStringArrayParam {
    (err: string, res: string[]): any
}

export interface InstanceConfig {
    on_existing_regex?: option_on_existing_regex //when adding a regex , and a similar is found, either replace it, ignore it, or throw an error
    on_publish_update?: boolean // when the cacheEngine.publish( is called, will scann all existing created url objects, and re-calculate the url's category
}


export type option_on_existing_regex = 'replace' | 'ignore' | 'error';

export type method = 'promise' | 'callback';
