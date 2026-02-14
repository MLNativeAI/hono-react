import { usePostHog } from "@posthog/react";
import { authClient } from "@/lib/auth-client";
import { useActiveOrgId } from "./use-active-org-id";

export function useSwitchOrganization() {
  const posthog = usePostHog();
  const currentOrgId = useActiveOrgId();

  // We need the refetch function from the session to trigger the cascade
  const { refetch: refetchSession } = authClient.useSession();

  const setActiveOrganization = async (organizationId: string) => {
    // 1. Perform the switch
    await authClient.organization.setActive({
      organizationId,
    });

    // 2. Track analytics (optional)
    if (organizationId !== currentOrgId) {
      posthog.capture("organization_switched", {
        from_organization_id: currentOrgId,
        to_organization_id: organizationId,
      });
    }

    // 3. THE TRIGGER
    // Refetching the session updates 'activeOrgId' in the hook above.
    // This automatically invalidates the keys for useCurrentOrganization
    // and any other query dependent on orgId.
    await refetchSession();
  };

  return { setActiveOrganization };
}
