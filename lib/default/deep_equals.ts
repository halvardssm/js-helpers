// deno-lint-ignore-file no-explicit-any
import { type } from "./type.ts";

/** Checks the equality (not by reference) of any object.
 * This function will run deep and compare each element,
 * however, it will not check the order of object keys.
 *
 *      deepEquals([{a:[{b:1}]}],[{a:[{b:1}]}]) // true
 *      deepEquals([{a:[{b:1}]}],[{a:[{b:2}]}]) // false
 */
export function deepEquals(object1: any, object2: any): boolean {
  const compareArray = (array1: any[], array2: any[]): boolean => {
    if (array1.length !== array2.length) return false;

    for (const [i, el] of array1.entries()) {
      if (!deepEquals(el, array2[i])) return false;
    }

    return true;
  };

  const compareObject = (object1: any, object2: any): boolean => {
    if (Object.keys(object1).length !== Object.keys(object2).length) {
      return false;
    }

    for (const [key, value] of Object.entries(object1)) {
      if (!deepEquals(value, object2[key])) return false;
    }

    return true;
  };

  const typeConfig = { showFullClass: true };
  if (type(object1, typeConfig) !== type(object2, typeConfig)) {
    return false;
  }

  switch (type(object1, { simplify: true })) {
    case "array":
      return compareArray(object1, object2);
    case "object":
      return compareObject(object1, object2);
    default:
      return object1 === object2;
  }
}
