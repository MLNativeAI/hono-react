import { useQuery } from "@tanstack/react-query";
import { organizationQueries } from "../queries/organization";
import { useActiveOrgId } from "./use-active-org-id";

export function useCurrentOrganization() {
  const orgId = useActiveOrgId();

  return useQuery({
    ...organizationQueries.current(),
    // VITAL: We override the key to include the orgId.
    // Even if the API endpoint is just '/org/current' and reads from cookies,
    // changing this key tells React Query "The context changed, fetch again!"
    queryKey: ["organization", "current", orgId],
    enabled: !!orgId, // Don't fetch if logged out
  });
}
