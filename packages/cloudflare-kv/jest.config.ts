import { monorepoConfig } from "@stellaraf/jest";

export default monorepoConfig("@stellaraf/cacheutil-", undefined, {
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    kvNamespaces: ["TEST_KV"],
    scriptPath: "dist/esm/index.js",
    modules: true,
  },
});
