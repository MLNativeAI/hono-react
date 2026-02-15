import type { auth } from "@repo/auth";
import { apiKeyClient, inferAdditionalFields, magicLinkClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getApiUrl } from "./url";

export const authClient = createAuthClient({
  baseURL: getApiUrl(),
  plugins: [apiKeyClient(), organizationClient(), magicLinkClient(), inferAdditionalFields<typeof auth>()],
});
