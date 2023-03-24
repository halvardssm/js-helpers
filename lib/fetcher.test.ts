import { FetcherError } from "./fetcher.ts";
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
