import { Redis } from "ioredis";
import { Settings } from "../configs";

class CacheHandler {
    private _cache: Redis;
    private _cache_ttl: number = 60 * 60;

    constructor(){
        this._cache = new Redis({
            host: Settings.redisHost,
            port: Settings.redisPort,
            password: Settings.redisPassword 
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

const cache = new CacheHandler();
export default cache;