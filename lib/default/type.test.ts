import { type } from "./type.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("type tests", () => {
  it("Test type - undefined", () => {
    assertEquals(type(undefined), "undefined");
  });

  it("Test type - array", () => {
    assertEquals(type([]), "array");
  });

  it("Test type - bigint", () => {
    assertEquals(type(1n), "bigint");
  });

  it("Test type - date", () => {
    assertEquals(type(new Date()), "date");
  });

  it("Test type - error", () => {
    assertEquals(type(new Error()), "error");
  });

  it("Test type - function", () => {
    assertEquals(type(() => {}), "function");
  });

  it("Test type - generator", () => {
    const generator = function* () {};
    assertEquals(type(generator), "generator");
  });

  it("Test type - regexp", () => {
    assertEquals(type(/1/), "regexp");
  });

  it("Test type - symbol", () => {
    assertEquals(type(Symbol()), "symbol");
  });

  it("Test type - object", () => {
    assertEquals(type({}), "object");
  });

  it("Test type - map", () => {
    assertEquals(type(new Map()), "map");
  });

  it("Test type - weakmap", () => {
    assertEquals(type(new WeakMap()), "weakmap");
  });

  it("Test type - set", () => {
    assertEquals(type(new Set()), "set");
  });

  it("Test type - weakset", () => {
    assertEquals(type(new WeakSet()), "weakset");
  });

  it("Test type - null", () => {
    assertEquals(type(null), "null");
  });

  it("Test type full - undefined", () => {
    assertEquals(type(undefined, { showFullClass: true }), "undefined");
  });

  it("Test type full - array", () => {
    assertEquals(type([], { showFullClass: true }), "[object Array]");
  });

  it("Test type full - bigint", () => {
    assertEquals(type(1n, { showFullClass: true }), "bigint");
  });

  it("Test type full - date", () => {
    assertEquals(type(new Date(), { showFullClass: true }), "[object Date]");
  });

  it("Test type full - error", () => {
    assertEquals(type(new Error(), { showFullClass: true }), "[object Error]");
  });

  it("Test type full - function", () => {
    assertEquals(type(() => {}, { showFullClass: true }), "function");
  });

  it("Test type full - generator", () => {
    const generator = function* () {};
    assertEquals(type(generator, { showFullClass: true }), "generator");
  });

  it("Test type full - regexp", () => {
    assertEquals(type(/1/, { showFullClass: true }), "[object RegExp]");
  });

  it("Test type full - symbol", () => {
    assertEquals(type(Symbol(), { showFullClass: true }), "symbol");
  });

  it("Test type full - object", () => {
    assertEquals(type({}, { showFullClass: true }), "[object Object]");
  });

  it("Test type full - map", () => {
    assertEquals(type(new Map(), { showFullClass: true }), "[object Map]");
  });

  it("Test type full - weakmap", () => {
    assertEquals(
      type(new WeakMap(), { showFullClass: true }),
      "[object WeakMap]",
    );
  });

  it("Test type full - set", () => {
    assertEquals(type(new Set(), { showFullClass: true }), "[object Set]");
  });

  it("Test type full - weakset", () => {
    assertEquals(
      type(new WeakSet(), { showFullClass: true }),
      "[object WeakSet]",
    );
  });

  it("Test type full - null", () => {
    assertEquals(type(null, { showFullClass: true }), "[object Null]");
  });

  it("Test type simplify - undefined", () => {
    assertEquals(type(undefined, { simplify: true }), "undefined");
  });

  it("Test type simplify - array", () => {
    assertEquals(type([], { simplify: true }), "array");
  });

  it("Test type simplify - bigint", () => {
    assertEquals(type(1n, { simplify: true }), "bigint");
  });

  it("Test type simplify - date", () => {
    assertEquals(type(new Date(), { simplify: true }), "date");
  });

  it("Test type simplify - error", () => {
    assertEquals(type(new Error(), { simplify: true }), "error");
  });

  it("Test type simplify - function", () => {
    assertEquals(type(() => {}, { simplify: true }), "function");
  });

  it("Test type simplify - generator", () => {
    const generator = function* () {};
    assertEquals(type(generator, { simplify: true }), "function");
  });

  it("Test type simplify - regexp", () => {
    assertEquals(type(/1/, { simplify: true }), "regexp");
  });

  it("Test type simplify - symbol", () => {
    assertEquals(type(Symbol(), { simplify: true }), "symbol");
  });

  it("Test type simplify - object", () => {
    assertEquals(type({}, { simplify: true }), "object");
  });

  it("Test type simplify - map", () => {
    assertEquals(type(new Map(), { simplify: true }), "object");
  });

  it("Test type simplify - weakmap", () => {
    assertEquals(type(new WeakMap(), { simplify: true }), "object");
  });

  it("Test type simplify - set", () => {
    assertEquals(type(new Set(), { simplify: true }), "object");
  });

  it("Test type simplify - weakset", () => {
    assertEquals(type(new WeakSet(), { simplify: true }), "object");
  });

  it("Test type simplify - null", () => {
    assertEquals(type(null, { simplify: true }), "null");
  });
});
