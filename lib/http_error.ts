import { Status, STATUS_TEXT } from "./deps.ts";

export type HttpErrorOptions = {
  data?: any;
};

export class HttpError extends Error {
  data?: any;
  constructor(
    message: string,
    public statusCode: Status,
    options: HttpErrorOptions = {},
  ) {
    super(message);
    this.name = STATUS_TEXT.get(statusCode)?.replaceAll(" ", "") ??
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

export const createHttpError = Object.entries(Status).reduce(
  (prev, [key, value]) => {
    const fn: CreateHttpErrorFn = (message, options) =>
      new HttpError(message, value as number, options);

    return { ...prev, [key]: fn };
  },
  {},
) as Record<keyof typeof Status, CreateHttpErrorFn>;
