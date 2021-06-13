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
  showFullClass?: boolean;
  simplify?: boolean;
};
// deno-lint-ignore no-explicit-any
export function type(obj: any, options: TypeOptions = {}): Type {
  // get toPrototypeString() of obj (handles all types)
  if (options.showFullClass && typeof obj === "object") {
    return Object.prototype.toString.call(obj) as Type;
  }
  if (obj === null) return (obj + "").toLowerCase() as Type; // implicit toString() conversion

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
      : typeof obj) as Type;
  }

  if (deepType === "generatorfunction") return "generator";

  return deepType as Type;
}
