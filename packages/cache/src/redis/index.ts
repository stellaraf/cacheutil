import { RedisCache, type RedisCacheOptions } from "@stellaraf/cacheutil-redis";

export type CacheName = "redis";

export type Cache = InstanceType<typeof RedisCache>;

export type CacheInit = RedisCacheOptions;

export type { RedisCacheOptions } from "@stellaraf/cacheutil-redis";

export function createCache(options: RedisCacheOptions): Cache {
  return new RedisCache(options);
}
