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

export const FetcherMethod = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
} as const;

export const FetcherHeader = {
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
}

export class Fetcher {
  addParametersToUrl(url: URL, parameters?: RequesterOptions["parameters"]) {
    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        if (key && value) {
          url.searchParams.append(key, value.toString());
        }
      }
    }
  }

  async requester<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    const url = new URL(input, options?.baseUrl);

    this.addParametersToUrl(url, options?.parameters);

    const parsedOptions: RequestInit = { ...(options ?? {}) };

    const request = new Request(url, {
      ...parsedOptions,
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw await FetcherError.parseFromResponse(response);
    }

    return response.json() as Promise<ResponseBody>;
  }

  // deno-lint-ignore no-explicit-any
  get<ResponseBody = any, R extends RequesterOptions = RequesterOptions>(
    input: string,
    options?: R,
  ) {
    return this.requester<ResponseBody, R>(input, {
      method: FetcherMethod.Get,
      ...(options ?? {} as R),
    });
  }

  post<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    body: RequestInit["body"],
    options?: R,
  ) {
    return this.requester<ResponseBody, R>(input, {
      method: FetcherMethod.Post,
      body,
      ...(options ?? {} as R),
    });
  }

  // deno-lint-ignore no-explicit-any
  put<ResponseBody = any, R extends RequesterOptions = RequesterOptions>(
    input: string,
    body: RequestInit["body"],
    options?: R,
  ) {
    return this.requester<ResponseBody, R>(input, {
      method: FetcherMethod.Put,
      body,
      ...(options ?? {} as R),
    });
  }

  patch<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    body: RequestInit["body"],
    options?: R,
  ) {
    return this.requester<ResponseBody, R>(input, {
      method: FetcherMethod.Patch,
      body,
      ...(options ?? {} as R),
    });
  }

  delete<
    // deno-lint-ignore no-explicit-any
    ResponseBody = any,
    R extends RequesterOptions = RequesterOptions,
  >(
    input: string,
    options?: R,
  ) {
    return this.requester<ResponseBody, R>(input, {
      method: FetcherMethod.Delete,
      ...(options ?? {} as R),
    });
  }
}
