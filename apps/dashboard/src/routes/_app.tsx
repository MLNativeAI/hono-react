import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import z from "zod";
import { AppSidebar } from "@/components/app-sidebar";
import { useQueryNotifications } from "@/hooks/use-query-notifications";

export const Route = createFileRoute("/_app")({
  validateSearch: z.object({
    signedIn: z.boolean().optional(),
    newUser: z.boolean().optional(),
  }),
  component: PathlessLayoutComponent,
  beforeLoad: async ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: "/auth/sign-in",
      });
    }
  },
});

function PathlessLayoutComponent() {
  useQueryNotifications();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col px-4 py-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
