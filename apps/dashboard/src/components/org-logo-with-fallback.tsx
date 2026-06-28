import { AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import type { Organization } from "better-auth/plugins";

export default function OrgLogoWithFallback({ activeOrganization }: { activeOrganization: Organization }) {
  return activeOrganization.logo ? (
    <AvatarImage src={activeOrganization.logo} alt={activeOrganization.name.substring(0, 1)} />
  ) : (
    <AvatarFallback className="rounded-lg bg-secondary">
      {activeOrganization.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"}
    </AvatarFallback>
  );
}
