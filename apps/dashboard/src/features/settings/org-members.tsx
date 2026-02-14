import type { Member } from "better-auth/plugins";
import { useOrgMembers } from "@/features/organization/hooks/use-org-members";
import InviteDialog from "@/features/settings/invite-dialog";
import { OrgMembersTable } from "@/features/settings/org-members-table";

export default function OrgMembers({ member }: { member: Member | undefined }) {
  const { orgMemberInvitations, isLoading } = useOrgMembers();

  const isAdminOrOwner = member?.role === "admin" || member?.role === "owner";
  const canInvite = member && isAdminOrOwner;

  return (
    <div className="space-y-6">
      <div className={`flex justify-between items-center`}>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage who has access to your organization</p>
        </div>
        {canInvite && (
          <div>
            <InviteDialog />
          </div>
        )}
      </div>
      <div className={`pt-4`}>
        {member?.role && (
          <OrgMembersTable
            data={orgMemberInvitations}
            userId={member.userId}
            isAdmin={isAdminOrOwner}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
