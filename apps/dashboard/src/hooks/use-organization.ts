import { useQueryClient } from "@tanstack/react-query";
import { organizationQueries } from "@/features/organization/queries/organization";
import { authClient } from "@/lib/auth-client";

export function useOrganization() {
  const queryClient = useQueryClient();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const setActiveOrganization = async (organizationId: string | null) => {
    await authClient.organization.setActive({
      organizationId: organizationId,
    });

    queryClient.invalidateQueries({ queryKey: organizationQueries.all() });
  };

  return {
    activeOrganization,
    setActiveOrganization,
  };
}
