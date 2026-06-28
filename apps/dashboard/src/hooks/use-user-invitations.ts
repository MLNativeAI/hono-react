import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/use-organization";
import { internalClient } from "@/lib/api-clients";
import { authClient } from "@/lib/auth-client";

export function useUserInvitations() {
  const { setActiveOrganization } = useOrganization();
  const queryClient = useQueryClient();
  const {
    data: invitations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-invitations"],
    queryFn: async () => {
      // Use the internal route that enriches invitations with org names —
      // the better-auth client plugin returns raw rows without organizationName.
      const res = await internalClient.invitations.$get();
      if (!res.ok) {
        throw new Error("Failed to load invitations");
      }
      return res.json();
    },
  });

  const acceptInvitation = async (invitationId: string, orgName: string) => {
    const { data: invResponse } = await authClient.organization.acceptInvitation({
      invitationId: invitationId,
    });
    if (!invResponse) {
      toast.error(`Failed to join ${orgName}`);
      return;
    }
    // Make the accepted org active for the current session. This refreshes the
    // session cookie and persists the preference via the session.update mirror.
    await setActiveOrganization(invResponse.invitation.organizationId);
    toast.success(`You've joined the ${orgName} Organization`);
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
  };

  const rejectInvitation = async (invitationId: string, orgName: string) => {
    await authClient.organization.rejectInvitation({
      invitationId: invitationId,
    });
    toast.success(`Invitation to ${orgName} rejected`);
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
  };

  return {
    acceptInvitation,
    rejectInvitation,
    invitations,
    isLoading,
    error,
  };
}
