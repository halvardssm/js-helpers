import { range, rangeGenerator } from "./range.ts";
import { assertEquals } from "../deps_dev.ts";

Deno.test({
  name: "Test range - 0:9",
  fn(): void {
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const actual = range(0, 9);
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test range - 9:0",
  fn(): void {
    const expected = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

    const actual = range(9, 0);
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test range - -2:2",
  fn(): void {
    const expected = [-2, -1, 0, 1, 2];

    const actual = range(-2, 2);
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test range - 1:1",
  fn(): void {
    const expected = [1];

    const actual = range(1, 1);
    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test rangeGenerator - 0:9",
  fn(): void {
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const actual: number[] = [];

    for (const el of rangeGenerator(0, 9)) {
      actual.push(el);
    }

    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test rangeGenerator - 9:0",
  fn(): void {
    const expected = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    const actual: number[] = [];

    for (const el of rangeGenerator(9, 0)) {
      actual.push(el);
    }

    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test rangeGenerator - -2:2",
  fn(): void {
    const expected = [-2, -1, 0, 1, 2];
    const actual: number[] = [];

    for (const el of rangeGenerator(-2, 2)) {
      actual.push(el);
    }

    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test rangeGenerator - 1:1",
  fn(): void {
    const expected = [1];
    const actual: number[] = [];

    for (const el of rangeGenerator(1, 1)) {
      actual.push(el);
    }

    assertEquals(actual, expected);
  },
});
