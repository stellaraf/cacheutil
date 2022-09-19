import { CloudflareKVCache } from "./cloudflare-kv";

declare global {
  function getMiniflareBindings(): Bindings;
}

describe("Cloudflare KV tests", () => {
  const { TEST_KV } = getMiniflareBindings();
  const cache = new CloudflareKVCache(TEST_KV);

  test("set & get key", async () => {
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
    await cache.set("testkey", "testvalue", { expireIn: 60 });
    await new Promise((resolve) => setTimeout(resolve, 61000));
    const value = await cache.get("testkey");
    expect(value).toBeNull();
  }, 62000);

  test("expire key date", async () => {
    const expireAt = new Date(Date.now());
    expireAt.setSeconds(expireAt.getSeconds() + 60);
    await cache.set("testkey", "testvalue", { expireAt });
    await new Promise((resolve) => setTimeout(resolve, 61000));
    const value = await cache.get("testkey");
    expect(value).toBeNull();
  }, 62000);

  test("all keys", async () => {
    const expected = ["1", "2", "3", "4"];
    for (const key of expected) {
      await cache.set(key, "");
    }
    const keys = await cache.keys();
    expect(keys).toEqual(expected);
  });
});

export {};
