import { Cache } from "@stellaraf/cacheutil-core";

import type { SetOptions } from "@stellaraf/cacheutil-core";

export type CloudflareKVNamespace = KVNamespace<string>;

export class CloudflareKVCache extends Cache<CloudflareKVNamespace> {
  public async get(key: string): Promise<string | null> {
    return this.backend.get(key);
  }

  public async set(key: string, value: unknown, options: Partial<SetOptions> = {}): Promise<void> {
    let put: string;
    if (typeof value === "string") {
      put = value;
    } else {
      put = String(value);
    }
    const opts: KVNamespacePutOptions = {};
    if (typeof options.expireAt !== "undefined") {
      opts.expiration = options.expireAt.getTime() / 1000;
    }
    if (typeof options.expireIn !== "undefined") {
      opts.expirationTtl = options.expireIn;
    }
    await this.backend.put(key, put, opts);
  }

  public async keys(): Promise<string[]> {
    const { keys } = await this.backend.list();
    const stringKeys = keys.map((k) => k.name).sort((a, b) => a.localeCompare(b));
    return stringKeys;
  }

  public async delete(key: string): Promise<void> {
    await this.backend.delete(key);
  }
}
