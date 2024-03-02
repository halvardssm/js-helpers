import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";
import { parse } from "https://deno.land/std@0.193.0/semver/mod.ts";
import config from "../deno.json" assert { type: "json" };

const version = config.version;

await emptyDir("./npm");

parse(version);

await build({
  entryPoints: [
    "./lib/default/mod.ts",
    {
      name: "./browser",
      path: "./lib/browser/mod.ts",
    },
    {
      name: "./system",
      path: "./lib/system/mod.ts",
    },
  ],
  outDir: "./npm",
  test: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
    undici: true,
  },
  scriptModule: false,
  esModule: true,
  package: {
    // package.json properties
    name: "@halvardm/js-helpers",
    version,
    description: "JavaScript helpers",
    license: "MIT",
    type: "module",
    repository: {
      type: "git",
      url: "git+https://github.com/halvardssm/js-helpers.git",
    },
    bugs: {
      url: "https://github.com/halvardssm/js-helpers/issues",
    },
    publishConfig: {
      registry: "https://npm.pkg.github.com",
    },
  },
  compilerOptions: {
    lib: ["DOM", "ESNext"],
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
