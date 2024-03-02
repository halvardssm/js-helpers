import {
  arrayLoopAround,
  arrayLoopAroundGenerator,
} from "./array_loop_around.ts";
import { range } from "./range.ts";
import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("array_loop_around tests", () => {
  it("Test arrayLoopAround", () => {
    const rangeArray = range(0, 9);
    const expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
    const array = [1, 2, 3];
    const actual = [];

    for (const i of rangeArray) {
      actual.push(arrayLoopAround(array, i));
    }

    assertEquals(actual, expected);
  });

  it("Test arrayLoopAround - negative index", () => {
    const rangeArray = range(2, -2);
    const expected = [3, 2, 1, 3, 2];
    const array = [1, 2, 3];
    const actual = [];

    for (const i of rangeArray) {
      actual.push(arrayLoopAround(array, i));
    }

    assertEquals(actual, expected);
  });

  it("Test arrayLoopAroundGenerator ascending", () => {
    const rangeArray = range(0, 9);
    const expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1];
    const array = [1, 2, 3];
    const actual = [];

    const gen = arrayLoopAroundGenerator(array, true);

    for (const _i of rangeArray) {
      actual.push(gen.next().value);
    }

    assertEquals(actual, expected);
  });

  it("Test arrayLoopAroundGenerator - descending", () => {
    const rangeArray = range(0, 9);
    const expected = [3, 2, 1, 3, 2, 1, 3, 2, 1, 3];
    const array = [1, 2, 3];
    const actual = [];

    const gen = arrayLoopAroundGenerator(array, false);

    for (const _i of rangeArray) {
      actual.push(gen.next().value);
    }

    assertEquals(actual, expected);
  });
});
