test:
	deno test

lint:
	deno lint lib/mod.ts

fmt:
	deno fmt --check

bundle:
	mkdir -p dist
	deno bundle lib/mod.ts dist/bundle.js