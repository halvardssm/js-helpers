export interface RequesterOptions extends RequestInit {
  baseUrl?: string;
  parameters?: Record<string, string | number | null | boolean>;
}

export enum FetcherMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum FetcherHeader {
  Authorization = "Authorization",
}

export class FetcherError extends Error {
  response: Response;
  name = this.constructor.name;
  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}

export class Fetcher {
  static _baseUrl: string | undefined;
  static _token: string | undefined;

  static get baseUrl() {
    return this._baseUrl;
  }

  static set baseUrl(url: string | undefined | null) {
    if (url && url.length > 0) {
      this._baseUrl = url;
    } else {
      this._baseUrl = undefined;
    }
  }

  static set token(token: string | undefined | null) {
    if (token && token.length > 0) {
      this._token = token;
    } else {
      this._token = undefined;
    }
  }

  static get token() {
    return this._token;
  }

  static get hasToken() {
    return Boolean(this.token);
  }

  static _parseUrl(input: string, options?: RequesterOptions) {
    const baseurl = options?.baseUrl ?? this.baseUrl ?? "";

    const url = new URL(input, baseurl);

    if (options?.parameters) {
      for (const [key, value] of Object.entries(options.parameters)) {
        if (key && value) {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    return url.toString();
  }

  static async requester<ResponseBody = any>(
    input: string,
    options?: RequesterOptions,
  ) {
    const url = this._parseUrl(input, options);

    const parsedOptions: RequestInit = { ...options };

    if (this.token && parsedOptions.headers) {
      if (parsedOptions.headers instanceof Headers) {
        if (!parsedOptions.headers.has(FetcherHeader.Authorization)) {
          parsedOptions.headers.set(FetcherHeader.Authorization, this.token);
        }
      } else if (Array.isArray(parsedOptions.headers)) {
        console.warn(
          "Automatic insertion of auth token is not supported when header is array. Use Object or Header instance instead.",
        );
      } else {
        if (!parsedOptions.headers[FetcherHeader.Authorization]) {
          parsedOptions.headers[FetcherHeader.Authorization] = this.token;
        }
      }
    }

    const request = new Request(url, {
      ...options,
    });

    const response = await fetch(request);

    if (!response.ok) {
      throw new FetcherError(response);
    }

    return response.json() as Promise<ResponseBody>;
  }

  static get<ResponseBody = any>(
    ...params: Parameters<typeof this.requester>
  ) {
    return this.requester<ResponseBody>(params[0], {
      method: FetcherMethod.GET,
      ...params[1],
    });
  }

  static post<ResponseBody = any>(
    input: Parameters<typeof this.requester>[0],
    body: RequestInit["body"],
    options: Parameters<typeof this.requester>[1],
  ) {
    return this.requester<ResponseBody>(input, {
      method: FetcherMethod.POST,
      body,
      ...options,
    });
  }

  static put<ResponseBody = any>(
    input: Parameters<typeof this.requester>[0],
    body: RequestInit["body"],
    options: Parameters<typeof this.requester>[1],
  ) {
    return this.requester<ResponseBody>(input, {
      method: FetcherMethod.PUT,
      body,
      ...options,
    });
  }

  static delete<ResponseBody = any>(
    ...params: Parameters<typeof this.requester>
  ) {
    return this.requester<ResponseBody>(params[0], {
      method: FetcherMethod.DELETE,
      ...params[1],
    });
  }
}
