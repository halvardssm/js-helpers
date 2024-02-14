import { ZodType } from "./deps.ts";

export type RequesterParameters = Record<
  string,
  string | number | null | boolean
>;
export interface RequesterOptions<
  Parameters extends RequesterParameters = RequesterParameters,
> extends RequestInit {
  baseUrl?: string;
  parameters?: Parameters;
}

/**
 * HTTP request methods
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 */
export const HttpMethod = {
  /**
   * The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
   */
  Get: "GET",

  /**
   * The HEAD method asks for a response identical to a GET request, but without the response body.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
   */
  Head: "HEAD",

  /**
   * The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
   */
  Post: "POST",

  /**
   * The PUT method replaces all current representations of the target resource with the request payload.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
   */
  Put: "PUT",

  /**
   * The DELETE method deletes the specified resource.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
   */
  Delete: "DELETE",

  /**
   * The CONNECT method establishes a tunnel to the server identified by the target resource.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
   */
  Connect: "CONNECT",

  /**
   * The OPTIONS method describes the communication options for the target resource.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
   */
  Options: "OPTIONS",

  /**
   * The TRACE method performs a message loop-back test along the path to the target resource.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE
   */
  Trace: "TRACE",

  /**
   * The PATCH method applies partial modifications to a resource.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH
   */
  Patch: "PATCH",
} as const;

export const HttpRequestHeader = {
  Authorization: "Authorization",
} as const;

export type FetcherErrorOptions<BodyJson = unknown> = {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  bodyString: string;
  bodyJson?: BodyJson;
};

/**
 * Fetcher error class
 */
export class FetcherError<BodyJson = unknown> extends Error {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  bodyString: string;
  bodyJson?: BodyJson;
  name = this.constructor.name;

  constructor(options: FetcherErrorOptions<BodyJson>) {
    super(options.statusText);
    this.headers = options.headers;
    this.status = options.status;
    this.statusText = options.statusText;
    this.url = options.url;
    this.bodyString = options.bodyString;
    this.bodyJson = options.bodyJson;
  }

  /**
   * Parse response to FetcherError
   */
  static async parseFromResponse<BodyJson = unknown>(response: Response) {
    const bodyString = await response.text();
    let bodyJson: BodyJson | undefined = undefined;

    try {
      bodyJson = JSON.parse(bodyString);
    } catch {
      bodyJson = undefined;
    }

    return new FetcherError<BodyJson>({
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      bodyString,
      bodyJson,
    });
  }

  /**
   * Asserts that response is ok. If not, throws FetcherError.
   *
   * @throws FetcherError if response is not ok
   */
  static async assertResponse<BodyJson = unknown>(response: Response) {
    if (!response.ok) {
      throw await FetcherError.parseFromResponse<BodyJson>(response);
    }
  }
}

/**
 * Fetch class wrapper
 */
export class Fetcher {
  /**
   * Base URL for all requests. Will be combined with the input URL acording to the URL specs.
   */
  baseUrl: URL | undefined;
  /**
   * Default request options. Will be merged with request options provided to the requester method.
   */
  requestInit: RequesterOptions;

  constructor(baseUrl?: string | URL, requestInit?: RequesterOptions) {
    this.baseUrl = baseUrl ? new URL(baseUrl) : undefined;
    this.requestInit = requestInit ?? {};
  }

  /**
   * Combine multiple request options into one.
   */
  protected combineRequestInit(...inits: RequesterOptions[]): RequesterOptions {
    return inits.reduce((acc, init) => {
      const { headers, ...rest } = acc;
      return {
        ...rest,
        headers: {
          ...headers,
          ...init.headers,
        },
      };
    }, {});
  }

  /**
   * Add parameters in form of a Record to the URL object.
   */
  protected addParametersToUrl(
    url: URL,
    parameters?: RequesterOptions["parameters"],
  ) {
    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        if (key && value) {
          url.searchParams.append(key, value.toString());
        }
      }
    }
  }

  /**
   * Base requester function. Used to generate all other request methods.
   *
   * @throws FetcherError if response is not ok
   */
  async requester<
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    const url = new URL(input, options?.baseUrl || this.baseUrl);

    this.addParametersToUrl(url, options?.parameters);

    const combinedInit = this.combineRequestInit(
      this.requestInit,
      options || {},
    );

    const request = new Request(url, combinedInit);

    const response = await fetch(request);

    await FetcherError.assertResponse(response);

    return response;
  }

  /**
   * Base requester function to return json.
   *
   * @throws FetcherError if response is not ok
   * @see requester
   */
  async requesterJson<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    const response = await this.requester<R>(input, options);
    return response.json() as Promise<ResponseBody>;
  }

  /**
   * HTTP GET request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET
   * @throws FetcherError if response is not ok
   * @see requesterJson
   * @see requester
   * @see HttpMethod.Get
   */
  // deno-lint-ignore no-explicit-any
  get<ResponseBody = any, R extends RequesterOptions = RequesterOptions>(
    input: string,
    options?: R,
  ) {
    return this.requesterJson<ResponseBody, R>(input, {
      method: HttpMethod.Get,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP HEAD request
   *
   * Per specification, the HEAD method should be identical to GET, but without the response body.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/HEAD
   * @throws FetcherError if response is not ok
   * @see requester
   * @see HttpMethod.Head
   */
  head<R extends RequesterOptions = RequesterOptions>(
    input: string,
    options?: R,
  ) {
    return this.requester<R>(input, {
      method: HttpMethod.Head,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP POST request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
   * @throws FetcherError if response is not ok
   * @see requesterJson
   * @see requester
   * @see HttpMethod.Post
   */
  post<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    body: R["body"],
    options?: R,
  ) {
    return this.requesterJson<ResponseBody, R>(input, {
      method: HttpMethod.Post,
      body,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP PUT request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
   * @throws FetcherError if response is not ok
   * @see requesterJson
   * @see requester
   * @see HttpMethod.Put
   */
  // deno-lint-ignore no-explicit-any
  put<ResponseBody = any, R extends RequesterOptions = RequesterOptions>(
    input: string,
    body: R["body"],
    options?: R,
  ) {
    return this.requesterJson<ResponseBody, R>(input, {
      method: HttpMethod.Put,
      body,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP DELETE request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
   * @throws FetcherError if response is not ok
   * @see requesterJson
   * @see requester
   * @see HttpMethod.Delete
   */
  delete<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    return this.requesterJson<ResponseBody, R>(input, {
      method: HttpMethod.Delete,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP CONNECT request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/CONNECT
   * @throws FetcherError if response is not ok
   * @see requester
   * @see HttpMethod.Connect
   */
  connect<R extends RequesterOptions = RequesterOptions>(
    input: string,
    options?: R,
  ) {
    return this.requester<R>(input, {
      method: HttpMethod.Connect,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP OPTIONS request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
   * @throws FetcherError if response is not ok
   * @see requester
   * @see HttpMethod.Options
   */
  options<R extends RequesterOptions = RequesterOptions>(
    input: string,
    options?: R,
  ) {
    return this.requester<R>(input, {
      method: HttpMethod.Options,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP TRACE request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/TRACE
   * @throws FetcherError if response is not ok
   * @see requester
   * @see HttpMethod.Trace
   */
  trace<R extends RequesterOptions = RequesterOptions>(
    input: string,
    options?: R,
  ) {
    return this.requester<R>(input, {
      method: HttpMethod.Trace,
      ...(options ?? {} as R),
    });
  }

  /**
   * HTTP PATCH request
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PATCH
   * @throws FetcherError if response is not ok
   * @see requesterJson
   * @see requester
   */
  patch<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    body: R["body"],
    options?: R,
  ) {
    return this.requesterJson<ResponseBody, R>(input, {
      method: HttpMethod.Patch,
      body,
      ...(options ?? {} as R),
    });
  }
}

export interface ValidatorFetcherRequesterOptions extends RequesterOptions {
  /**
   * Zod validator for request parameters
   */
  requestParametersValidator?: ZodType;
  /**
   * Zod validator for request body
   */
  requestBodyValidator?: ZodType;
  /**
   * Zod validator for response body
   */
  responseBodyValidator?: ZodType;
}

/**
 *  Fetcher with request and response validation
 *
 * Will throw ZodError if validation is provided and fails.
 *
 * @inheritdoc
 */
export class ValidatorFetcher extends Fetcher {
  protected requestParametersValidator?: ZodType;
  protected requestBodyValidator?: ZodType;
  protected responseBodyValidator?: ZodType;

  constructor(
    baseUrl?: string | URL,
    requestInit?: ValidatorFetcherRequesterOptions,
  ) {
    super(baseUrl, requestInit);
  }

  /**
   * @inheritdoc
   */
  async requester<
    R extends ValidatorFetcherRequesterOptions =
      ValidatorFetcherRequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    const requestParametersValidator = options?.requestParametersValidator ||
      this.requestParametersValidator;
    if (options?.parameters) {
      requestParametersValidator?.parse(options.parameters);
    }

    const requestBodyValidator = options?.requestBodyValidator ||
      this.requestBodyValidator;
    if (options?.body) {
      requestBodyValidator?.parse(options.body);
    }

    const response = await super.requester(input, options);

    return response;
  }

  /**
   * @inheritdoc
   */
  async requesterJson<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends ValidatorFetcherRequesterOptions =
      ValidatorFetcherRequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    const response = await this.requester<R>(input, options);
    const responseBody = response.json() as Promise<ResponseBody>;

    const responseBodyValidator = options?.responseBodyValidator ||
      this.responseBodyValidator;
    responseBodyValidator?.parse(await responseBody);

    return responseBody;
  }
}
