import fs from "fs";
import path from "path";

import { jestConfig } from "@stellaraf/jest";

import type { Config } from "jest";

const base = path.resolve("../../packages");

const packages = fs
  .readdirSync(base)
  .filter((name) => fs.lstatSync(path.join(base, name)).isDirectory());

const moduleNameMapper: Config["moduleNameMapper"] = packages.reduce(
  (final, name) => ({ ...final, [`^@stellaraf/cacheutil-${name}$`]: `${base}/${name}` }),
  {},
);

export default {
  ...jestConfig,
  moduleNameMapper,
  rootDir: path.resolve(base, "redis"),
  testEnvironment: "node",
} as typeof jestConfig;
