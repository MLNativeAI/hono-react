import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@repo/ui/components/sidebar";
import { Link } from "@tanstack/react-router";
import { FileText, Folder, Settings } from "lucide-react";
import type * as React from "react";
import { OrgSwitcher } from "@/features/organization/components/org-switcher";
import { NavUser } from "./nav-user";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: FileText,
      tourId: "home",
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Folder,
      tourId: "projects",
    },
    {
      title: "Settings",
      url: "/settings/api-keys",
      icon: Settings,
      tourId: "settings",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <OrgSwitcher />
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isExternal = item.url.startsWith("http");
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  {isExternal ? (
                    <SidebarMenuButton
                      render={
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          {...(item.tourId ? { "data-tour": item.tourId } : {})}
                        />
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      render={
                        <Link
                          to={item.url}
                          activeProps={{
                            className: "bg-sidebar-accent text-sidebar-accent-foreground",
                          }}
                          viewTransition={{ types: ["cross-fade"] }}
                          {...(item.tourId ? { "data-tour": item.tourId } : {})}
                        />
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
