export type GetEnvVariableOptions = {
  /**
   * Uses the value provided if not found in the environment
   */
  defaultValue?: string;
  /**
   * If true, will throw an error if the variable is not found
   */
  shouldThrow?: boolean;
  /**
   * If true, will be silent (no logging)
   */
  silent?: boolean;
};

/**
 * Simplified version of getEnvVariable.
 * Options are now available in the form of an object as the second argument.
 */
export function getEnvVar(
  name: string,
  options?: GetEnvVariableOptions & { shouldThrow: true },
): string | never;
export function getEnvVar(
  name: string,
  options?: GetEnvVariableOptions & { defaultValue: string },
): string;
export function getEnvVar(
  name: string,
  options?: GetEnvVariableOptions,
): string | undefined;
export function getEnvVar(
  name: string,
  options?: GetEnvVariableOptions,
): string | undefined | never {
  const value = Deno.env.get(name);
  if (!value || value === "N/A") {
    const msg = `Environment variables - No value found for '${name}'`;
    if (!options?.silent) console.warn(msg);
    if (options?.shouldThrow) throw new Error(msg);
    return options?.defaultValue;
  } else {
    return value;
  }
}

export function safeGetEnvVars<T extends string = string>(
  names: T[],
): Record<T, string> {
  // @ts-ignore: A simple and dirty way to get the type correctly
  const envVars: Record<T, string> = {};
  const missingVars = [];
  for (const name of names) {
    const value = Deno.env.get(name);
    if (value) {
      envVars[name] = value;
    } else {
      missingVars.push(name);
    }
  }

  if (missingVars.length > 0) {
    throw new Deno.errors.NotFound(
      `Missing environment variables: ${missingVars.join(", ")}`,
    );
  }

  return envVars;
}

/**
 * Validates that the expected environment variables are set.
 *
 * By default it will throw an error if any of the expected variables are missing,
 * but can return a list of missing variables instead if the `shouldThrow` option is false.
 */
export function validateEnvVars(
  expected: string[],
  options: {
    /**
     * The actual environment variables to validate.
     *
     * @default Deno.env.toObject()
     * @default process.env
     */
    actual?: Record<string, string>;
    /**
     * Throw an error if any of the expected variables are missing.
     *
     * @default true
     */
    shouldThrow?: boolean;
    /**
     * Default variables for undefined values.
     * Will set the current environment with given values
     * if given in `expected` and undefined in `actual`.
     */
    defaultValues?: Record<string, string>;
  } = {},
) {
  const {
    actual = Deno.env.toObject(),
    shouldThrow = true,
    defaultValues = {},
  } = options;

  const missingEnvVars = new Set<string>();

  for (const envVar of new Set(expected)) {
    if (actual[envVar] === undefined) {
      if (defaultValues[envVar] !== undefined) {
        Deno.env.set(envVar, defaultValues[envVar]);
      } else {
        missingEnvVars.add(envVar);
      }
    }
  }

  if (shouldThrow && missingEnvVars.size > 0) {
    throw new Error(
      `Missing environment variable: '${[...missingEnvVars].join("|")}'`,
    );
  }

  return [...missingEnvVars];
}