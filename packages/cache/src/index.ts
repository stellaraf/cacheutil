import { CloudflareKVCache } from "@stellaraf/cacheutil-cloudflare-kv";
import { RedisCache, RedisCacheOptions } from "@stellaraf/cacheutil-redis";
import { objectIsTypeByProp } from "@stellaraf/utilities";

import type { CloudflareKVNamespace } from "@stellaraf/cacheutil-cloudflare-kv";

export type BackendName = "cloudflare-kv" | "redis";

export type Backend = InstanceType<typeof RedisCache> | InstanceType<typeof CloudflareKVCache>;

function isKVNamespace(obj: unknown): obj is CloudflareKVNamespace {
  return objectIsTypeByProp<CloudflareKVNamespace>(obj, "get", "put", "delete");
}

function isRedisOptions(obj: unknown): obj is RedisCacheOptions {
  return objectIsTypeByProp<RedisCacheOptions>(obj, "url", "database");
}

export function createCache(backend: CloudflareKVNamespace): InstanceType<typeof CloudflareKVCache>;
export function createCache(options: RedisCacheOptions): InstanceType<typeof RedisCache>;
export function createCache(
  backendOrOptions: CloudflareKVNamespace | RedisCacheOptions,
): InstanceType<typeof CloudflareKVCache> | InstanceType<typeof RedisCache> {
  if (isKVNamespace(backendOrOptions)) {
    return new CloudflareKVCache(backendOrOptions);
  }
  if (isRedisOptions(backendOrOptions)) {
    return new RedisCache(backendOrOptions);
  }
  throw new TypeError(`Unknown or unsupported argument '${backendOrOptions}'`);
}
