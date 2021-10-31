// deno-lint-ignore-file no-explicit-any
import { type } from "./type.ts";

export type PredicateOptions<T = any> = {
  object: T;
  predicates: Predicate[];
  cloner: Cloner<T>;
};
/** A predicate takes an element, and returns an array
 * with a boolean for if the cloning was executed and the
 * return value contains a clone, the second element is the
 * cloned element if previous was true.
 *
 * Returns [wasCloned, clonedElement]
 */
export type Predicate<T = any> = (
  options: PredicateOptions<T>,
) => [true, T] | [false, undefined];
export type Cloner<T = any> = (options: PredicateOptions<T>) => T;
export type DeepCloneOptions = {
  predicates?: Predicate[];
  override?: boolean;
};

export const cloneArray: Predicate<any[]> = ({
  object,
  predicates,
  cloner,
}) => {
  if (type(object) !== "array") return [false, undefined];

  const newObject: any[] = [];

  for (const el of object) {
    newObject.push(cloner({ object: el, predicates, cloner }));
  }

  return [true, newObject];
};

export const cloneObject: Predicate = ({
  object,
  predicates,
  cloner,
}) => {
  if (type(object) !== "object") return [false, undefined];

  const newObject: any = {};

  for (const [key, value] of Object.entries(object)) {
    newObject[key] = cloner({ object: value, predicates, cloner });
  }

  return [true, newObject];
};

export const cloneDate: Predicate<Date> = ({ object }) => {
  if (type(object) !== "date") return [false, undefined];

  const newObject = new Date(object);

  return [true, newObject];
};

/** Will deep clone any element using provided predicates.
 * By default, deep clone is only supported for primitives, json objects and arrays.
 * If you need a custom object cloner, this can be provided in the options.
 * See cloneArray, cloneObject and cloneDate for predicate samples
 *
 *        const obj = {a:[{b:1}]}
 *        const clone = deepClone(obj)
 *        clone.a = 2
 *        console.log(obj) // {a:[{b:1}]}
 *        console.log(clone) // {a:2}
 */
export function deepClone<T>(object: T, options: DeepCloneOptions = {}): T {
  const cloner: Cloner = (options) => {
    for (const fn of options.predicates) {
      const [wasCloned, clonedElement] = fn(options);

      if (wasCloned) return clonedElement;
    }

    return options.object;
  };

  const predicates: Predicate[] = [...(options.predicates ?? [])];

  if (!options.override) {
    predicates.push(cloneArray, cloneObject);
  }

  return cloner({ object, predicates, cloner });
}
