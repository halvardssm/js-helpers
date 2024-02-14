import { assertEquals, assertThrows } from "../deps_dev.ts";
import { Status } from "../deps.ts";
import { createHttpError, HttpError, isHttpError } from "./http_error.ts";

Deno.test({
  name: "Test HttpError constructor",
  fn() {
    const error = new HttpError("test", Status.BadRequest, { data: "asdf" });
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
  },
});

Deno.test({
  name: "Test isHttpError",
  fn() {
    const httpError = new HttpError("test", Status.OK);
    const error = new Error("test");

    assertEquals(isHttpError(httpError), true);
    assertEquals(isHttpError(error), false);
  },
});

Deno.test({
  name: "Test createHttpError",
  fn() {
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
  },
});
