import { Link } from "@tanstack/react-router";
import { BookOpen, FileText, Settings } from "lucide-react";
import type * as React from "react";
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
} from "@/components/ui/sidebar";
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
      title: "Settings",
      url: "/settings/api-keys",
      icon: Settings,
      tourId: "settings",
    },
    {
      title: "Documentation",
      url: "https://docs.hono-react.com/",
      icon: BookOpen,
      tourId: "docs",
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
                  <SidebarMenuButton asChild>
                    {isExternal ? (
                      <a
                        href={item.url}
                        className="font-medium flex items-center gap-2"
                        target="_blank"
                        rel="noreferrer"
                        {...(item.tourId ? { "data-tour": item.tourId } : {})}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.url}
                        activeProps={{
                          className: "bg-sidebar-accent text-sidebar-accent-foreground",
                        }}
                        className="font-medium flex items-center gap-2"
                        viewTransition={{ types: ["cross-fade"] }}
                        {...(item.tourId ? { "data-tour": item.tourId } : {})}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
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
