// deno-lint-ignore-file no-explicit-any
import { deepClone,cloneDate } from "./deep_clone.ts";
import {
  assertEquals,
  assertNotEquals,
  assertNotStrictEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.98.0/testing/asserts.ts";

Deno.test({
  name: "Test deepClone - null",
  fn(): void {
    const expected = null;

    const initial = null;
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertStrictEquals(cloned, initial);
  },
});

Deno.test({
  name: "Test deepClone - string",
  fn(): void {
    const expected = "abc";

    const initial = "abc";
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertStrictEquals(cloned, initial);
  },
});

Deno.test({
  name: "Test deepClone - array",
  fn(): void {
    const expected = [1, 2, 3];

    const initial = [1, 2, 3];
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);

    cloned[1] = 4;

    assertEquals(initial, expected);
    assertEquals(cloned, [1, 4, 3]);
    assertNotEquals(initial, cloned);
  },
});

Deno.test({
  name: "Test deepClone - object",
  fn(): void {
    const expected = { a: 1, b: 2, c: 3 };

    const initial = { a: 1, b: 2, c: 3 };
    const cloned = deepClone(initial);

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);

    cloned.b = 4;

    assertEquals(initial, expected);
    assertEquals(cloned, { a: 1, b: 4, c: 3 });
    assertNotEquals(initial, cloned);
  },
});

Deno.test({
  name: "Test deepClone - nested",
  fn(): void {
    const expected = { a: 1, b: [{ d: 4, e: { 5: "f" } }], c: 3 };

    const initial = { a: 1, b: [{ d: 4, e: { 5: "f" } }], c: 3 };
    const cloned: any = deepClone(initial);

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);

    cloned["b"] = 4;

    assertEquals(initial, expected);
    assertEquals(cloned, { a: 1, b: 4, c: 3 });
    assertNotEquals(initial, cloned);
  },
});

Deno.test({
  name: "Test deepClone - add predicate",
  fn(): void {
    const expected = new Date();

    const initial = new Date();
    const cloned: any = deepClone(initial,{predicates:[cloneDate]});

    assertEquals(cloned, expected);
    assertNotStrictEquals(cloned, initial);
  },
});
