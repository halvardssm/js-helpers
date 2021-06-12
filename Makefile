test:
	deno test

lint:
	deno lint src/mod.ts

fmt:
	deno fmt --check src/mod.ts

bundle:
	deno bundle src/mod.ts dist/bundle.js