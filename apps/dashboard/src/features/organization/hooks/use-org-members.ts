import type { Invitation } from "better-auth/plugins";
import { getInvitationSendDate } from "@/lib/date";
import { useCurrentOrganization } from "./use-current-organization";

export type OrgMemberInvitation = TransformedMember | TransformedInvitation;

type TransformedMember = {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  createdAt: Date;
  organizationId: string;
};

type TransformedInvitation = {
  id: string;
  email: string;
  role: "member" | "admin" | "owner";
  status: Invitation["status"];
  issuedAt: Date;
};

export function isOrgMember(item: OrgMemberInvitation): item is TransformedMember {
  return (item as TransformedInvitation).status === undefined;
}

export function isOrgInvitation(item: OrgMemberInvitation): item is TransformedInvitation {
  return (item as TransformedInvitation).status !== undefined;
}

export function useOrgMembers() {
  const { data: fullOrg, isLoading } = useCurrentOrganization();

  const invitations: TransformedInvitation[] =
    fullOrg?.invitations
      .filter((inv) => inv.status === "pending")
      .map((invitation) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        issuedAt: getInvitationSendDate(invitation.expiresAt),
      })) || [];

  const members: TransformedMember[] =
    fullOrg?.members.map((member) => ({
      id: member.userId,
      email: member.user.email,
      role: member.role,
      createdAt: member.createdAt,
      organizationId: member.organizationId,
    })) || [];

  return {
    orgMemberInvitations: [...invitations, ...members],
    isLoading,
  };
}
