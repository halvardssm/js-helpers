import { STATUS_CODE, STATUS_TEXT, StatusCode } from "@std/http";

export type HttpErrorOptions = {
  // deno-lint-ignore no-explicit-any
  data?: any;
};

export class HttpError extends Error {
  data?: HttpErrorOptions["data"];
  constructor(
    message: string,
    public statusCode: StatusCode,
    options: HttpErrorOptions = {},
  ) {
    super(message);
    this.name = STATUS_TEXT[statusCode]?.replaceAll(" ", "") ??
      this.constructor.name;
    if (options.data) this.data = options.data;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return Boolean(error instanceof HttpError);
}

export type CreateHttpErrorFn = (
  message: string,
  options?: HttpErrorOptions,
) => HttpError;

export const createHttpError: Record<
  keyof typeof STATUS_CODE,
  CreateHttpErrorFn
> = Object.entries(STATUS_CODE).reduce(
  (prev, [key, value]) => {
    const fn: CreateHttpErrorFn = (message, options) =>
      new HttpError(message, value, options);

    return { ...prev, [key]: fn };
  },
  {},
) as Record<keyof typeof STATUS_CODE, CreateHttpErrorFn>;
