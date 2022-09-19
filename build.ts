import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";

import type { Format, BuildOptions } from "esbuild";

const entryPoints = fs
  .readdirSync("src")
  .filter((f) => !f.endsWith(".spec.ts"))
  .map((f) => path.resolve("src", f));

async function build(format: Exclude<Format, "iife">): Promise<void> {
  const outExtension = format === "cjs" ? { ".js": ".cjs" } : { ".js": ".mjs" };
  const options: BuildOptions = {
    target: ["esnext"],
    format,
    platform: "node",
    entryPoints,
    outExtension,
    outdir: "dist",
  };
  const result = await esbuild.build(options);
  for (const error of result.errors) {
    console.error(error.text);
  }
  for (const warning of result.warnings) {
    console.warn(warning.text);
  }
  if (result.errors.length !== 0) {
    process.exit(1);
  }
  process.exit(0);
}

build("esm");
build("cjs");
