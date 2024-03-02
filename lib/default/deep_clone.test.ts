// deno-lint-ignore-file no-explicit-any
import { cloneDate, deepClone } from "./deep_clone.ts";
import {
  assertEquals,
  assertNotEquals,
  assertNotStrictEquals,
  assertStrictEquals,
} from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("deepClone tests", () => {
  it("Test deepClone - null", () => {
    const expected = null;

    const initial = null;
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertStrictEquals(cloned, initial);
  });

  it("Test deepClone - string", () => {
    const expected = "abc";

    const initial = "abc";
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertStrictEquals(cloned, initial);
  });

  it("Test deepClone - array", () => {
    const expected = [1, 2, 3];

    const initial = [1, 2, 3];
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);

    cloned[1] = 4;

    assertEquals(initial, expected);
    assertEquals(cloned, [1, 4, 3]);
    assertNotEquals(initial, cloned);
  });

  it("Test deepClone - object", () => {
    const expected = { a: 1, b: 2, c: 3 };

    const initial = { a: 1, b: 2, c: 3 };
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);

    cloned.b = 4;

    assertEquals(initial, expected);
    assertEquals(cloned, { a: 1, b: 4, c: 3 });
    assertNotEquals(initial, cloned);
  });

  it("Test deepClone - nested", () => {
    const expected = { a: 1, b: [{ d: 4, e: { 5: "f" } }], c: 3 };

    const initial = { a: 1, b: [{ d: 4, e: { 5: "f" } }], c: 3 };
    const cloned: any = deepClone(initial);

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);

    cloned["b"] = 4;

    assertEquals(initial, expected);
    assertEquals(cloned, { a: 1, b: 4, c: 3 });
    assertNotEquals(initial, cloned);
  });

  it("Test deepClone - add predicate", () => {
    const expected = new Date();

    const initial = new Date();
    const cloned: any = deepClone(initial, { predicates: [cloneDate] });

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);
  });
});
