export function getSafeEnvVar(
  name: string,
): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error("No value for env var: " + name);
  } else {
    return value;
  }
}
