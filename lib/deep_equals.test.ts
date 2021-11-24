import { deepEquals } from "./deep_equals.ts";
import { assertEquals } from "./deps.ts";

Deno.test({
  name: "Test deepEquals - simple - true",
  fn(): void {
    assertEquals(deepEquals(undefined, undefined), true);
    assertEquals(deepEquals(1, 1), true);
    assertEquals(deepEquals("", ""), true);
    assertEquals(deepEquals(null, null), true);
    assertEquals(deepEquals(new Set(), new Set()), true);
    assertEquals(deepEquals([], []), true);
    assertEquals(deepEquals({}, {}), true);
  },
});

Deno.test({
  name: "Test deepEquals - simple - false",
  fn(): void {
    assertEquals(deepEquals(undefined, 1), false);
    assertEquals(deepEquals(1, ""), false);
    assertEquals(deepEquals(null, new Set()), false);
    assertEquals(deepEquals([], {}), false);
  },
});

Deno.test({
  name: "Test deepEquals - nested - true",
  fn(): void {
    assertEquals(
      deepEquals(
        [{ a: 4, b: { c: [3, new Set()] } }, 1],
        [{ a: 4, b: { c: [3, new Set()] } }, 1],
      ),
      true,
    );
  },
});

Deno.test({
  name: "Test deepEquals - nested - false",
  fn(): void {
    assertEquals(
      deepEquals(
        [{ a: 4, b: { c: [4, new Set()] } }, 1],
        [{ a: 4, b: { c: [3, new Set()] } }, 1],
      ),
      false,
    );
  },
});
