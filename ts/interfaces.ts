


export interface RegexRule {
    regex: RegExp,
    ignoreQuery?: boolean
}

export interface MaxAgeRegexRule extends RegexRule{
    maxAge: number
}

export interface DomainRule<T> {
    domain: string | RegExp,
    rules: T[]
}

export interface CacheRules{
    maxAge: DomainRule<MaxAgeRegexRule>[],
    always: DomainRule<RegexRule>[],
    never: DomainRule<RegexRule>[],
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


export interface GetResults {
    content: string,
    createdOn: number,
    extra: any
}

export interface parsedURL {
    domain: string,
    relativeURL: string
}

export interface CallBackGetResultsParam {
    (err: string | Error, res?: GetResults): any
}

export interface CallBackBooleanParam {
    (err: string | Error, res?: boolean): any
}

export interface CallBackStringParam {
    (err: string | Error, res?: string): any
}

export interface CallBackStringArrayParam {
    (err: string | Error, res?: string[]): any
}

export interface InstanceConfig {
    on_existing_regex?: option_on_existing_regex //when adding a regex , and a similar is found, either replace it, ignore it, or throw an error
    on_publish_update?: boolean // when the cacheEngine.publish( is called, will scann all existing created url objects, and re-calculate the url's category
}


export type option_on_existing_regex = 'replace' | 'ignore' | 'error';

export type method = 'promise' | 'callback';
