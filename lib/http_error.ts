import { Status, STATUS_TEXT } from "./deps.ts";

export class HttpError extends Error {
  constructor(message: string, public statusCode: Status, public data?: any) {
    super(message);
    this.name = STATUS_TEXT.get(statusCode)?.replaceAll(" ", "") ??
      this.constructor.name;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return Boolean(error instanceof HttpError);
}

export type CreateHttpErrorFn = (message: string, data?: any) => HttpError;

export const createHttpError = Object.entries(Status).reduce(
  (prev, [key, value]) => {
    return {
      ...prev,
      [key]: (message: string, data?: any) =>
        new HttpError(message, value as number, data),
    };
  },
  {},
) as Record<keyof typeof Status, CreateHttpErrorFn>;
