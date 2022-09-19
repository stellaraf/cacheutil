import { createClient } from "redis";
import { Cache } from "@stellaraf/cacheutil-core";

import type { RedisClientOptions } from "redis";
import type { SetOptions } from "@stellaraf/cacheutil-core";

export type RedisClient = ReturnType<typeof createClient>;
export type RedisCacheOptions = RedisClientOptions;

export class RedisCache extends Cache<RedisClient> {
  constructor(options: RedisClientOptions) {
    const client = createClient(options);
    super(client);
  }

  public async get(key: string): Promise<string | null> {
    await this.#open();
    const value = await this.backend.get(key);
    await this.#close();
    return value;
  }

  async #open(): Promise<void> {
    if (!this.backend.isOpen) {
      await this.backend.connect();
    }
  }

  async #close(): Promise<void> {
    if (this.backend.isOpen) {
      await this.backend.disconnect();
    }
  }

  public async set(key: string, value: unknown, options: Partial<SetOptions> = {}): Promise<void> {
    let put: string;
    if (typeof value === "string") {
      put = value;
    } else {
      put = String(value);
    }
    await this.#open();

    await this.backend.set(key, put);
    if (typeof options.expireAt !== "undefined") {
      await this.backend.expireAt(key, options.expireAt);
    }
    if (typeof options.expireIn !== "undefined") {
      await this.backend.expire(key, options.expireIn);
    }
    await this.#close();
  }

  public async keys(): Promise<string[]> {
    await this.#open();
    let keys = await this.backend.keys("*");
    await this.#close();
    keys = keys.sort((a, b) => a.localeCompare(b));
    return keys;
  }

  public async delete(key: string): Promise<void> {
    await this.#open();
    await this.backend.del(key);
    await this.#close();
  }
}
