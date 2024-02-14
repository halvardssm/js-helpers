/**
 * Make properties K in T optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make properties K in T required
 */
export type RequiredBy<T, K extends keyof T> =
  & Omit<T, K>
  & Required<Pick<T, K>>;

/**
 * Make properties K in T required, and the rest partial
 */
export type RequiredPartialBy<T, K extends keyof T> =
  & RequiredBy<
    Pick<T, K>,
    K
  >
  & Partial<Omit<T, K>>;

/**
 * Allows an object to be extended
 */
// deno-lint-ignore no-explicit-any
export type UnConstrain<T> = T & Record<any, any>;

/**
 * Gets the values of a Record
 */
export type ValueOf<T> = T[keyof T];

/**
 * This is like TS Require<T>, but you can specify the sub-property to target.
 *
 * TODO: Check if this can be removed and instead use RequiredBy
 *
 * https://stackoverflow.com/questions/69327990/how-can-i-make-one-property-non-optional-in-a-typescript-type
 */
export type RequiredSpecific<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Make properties K in T readonly
 */
export type ReadonlyBy<T, K extends keyof T> =
  & Omit<T, K>
  & Readonly<Pick<T, K>>;

/**
 * Make all properties in T writable
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Make properties K in T writable
 */
export type WriteableBy<T, K extends keyof T> =
  & Omit<T, K>
  & Writeable<Pick<T, K>>;

export type Type =
  | "undefined"
  | "array"
  | "bigint"
  | "date"
  | "error"
  | "function"
  | "generator"
  | "regexp"
  | "symbol"
  | "object"
  | "map"
  | "weakmap"
  | "set"
  | "weakset"
  | "null";

export type TypeOptions = {
  /** Will show types as [object Set] */
  showFullClass?: boolean;
  /** Will simplify types, essentially the same as
   * typeof except for that array and null are included
   */
  simplify?: boolean;
};

export type TypeOptionsFull = TypeOptions & { showFullClass: true };

/** Will get the type of any object.
 *
 *      type([]) // 'array'
 *      type(new Set()) // 'set'
 */
export function type<T extends TypeOptions>(
  // deno-lint-ignore no-explicit-any
  obj: any,
  options?: T,
): T extends TypeOptionsFull ? (Type | string) : Type;

// deno-lint-ignore no-explicit-any
export function type(obj: any, options: TypeOptions = {}) {
  // get toPrototypeString() of obj (handles all types)
  if (options.showFullClass && typeof obj === "object") {
    return Object.prototype.toString.call(obj);
  }
  if (obj === null) return (obj + "").toLowerCase(); // implicit toString() conversion

  const deepTypeFull = Object.prototype.toString.call(obj).toLowerCase();
  const deepType = deepTypeFull.slice(8, -1);

  // Prevent overspecificity (for example, [object HTMLDivElement], etc).
  // Account for functionish Regexp (Android <=2.3), functionish <object> element (Chrome <=57, Firefox <=52), etc.
  // String.prototype.match is universally supported.
  if (options.simplify) {
    if (deepType === "generatorfunction") return "function";

    const typeRegexp =
      /^(array|bigint|date|error|function|generator|regexp|symbol)$/;

    return (deepType.match(typeRegexp)
      ? deepType
      : (typeof obj === "object" || typeof obj === "function")
      ? "object"
      : typeof obj);
  }

  if (deepType === "generatorfunction") return "generator";

  return deepType;
}
