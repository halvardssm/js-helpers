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
