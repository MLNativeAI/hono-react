export function getBaseUrl(): string {
  return process.env.E2E_API_BASE_URL ?? process.env.API_BASE_URL ?? "http://127.0.0.1:3000";
}
