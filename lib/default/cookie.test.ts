import { Cookie, CookiePrefix, CookieSameSite } from "./cookie.ts";
import { assertEquals } from "../deps_dev.ts";

Deno.test({
  name: "Test cookie - only name and value",
  fn(): void {
    const res = new Cookie("testKey", "testValue");
    assertEquals(res.toString(), "testKey=testValue");
  },
});

Deno.test({
  name: "Test cookie - get & set key",
  fn(): void {
    const res = new Cookie("testKey", "testValue");
    assertEquals(res.key, "testKey");
    res.prefix = CookiePrefix.Secure;
    assertEquals(res.key, "__Secure-testKey");
    res.prefix = CookiePrefix.Host;
    assertEquals(res.key, "__Host-testKey");
    res.prefix = undefined;
    assertEquals(res.key, "testKey");
  },
});

Deno.test({
  name: "Test cookie - get & set value",
  fn(): void {
    const res = new Cookie("testKey", "testValue/");
    assertEquals(res.value, "testValue/");
    res.encodeValue = true;
    assertEquals(res.value, "testValue%2F");
    res.encodeValue = false;
    assertEquals(res.value, "testValue/");
    res.encodeValue = undefined;
    assertEquals(res.value, "testValue/");
  },
});

Deno.test({
  name: "Test cookie - all options",
  fn(): void {
    const TEST_DATE = new Date(Date.UTC(2020, 5, 14, 11, 1, 58));

    const res = new Cookie("testKey", "testValue", {
      expires: TEST_DATE,
      maxAge: 10,
      domain: "example.com",
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: CookieSameSite.Strict,
      prefix: CookiePrefix.Secure,
    });
    assertEquals(
      res.toString(),
      "__Secure-testKey=testValue; Expires=Sun, 14 Jun 2020 11:01:58 GMT; Max-Age=10; Domain=example.com; Path=/; SameSite=Strict; Secure; HttpOnly",
    );
  },
});

Deno.test({
  name: "Test cookie - parseSetCookieString",
  fn(): void {
    const COOKIE_STRING =
      "__Secure-testKey=testValue; Expires=Sun, 14 Jun 2020 11:01:58 GMT; Max-Age=10; Domain=example.com; Path=/; SameSite=Strict; Secure; HttpOnly";
    const res = Cookie.parseSetCookieString(COOKIE_STRING);
    assertEquals(res.toString(), COOKIE_STRING);
    const COOKIE_STRING_LOWER_CASE =
      "__Secure-testKey=testValue; expires=Sun, 14 Jun 2020 11:01:58 GMT; max-age=10; domain=example.com; path=/; samesite=strict; secure; httponly";
    const res2 = Cookie.parseSetCookieString(COOKIE_STRING_LOWER_CASE);
    assertEquals(res2.toString(), COOKIE_STRING);
  },
});

Deno.test({
  name: "Test cookie - parseCookiesString",
  fn(): void {
    const COOIE_STRING = "testKey=testValue; testKey2=testValue2";
    const res = Cookie.parseCookiesString(COOIE_STRING).map((el) =>
      el.toString()
    ).join("; ");
    assertEquals(res, COOIE_STRING);
  },
});
