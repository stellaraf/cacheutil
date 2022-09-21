import { CacheConnectionError } from "@stellaraf/cacheutil-core";
import { RedisCache } from "./redis-cache";

test("throws a connection error when appropriate", () => {
  const cache = new RedisCache({ host: "localhost", port: 9736, db: 1 });
  expect(async () => {
    await cache.get("testkey");
  }).rejects.toThrowError(CacheConnectionError);
  cache.backend.disconnect();
});

describe("redis cache tests", () => {
  const cache = new RedisCache({ host: "localhost", port: 6379, db: 1 });

  afterAll(async () => {
    await cache.backend.quit();
  });

  test("put key", async () => {
    await cache.set("testkey", "testvalue");
    const value = await cache.get("testkey");
    expect(value).toBe("testvalue");
  });

  test("delete key", async () => {
    await cache.set("testkey", "testvalue");
    await cache.delete("testkey");
    const value = await cache.get("testkey");
    expect(value).toBeNull();
  });

  test("expire key ttl", async () => {
    await cache.set("testkey", "testvalue", { expireIn: 1 });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const value = await cache.get("testkey");
    expect(value).toBeNull();
  }, 3000);

  test("expire key date", async () => {
    const expireAt = new Date(Date.now());
    expireAt.setSeconds(expireAt.getSeconds() + 1);
    await cache.set("testkey", "testvalue", { expireAt });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const value = await cache.get("testkey");
    expect(value).toBeNull();
  }, 3000);

  test("all keys", async () => {
    await cache.backend.flushall();
    const expected = ["1", "2", "3", "4"];
    for (const key of expected) {
      await cache.set(key, "");
    }
    const keys = await cache.keys();
    expect(keys).toEqual(expected);
  });
});
