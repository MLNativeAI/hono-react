import { Avatar } from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@repo/ui/components/sidebar";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import OrgLogoWithFallback from "@/components/org-logo-with-fallback";
import { CreateOrgDialog } from "@/features/settings/create-org-dialog";
import { useOrganization } from "@/hooks/use-organization";
import { authClient } from "@/lib/auth-client";

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const { activeOrganization, setActiveOrganization } = useOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                />
              }
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {activeOrganization && <OrgLogoWithFallback activeOrganization={activeOrganization} />}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization ? `${activeOrganization?.name} ` : "..."}{" "}
                </span>
                <span className="truncate text-xs"> </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-xs">Organizations</DropdownMenuLabel>
                {organizations?.map((org) => (
                  <DropdownMenuItem
                    onClick={async () => {
                      setActiveOrganization(org.id);
                    }}
                    key={org.id}
                    className="gap-2 p-2"
                  >
                    {org.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="gap-2 p-2" onClick={() => setIsCreateDialogOpen(true)}>
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="text-muted-foreground font-medium">Create organization</div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateOrgDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </>
  );
}
