import { CloudflareKVCache } from "@stellaraf/cacheutil-cloudflare-kv";

import type { CloudflareKVNamespace } from "@stellaraf/cacheutil-cloudflare-kv";

export type CacheName = "cloudflare-kv";

export type Cache = InstanceType<typeof CloudflareKVCache>;

export type CacheInit = CloudflareKVNamespace;

export type { CloudflareKVNamespace } from "@stellaraf/cacheutil-cloudflare-kv";

export function createCache(backend: CloudflareKVNamespace): Cache {
  return new CloudflareKVCache(backend);
}
