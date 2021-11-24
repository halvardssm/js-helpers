import {
  arrayLoopAround,
  arrayLoopAroundGenerator,
} from "./array_loop_around.ts";
import { range } from "./range.ts";
import { assertEquals } from "./deps.ts";

Deno.test({
  name: "Test arrayLoopAround",
  fn(): void {
    const rangeArray = range(0, 9);
    const expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
    const array = [1, 2, 3];
    const actual = [];

    for (const i of rangeArray) {
      actual.push(arrayLoopAround(array, i));
    }

    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test arrayLoopAround - negative index",
  fn(): void {
    const rangeArray = range(2, -2);
    const expected = [3, 2, 1, 3, 2];
    const array = [1, 2, 3];
    const actual = [];

    for (const i of rangeArray) {
      actual.push(arrayLoopAround(array, i));
    }

    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test arrayLoopAroundGenerator ascending",
  fn(): void {
    const rangeArray = range(0, 9);
    const expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
    const array = [1, 2, 3];
    const actual = [];

    const gen = arrayLoopAroundGenerator(array, true);

    for (const i of rangeArray) {
      actual.push(gen.next().value);
    }

    assertEquals(actual, expected);
  },
});

Deno.test({
  name: "Test arrayLoopAroundGenerator - descending",
  fn(): void {
    const rangeArray = range(0, 9);
    const expected = [3, 2, 1, 3, 2, 1, 3, 2, 1, 3];
    const array = [1, 2, 3];
    const actual = [];

    const gen = arrayLoopAroundGenerator(array, false);

    for (const i of rangeArray) {
      actual.push(gen.next().value);
    }

    assertEquals(actual, expected);
  },
});
