import type { auth } from "@repo/auth";
import { apiKeyClient, inferAdditionalFields, magicLinkClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const apiURL = import.meta.env.VITE_PUBLIC_API_URL || (import.meta.env.DEV ? "http://localhost:3000" : "");

export const authClient = createAuthClient({
  /** Use configured API URL in production, localhost in dev, or relative URL if not configured */
  ...(apiURL ? { baseURL: apiURL } : {}),
  plugins: [apiKeyClient(), organizationClient(), magicLinkClient(), inferAdditionalFields<typeof auth>()],
});
