/**
 * Http request method
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
export const HttpMethod = {
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
   */
  Get: "GET",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
   */
  Head: "HEAD",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
   */
  Post: "POST",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
   */
  Put: "PUT",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
   */
  Delete: "DELETE",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
   */
  Connect: "CONNECT",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
   */
  Options: "OPTIONS",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE
   */
  Trace: "TRACE",
  /**
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH
   */
  Patch: "PATCH",
} as const;

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];

export const FetcherHeader = {
  Authorization: "Authorization",
} as const;

export type FetcherHeader = typeof FetcherHeader[keyof typeof FetcherHeader];

export class FetcherError extends Error {
  response: Response;
  name = this.constructor.name;
  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

type RequestInput = URL | string;

export class Fetcher {
  /**
   * Base request init
   * The base request init is used to set default values for all requests.
   * Will be overridden by the request init passed to the request method based on the behavior from Object.assign.
   * This means that only top level properties will be merged.
   */
  baseRequestInit: RequestInit;

  constructor(baseRequestInit: RequestInit = {}) {
    this.baseRequestInit = baseRequestInit || {};
  }

  requester(input: RequestInput, init?: RequestInit) {
    const request = new Request(input, this.baseRequestInit);

    return fetch(request, init);
  }

  // deno-lint-ignore no-explicit-any
  async requesterJson<ResponseBody = any>(
    input: RequestInput,
    init?: RequestInit,
  ) {
    const response = await this.requester(input, init);

    if (!response.ok) {
      throw new FetcherError(response);
    }

    return response.json() as Promise<ResponseBody>;
  }

  // deno-lint-ignore no-explicit-any
  get<ResponseBody = any>(input: RequestInput, init?: RequestInit) {
    return this.requesterJson<ResponseBody>(input, {
      method: HttpMethod.Get,
      ...init,
    });
  }

  head(input: RequestInput, init?: RequestInit) {
    return this.requester(input, {
      method: HttpMethod.Head,
      ...init,
    });
  }

  // deno-lint-ignore no-explicit-any
  post<ResponseBody = any>(
    input: RequestInput,
    body: RequestInit["body"],
    init?: RequestInit,
  ) {
    return this.requesterJson<ResponseBody>(input, {
      method: HttpMethod.Post,
      body,
      ...init,
    });
  }

  // deno-lint-ignore no-explicit-any
  put<ResponseBody = any>(
    input: RequestInput,
    body: RequestInit["body"],
    init?: RequestInit,
  ) {
    return this.requesterJson<ResponseBody>(input, {
      method: HttpMethod.Put,
      body,
      ...init,
    });
  }

  // deno-lint-ignore no-explicit-any
  delete<ResponseBody = any>(
    input: RequestInput,
    init?: RequestInit,
  ) {
    return this.requesterJson<ResponseBody>(input, {
      method: HttpMethod.Delete,
      ...init,
    });
  }

  connect(input: RequestInput, init?: RequestInit) {
    return this.requester(input, {
      method: HttpMethod.Connect,
      ...init,
    });
  }

  options(input: RequestInput, init?: RequestInit) {
    return this.requester(input, {
      method: HttpMethod.Options,
      ...init,
    });
  }

  trace(input: RequestInput, init?: RequestInit) {
    return this.requester(input, {
      method: HttpMethod.Trace,
      ...init,
    });
  }

  // deno-lint-ignore no-explicit-any
  patch<ResponseBody = any>(
    input: RequestInput,
    body: RequestInit["body"],
    init?: RequestInit,
  ) {
    return this.requesterJson<ResponseBody>(input, {
      method: HttpMethod.Patch,
      body,
      ...init,
    });
  }
}
