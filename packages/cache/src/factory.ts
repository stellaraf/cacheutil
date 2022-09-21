import { CloudflareKVCache } from "@stellaraf/cacheutil-cloudflare-kv";
import { RedisCache, RedisCacheOptions } from "@stellaraf/cacheutil-redis";
import { objectIsTypeByProp } from "@stellaraf/utilities";

import type { CloudflareKVNamespace } from "@stellaraf/cacheutil-cloudflare-kv";

export type CacheName = "cloudflare-kv" | "redis";

export type Cache = InstanceType<typeof RedisCache> | InstanceType<typeof CloudflareKVCache>;

export type CacheInit = CloudflareKVNamespace | RedisCacheOptions;

export type { CloudflareKVNamespace } from "@stellaraf/cacheutil-cloudflare-kv";
export type { RedisCacheOptions } from "@stellaraf/cacheutil-redis";

export function isKVNamespace(obj: unknown): obj is CloudflareKVNamespace {
  return objectIsTypeByProp<CloudflareKVNamespace>(obj, "get", "put", "delete");
}

export function isRedisOptions(obj: unknown): obj is RedisCacheOptions {
  return objectIsTypeByProp<RedisCacheOptions>(obj, "host", "db");
}

export function createCache(backend: CloudflareKVNamespace): InstanceType<typeof CloudflareKVCache>;
export function createCache(options: RedisCacheOptions): InstanceType<typeof RedisCache>;
export function createCache(backendOrOptions: CacheInit): Cache {
  if (isKVNamespace(backendOrOptions)) {
    return new CloudflareKVCache(backendOrOptions);
  }
  if (isRedisOptions(backendOrOptions)) {
    return new RedisCache(backendOrOptions);
  }
  throw new TypeError(`Unknown or unsupported argument '${backendOrOptions}'`);
}
