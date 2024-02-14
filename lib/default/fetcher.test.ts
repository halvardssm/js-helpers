import { Fetcher, FetcherError, ValidatorFetcher } from "./fetcher.ts";
import {
  assertEquals,
  assertInstanceOf,
  assertThrows,
  describe,
  it,
} from "../deps_dev.ts";

describe("fetcher tests", () => {
  describe("Test FetcherError", () => {
    it("should return FetcherError", () => {
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
    });
  });

  describe("Test Fetcher", () => {
    it("should return Fetcher", () => {
      const fetcher = new Fetcher();
      assertInstanceOf(fetcher, Fetcher);
      assertEquals(fetcher.baseUrl, undefined);
      assertEquals(fetcher.requestInit, {});
    });

    it("should test combineUrl", () => {
      const fetcher = new class extends Fetcher {
        combineUrl(...urls: (string | URL)[]) {
          return super.combineUrl(...urls);
        }
      }();

      assertEquals(fetcher.baseUrl, undefined);

      fetcher.baseUrl = new URL("https://example.com");
      assertEquals(fetcher.baseUrl, new URL("https://example.com"));

      assertEquals(fetcher.combineUrl()?.toString(), "https://example.com/");
      assertEquals(
        fetcher.combineUrl("/test")?.toString(),
        "https://example.com/test",
      );
      assertEquals(
        fetcher.combineUrl("/test", "test2", "/test3")?.toString(),
        "https://example.com/test/test2/test3",
      );
      assertEquals(
        fetcher.combineUrl("/test", "https://test.com", "/test3")?.toString(),
        "https://test.com/test3",
      );
    });
  });
});
