import { authClient } from "@/lib/auth-client";

export function useActiveOrgId() {
  const { data: session } = authClient.useSession();
  return session?.session?.activeOrganizationId ?? "";
}
