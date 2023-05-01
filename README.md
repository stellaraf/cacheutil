<div align="center">
  <br/>
  <img src="https://res.cloudinary.com/stellaraf/image/upload/v1604277355/stellar-logo-gradient.svg" width="300" />
  <br/>
  <h3>Stellar JS Cache Utilities</h3>
  <br/>
  <a href="https://github.com/stellaraf/cacheutil/actions/workflows/quality.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/stellaraf/cacheutil/quality.yml?branch=main&color=%239100fa&event=push&style=for-the-badge" />
  </a>
  <br/>
  <br/>
</div>

`@stellaraf/cacheutil` provides a consistent caching API with support for multiple backends in the event that a library requires a cache but could be used on multiple platforms with different caching systems available. For example, if one needed to use a library on both Cloudflare Workers and a standard NodeJS application.

# Supported Backends

## Cloudflare KV

```ts
import { createCache } from "@stellaraf/cacheutil-cache";

const cache = createCache(env.KV_BINDING);

await cache.set("key", "value");
const value = await cache.get("key");
console.log(value);
// value
```

## Redis

```ts
import { createCache } from "@stellaraf/cacheutil-cache";

const cache = createCache({ url: "redis://localhost:6379", database: 1 });

await cache.set("key", "value");
const value = await cache.get("key");
console.log(value);
// value
```
