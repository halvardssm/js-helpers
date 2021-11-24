import { Fetcher, FetcherError } from "./fetcher.ts";
import { assertEquals, assertThrows } from "./deps.ts";

Deno.test({
  name: "Test FetcherError",
  fn() {
    const error = new FetcherError(
      new Response(undefined, { statusText: "test" }),
    );
    assertEquals(error.message, "test");
    assertEquals(error.name, "FetcherError");

    assertThrows(
      () => {
        throw error;
      },
      FetcherError,
      "test",
    );
  },
});

Deno.test({
  name: "Test Fetcher - Get and set baseUrl",
  fn() {
    assertEquals(Fetcher.baseUrl, undefined);
    Fetcher.baseUrl = "http://localhost";
    assertEquals(Fetcher.baseUrl, "http://localhost");
  },
});

Deno.test({
  name: "Test Fetcher - Get and set token",
  fn() {
    assertEquals(Fetcher.token, undefined);
    assertEquals(Fetcher.hasToken, false);
    Fetcher.token = "test";
    assertEquals(Fetcher.token, "test");
    assertEquals(Fetcher.hasToken, true);
  },
});
