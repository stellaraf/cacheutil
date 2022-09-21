import Redis from "ioredis";
import { Cache, CacheConnectionError } from "@stellaraf/cacheutil-core";

import type { RedisOptions } from "ioredis";
import type { SetOptions } from "@stellaraf/cacheutil-core";

export type RedisClient = InstanceType<typeof Redis>;
export type RedisCacheOptions = RedisOptions;

export class RedisCache extends Cache<RedisClient> {
  constructor(options: RedisCacheOptions) {
    const redis = new Redis(options);
    super(redis);
  }

  public async get(key: string): Promise<string | null> {
    await this.#check();
    const value = await this.backend.get(key);
    return value;
  }

  async #check(): Promise<void> {
    try {
      await this.backend.ping();
    } catch (err) {
      if (err instanceof Error) {
        const error = new CacheConnectionError(err.message);
        if (err.stack) {
          error.stack = err.stack;
        }
        if (err.cause) {
          error.cause = err.cause;
        }
        throw error;
      }
      throw new CacheConnectionError(String(err));
    }
  }

  public async set(key: string, value: unknown, options: Partial<SetOptions> = {}): Promise<void> {
    let put: string;
    if (typeof value === "string") {
      put = value;
    } else {
      put = String(value);
    }
    await this.#check();

    await this.backend.set(key, put);
    if (typeof options.expireAt !== "undefined") {
      await this.backend.expireat(key, options.expireAt.getSeconds());
    }
    if (typeof options.expireIn !== "undefined") {
      await this.backend.expire(key, options.expireIn);
    }
  }

  public async keys(): Promise<string[]> {
    await this.#check();
    let keys = await this.backend.keys("*");
    keys = keys.sort((a, b) => a.localeCompare(b));
    return keys;
  }

  public async delete(key: string): Promise<void> {
    await this.#check();
    await this.backend.del(key);
  }
}
