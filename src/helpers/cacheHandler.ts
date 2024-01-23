import { Redis } from "ioredis";

export default class CacheHandler {
    private _cache: Redis;
    private _cache_ttl: number = 60 * 60;

    constructor(){
        this._cache = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD 
        })
    }

    public async save(key: string, value: string): Promise<void> {
        this._cache.set(key, value);
        this._cache.expire(key, this._cache_ttl);
        return;
    }

    public async get(key: string): Promise<string | null> {
        return this._cache.get(key);
    }

    public async delete(key: string): Promise<void> {
        this._cache.del(key);
    }

    public async clear(): Promise<void> {
        this._cache.flushall();
    }
}
