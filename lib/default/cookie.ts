/** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
export const CookieSameSite = {
  Strict: "Strict",
  Lax: "Lax",
  None: "None",
} as const;

export type CookieSameSite = typeof CookieSameSite[keyof typeof CookieSameSite];

/** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes */
export const CookiePrefix = {
  /**
   * Cookies with names starting with __Secure- (dash is part of the prefix)
   * must be set with the secure flag from a secure page (HTTPS).
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
   */
  Secure: "__Secure-",
  /**
   * Cookies with names starting with __Host- must be set with the secure flag,
   * must be from a secure page (HTTPS), must not have a domain specified
   * (and therefore, are not sent to subdomains), and the path must be /.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes
   */
  Host: "__Host-",
} as const;

export type CookiePrefix = typeof CookiePrefix[keyof typeof CookiePrefix];

/** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
export type CookieKey = string;
/** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
export type CookieValue = string;

export type CookieOptions = {
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  expires?: Date;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  maxAge?: number;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  domain?: string;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  path?: string;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  secure?: boolean;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  httpOnly?: boolean;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  sameSite?: CookieSameSite;
  /** See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes */
  prefix?: CookiePrefix;
  /** Indicates wether the value should be URL Encoded */
  encodeValue?: boolean;
};

export class Cookie {
  #key: CookieKey;
  #value: CookieValue;
  expires?: CookieOptions["expires"];
  maxAge?: CookieOptions["maxAge"];
  domain?: CookieOptions["domain"];
  path?: CookieOptions["path"];
  secure?: CookieOptions["secure"];
  httpOnly?: CookieOptions["httpOnly"];
  sameSite?: CookieOptions["sameSite"];
  prefix?: CookieOptions["prefix"];
  encodeValue?: CookieOptions["encodeValue"];

  /**
   * @param value Can optionally be wrapped in double quotes and include any
   *    US-ASCII character excluding a control character, Whitespace, double
   *    quotes, comma, semicolon, and backslash.
   */
  constructor(key: CookieKey, value: CookieValue, options?: CookieOptions) {
    this.#key = key;
    this.#value = value;
    this.expires = options?.expires;
    this.maxAge = options?.maxAge;
    this.domain = options?.domain;
    this.path = options?.path;
    this.secure = options?.secure;
    this.httpOnly = options?.httpOnly;
    this.sameSite = options?.sameSite;
    this.prefix = options?.prefix;
    this.encodeValue = options?.encodeValue;
  }

  get key(): CookieKey {
    return this.prefix ? this.prefix + this.#key : this.#key;
  }

  set key(value: CookieKey) {
    this.#key = value;
  }

  get value(): CookieValue {
    return this.encodeValue ? encodeURIComponent(this.#value) : this.#value;
  }

  set value(value: CookieValue) {
    this.#value = value;
  }

  toString(): string {
    return [
      `${this.key}=${this.value}`,
      this.expires && `Expires=${this.expires.toUTCString()}`,
      this.maxAge && `Max-Age=${this.maxAge}`,
      this.domain && `Domain=${this.domain}`,
      this.path && `Path=${this.path}`,
      this.sameSite && `SameSite=${this.sameSite}`,
      this.secure && `Secure`,
      this.httpOnly && `HttpOnly`,
    ]
      .filter(Boolean)
      .join("; ");
  }

  /**
   * Should parse a Set-Cookie string as defined here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
   * E.g. `__Secure-testKey=testValue; Expires=Sun, 14 Jun 2020 11:01:58 GMT; Max-Age=10; Domain=example.com; Path=/; SameSite=Strict; Secure; HttpOnly`
   */
  static parseSetCookieString(cookie: string): Cookie {
    const parts = cookie.split(";").map(stringTrim);
    if (parts.length < 1) throw new CookieError("Cookie string is not valid");

    let [key, value] = parts[0].split("=").map(stringTrim);

    const options: CookieOptions = {};

    if (key.startsWith(CookiePrefix.Host)) {
      options.prefix = CookiePrefix.Host;
      key = key.slice(CookiePrefix.Host.length);
    } else if (key.startsWith(CookiePrefix.Secure)) {
      options.prefix = CookiePrefix.Secure;
      key = key.slice(CookiePrefix.Secure.length);
    }

    for (let i = 1; i < parts.length; i++) {
      const [attributeKey, attributeValue] = parts[i].split("=", 2)
        .map(stringTrim);
      switch (attributeKey.toLowerCase()) {
        case "expires":
          options.expires = new Date(attributeValue);
          break;
        case "max-age":
          options.maxAge = parseInt(attributeValue);
          break;
        case "domain":
          options.domain = attributeValue;
          break;
        case "path":
          options.path = attributeValue;
          break;
        case "samesite": {
          let val: CookieSameSite | undefined = undefined;

          for (const [k, v] of Object.entries(CookieSameSite)) {
            const isAllowedValue =
              k.toLowerCase() === attributeValue.toLowerCase();

            if (isAllowedValue) val = v;
          }

          if (!val) {
            throw new CookieError(
              `SameSite attribute value '${attributeValue}' is not allowed`,
            );
          }

          options.sameSite = val;
          break;
        }
        case "secure":
          options.secure = true;
          break;
        case "httponly":
          options.httpOnly = true;
          break;
        default:
          throw new CookieError(
            `Atribute '${attributeKey}' is not a valid key`,
          );
      }
    }

    return new Cookie(key, value, options);
  }

  /**
   * Should parse a set of cookies
   * E.g. `testKey=testValue; testKey2=testValue2`
   */
  static parseCookiesString(cookies: string): Cookie[] {
    return cookies.split(";").map(Cookie.parseSetCookieString);
  }
}

export class CookieError extends Error {
  name = this.constructor.name;
}

const stringTrim = (s: string) => s.trim();
