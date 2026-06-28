import { app } from "@repo/api/routes";

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

/**
 * Drives the real Hono app in-process (no HTTP server) with optional auth
 * headers and a JSON body. Returns the parsed status + body.
 */
export async function request<T = unknown>(
  path: string,
  init: { method?: string; headers?: Headers; body?: unknown } = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  const hasBody = init.body !== undefined;
  if (hasBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const res = await app.request(path, {
    method: init.method ?? "GET",
    headers,
    body: hasBody ? JSON.stringify(init.body) : undefined,
  });

  const text = await res.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  return { status: res.status, body: body as T };
}
