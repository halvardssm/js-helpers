import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import { STATUS_CODE } from "@std/http";
import { createHttpError, HttpError, isHttpError } from "./http_error.ts";

describe("HttpError tests", () => {
  it("Test HttpError constructor", () => {
    const error = new HttpError("test", STATUS_CODE.BadRequest, {
      data: "asdf",
    });
    assertEquals(error.name, "BadRequest");
    assertEquals(error.message, "test");
    assertEquals(error.statusCode, 400);
    assertEquals(error.data, "asdf");

    assertThrows(
      () => {
        throw error;
      },
      HttpError,
      "test",
    );
  });

  it("Test isHttpError", () => {
    const httpError = new HttpError("test", STATUS_CODE.OK);
    const error = new Error("test");

    assertEquals(isHttpError(httpError), true);
    assertEquals(isHttpError(error), false);
  });

  it("Test createHttpError", () => {
    const error = createHttpError.OK("test", { data: "asdf" });

    assertEquals(isHttpError(error), true);
    assertEquals(error.name, "OK");
    assertEquals(error.message, "test");
    assertEquals(error.statusCode, 200);
    assertEquals(error.data, "asdf");

    assertThrows(
      () => {
        throw error;
      },
      HttpError,
      "test",
    );
  });
});
