import type { ContentfulStatusCode } from "hono/utils/http-status";

export enum ApiErrorCode {
  INTERNAL_ERROR = "INTERNAL_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: ContentfulStatusCode = 500,
    public code?: ApiErrorCode,
    public path?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      path: this.path,
    };
  }
}
