import fs from "fs";
import path from "path";
import { jestConfig } from "@stellaraf/jest";

import type { TransformOptions } from "esbuild";
import type { Config } from "jest";
type Transform = Config["transform"];

const base = path.resolve("../../packages");

const packages = fs
  .readdirSync(base)
  .filter((name) => fs.lstatSync(path.join(base, name)).isDirectory());

const moduleNameMapper: Config["moduleNameMapper"] = packages.reduce(
  (final, name) => ({ ...final, [`^@stellaraf/cacheutil-${name}$`]: `${base}/${name}` }),
  {},
);

const { transform, ...withoutTransform }: Config = jestConfig;

const tsconfigRaw = fs
  .readFileSync(path.resolve(base, "cloudflare-kv", "tsconfig.jest.json"))
  .toString();

const transformOptions: TransformOptions = {
  tsconfigRaw,
  //   format: "esm",
};

export default {
  ...withoutTransform,
  transform: {
    "^.+\\.tsx?$": ["jest-esbuild", transformOptions as Transform],
  },
  moduleNameMapper,
  rootDir: path.resolve(base, "cloudflare-kv"),
  testEnvironment: "miniflare",
  testEnvironmentOptions: {
    kvNamespaces: ["TEST_KV"],
    scriptPath: "dist/index.mjs",
    modules: true,
  },
} as typeof jestConfig;
