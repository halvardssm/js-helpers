test:
	deno test

lint:
	deno lint src/mod.ts

fmt:
	deno fmt --check

bundle:
	mkdir -p dist
	deno bundle src/mod.ts dist/bundle.js