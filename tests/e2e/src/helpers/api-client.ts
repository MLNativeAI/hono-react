export function getBaseUrl(): string {
  if (!process.env.E2E_API_BASE_URL) {
    throw new Error("E2E_API_BASE_URL is not set");
  }
  return process.env.E2E_API_BASE_URL;
}
