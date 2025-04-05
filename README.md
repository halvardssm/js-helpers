# JS Helpers

[Docs](https://doc.deno.land/https/raw.githubusercontent.com%2Fhalvardssm%2Fjs-helpers%2Fmain%2Flib%2Fmod.ts)

This is a repo containing helper methods for JS written in TS. Testing is done
via Deno. All modules should be compatible with web standards so that they can
be used both for Deno and Node. The NPM package is generated from Deno code
using [DNT](https://github.com/denoland/dnt).

## Installation

### Deno

```
deno add @halvardm/js-helpers
```

### NPM

```
npx jsr add @halvardm/js-helpers
yarn dlx jsr add @halvardm/js-helpers
pnpm dlx jsr add @halvardm/js-helpers
bunx jsr add @halvardm/js-helpers
```

## Usage

There are multiple entry points available for import.

### Default

These exports uses no runtime specific code or dependencies, and MUST follow web standards.

```ts
import { Cookie } from "@halvardm/js-helpers"
```

### Browser

These exports uses browser specific code and dependencies, e.g. JSX, React.

```ts
import { Example } from "@halvardm/js-helpers/browser"
```

### System

These exports uses system specific code and dependencies, e.g. fs, env.

```ts
import { getSafeEnvVar } from "@halvardm/js-helpers/system"
```

> If shimming is needed, see the [deno shim package](https://www.npmjs.com/package/@deno/shim-deno).
