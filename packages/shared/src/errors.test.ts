import { describe, expect, test } from "bun:test";
import { ApiError, ApiErrorCode } from "./errors";

describe("ApiError", () => {
  test("serializes the stable public error contract", () => {
    const error = new ApiError("Missing", 404, ApiErrorCode.NOT_FOUND, "/api/items/1");

    expect(error.name).toBe("ApiError");
    expect(error.toJSON()).toEqual({
      error: "Missing",
      code: ApiErrorCode.NOT_FOUND,
      path: "/api/items/1",
    });
  });
});
