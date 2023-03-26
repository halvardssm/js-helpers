import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

const VERSION_REGEX = /^\d+\.\d+\.\d+(-.+)?$/;

await emptyDir("./npm");
let version = await Deno.readTextFile("./VERSION");
version = version.trim();

if (!VERSION_REGEX.test(version)) {
  throw new Error(`Invalid version: ${version}`);
}

await build({
  entryPoints: ["./lib/mod.ts"],
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
    name: "@halvardssm/js-helpers",
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
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
