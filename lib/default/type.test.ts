import { type } from "./type.ts";
import { assertEquals } from "./deps.ts";

Deno.test({
  name: "Test type - undefined",
  fn(): void {
    assertEquals(type(undefined), "undefined");
  },
});

Deno.test({
  name: "Test type - array",
  fn(): void {
    assertEquals(type([]), "array");
  },
});

Deno.test({
  name: "Test type - bigint",
  fn(): void {
    assertEquals(type(1n), "bigint");
  },
});

Deno.test({
  name: "Test type - date",
  fn(): void {
    assertEquals(type(new Date()), "date");
  },
});

Deno.test({
  name: "Test type - error",
  fn(): void {
    assertEquals(type(new Error()), "error");
  },
});

Deno.test({
  name: "Test type - function",
  fn(): void {
    assertEquals(type(() => {}), "function");
  },
});

Deno.test({
  name: "Test type - generator",
  fn(): void {
    const generator = function* () {};
    assertEquals(type(generator), "generator");
  },
});

Deno.test({
  name: "Test type - regexp",
  fn(): void {
    assertEquals(type(/1/), "regexp");
  },
});

Deno.test({
  name: "Test type - symbol",
  fn(): void {
    assertEquals(type(Symbol()), "symbol");
  },
});

Deno.test({
  name: "Test type - object",
  fn(): void {
    assertEquals(type({}), "object");
  },
});

Deno.test({
  name: "Test type - map",
  fn(): void {
    assertEquals(type(new Map()), "map");
  },
});

Deno.test({
  name: "Test type - weakmap",
  fn(): void {
    assertEquals(type(new WeakMap()), "weakmap");
  },
});

Deno.test({
  name: "Test type - set",
  fn(): void {
    assertEquals(type(new Set()), "set");
  },
});

Deno.test({
  name: "Test type - weakset",
  fn(): void {
    assertEquals(type(new WeakSet()), "weakset");
  },
});

Deno.test({
  name: "Test type - null",
  fn(): void {
    assertEquals(type(null), "null");
  },
});

Deno.test({
  name: "Test type full - undefined",
  fn(): void {
    assertEquals(type(undefined, { showFullClass: true }), "undefined");
  },
});

Deno.test({
  name: "Test type full - array",
  fn(): void {
    assertEquals(type([], { showFullClass: true }), "[object Array]");
  },
});

Deno.test({
  name: "Test type full - bigint",
  fn(): void {
    assertEquals(type(1n, { showFullClass: true }), "bigint");
  },
});

Deno.test({
  name: "Test type full - date",
  fn(): void {
    assertEquals(type(new Date(), { showFullClass: true }), "[object Date]");
  },
});

Deno.test({
  name: "Test type full - error",
  fn(): void {
    assertEquals(type(new Error(), { showFullClass: true }), "[object Error]");
  },
});

Deno.test({
  name: "Test type full - function",
  fn(): void {
    assertEquals(type(() => {}, { showFullClass: true }), "function");
  },
});

Deno.test({
  name: "Test type full - generator",
  fn(): void {
    const generator = function* () {};
    assertEquals(type(generator, { showFullClass: true }), "generator");
  },
});

Deno.test({
  name: "Test type full - regexp",
  fn(): void {
    assertEquals(type(/1/, { showFullClass: true }), "[object RegExp]");
  },
});

Deno.test({
  name: "Test type full - symbol",
  fn(): void {
    assertEquals(type(Symbol(), { showFullClass: true }), "symbol");
  },
});

Deno.test({
  name: "Test type full - object",
  fn(): void {
    assertEquals(type({}, { showFullClass: true }), "[object Object]");
  },
});

Deno.test({
  name: "Test type full - map",
  fn(): void {
    assertEquals(type(new Map(), { showFullClass: true }), "[object Map]");
  },
});

Deno.test({
  name: "Test type full - weakmap",
  fn(): void {
    assertEquals(
      type(new WeakMap(), { showFullClass: true }),
      "[object WeakMap]",
    );
  },
});

Deno.test({
  name: "Test type full - set",
  fn(): void {
    assertEquals(type(new Set(), { showFullClass: true }), "[object Set]");
  },
});

Deno.test({
  name: "Test type full - weakset",
  fn(): void {
    assertEquals(
      type(new WeakSet(), { showFullClass: true }),
      "[object WeakSet]",
    );
  },
});

Deno.test({
  name: "Test type full - null",
  fn(): void {
    assertEquals(type(null, { showFullClass: true }), "[object Null]");
  },
});

Deno.test({
  name: "Test type simplify - undefined",
  fn(): void {
    assertEquals(type(undefined, { simplify: true }), "undefined");
  },
});

Deno.test({
  name: "Test type simplify - array",
  fn(): void {
    assertEquals(type([], { simplify: true }), "array");
  },
});

Deno.test({
  name: "Test type simplify - bigint",
  fn(): void {
    assertEquals(type(1n, { simplify: true }), "bigint");
  },
});

Deno.test({
  name: "Test type simplify - date",
  fn(): void {
    assertEquals(type(new Date(), { simplify: true }), "date");
  },
});

Deno.test({
  name: "Test type simplify - error",
  fn(): void {
    assertEquals(type(new Error(), { simplify: true }), "error");
  },
});

Deno.test({
  name: "Test type simplify - function",
  fn(): void {
    assertEquals(type(() => {}, { simplify: true }), "function");
  },
});

Deno.test({
  name: "Test type simplify - generator",
  fn(): void {
    const generator = function* () {};
    assertEquals(type(generator, { simplify: true }), "function");
  },
});

Deno.test({
  name: "Test type simplify - regexp",
  fn(): void {
    assertEquals(type(/1/, { simplify: true }), "regexp");
  },
});

Deno.test({
  name: "Test type simplify - symbol",
  fn(): void {
    assertEquals(type(Symbol(), { simplify: true }), "symbol");
  },
});

Deno.test({
  name: "Test type simplify - object",
  fn(): void {
    assertEquals(type({}, { simplify: true }), "object");
  },
});

Deno.test({
  name: "Test type simplify - map",
  fn(): void {
    assertEquals(type(new Map(), { simplify: true }), "object");
  },
});

Deno.test({
  name: "Test type simplify - weakmap",
  fn(): void {
    assertEquals(
      type(new WeakMap(), { simplify: true }),
      "object",
    );
  },
});

Deno.test({
  name: "Test type simplify - set",
  fn(): void {
    assertEquals(type(new Set(), { simplify: true }), "object");
  },
});

Deno.test({
  name: "Test type simplify - weakset",
  fn(): void {
    assertEquals(
      type(new WeakSet(), { simplify: true }),
      "object",
    );
  },
});

Deno.test({
  name: "Test type simplify - null",
  fn(): void {
    assertEquals(type(null, { simplify: true }), "null");
  },
});
