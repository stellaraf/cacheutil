import { RedisCache } from "./redis-cache";
describe("redis cache tests", () => {
  const cache = new RedisCache({ url: "redis://localhost:6379", database: 1 });

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
  });

  test("expire key date", async () => {
    const expireAt = new Date(Date.now());
    expireAt.setSeconds(expireAt.getSeconds() + 1);
    await cache.set("testkey", "testvalue", { expireAt });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const value = await cache.get("testkey");
    expect(value).toBeNull();
  });

  test("all keys", async () => {
    await cache.backend.connect();
    await cache.backend.flushAll();
    await cache.backend.disconnect();
    const expected = ["1", "2", "3", "4"];
    for (const key of expected) {
      await cache.set(key, "");
    }
    const keys = await cache.keys();
    expect(keys).toEqual(expected);
  });
});
