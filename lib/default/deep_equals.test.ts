import { deepEquals } from "./deep_equals.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("deepEquals tests", () => {
  it("Test deepEquals - simple - true", () => {
    assertEquals(deepEquals(undefined, undefined), true);
    assertEquals(deepEquals(1, 1), true);
    assertEquals(deepEquals("", ""), true);
    assertEquals(deepEquals(null, null), true);
    assertEquals(deepEquals(new Set(), new Set()), true);
    assertEquals(deepEquals([], []), true);
    assertEquals(deepEquals({}, {}), true);
  });

  it("Test deepEquals - simple - false", () => {
    assertEquals(deepEquals(undefined, 1), false);
    assertEquals(deepEquals(1, ""), false);
    assertEquals(deepEquals(null, new Set()), false);
    assertEquals(deepEquals([], {}), false);
  });

  it("Test deepEquals - nested - true", () => {
    assertEquals(
      deepEquals(
        [{ a: 4, b: { c: [3, new Set()] } }, 1],
        [{ a: 4, b: { c: [3, new Set()] } }, 1],
      ),
      true,
    );
  });

  it("Test deepEquals - nested - false", () => {
    assertEquals(
      deepEquals(
        [{ a: 4, b: { c: [4, new Set()] } }, 1],
        [{ a: 4, b: { c: [3, new Set()] } }, 1],
      ),
      false,
    );
  });
});
