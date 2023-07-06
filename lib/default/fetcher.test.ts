import { FetcherError } from "./fetcher.ts";
import { assertEquals, assertThrows } from "./deps.ts";

Deno.test({
  name: "Test FetcherError",
  fn() {
    const error = new FetcherError({
      bodyString: "test",
      headers: new Headers(),
      status: 200,
      statusText: "OK",
      url: "https://example.com",
    });
    assertEquals(error.message, "OK");
    assertEquals(error.name, "FetcherError");

    assertThrows(
      () => {
        throw error;
      },
      FetcherError,
      "OK",
    );
  },
});
