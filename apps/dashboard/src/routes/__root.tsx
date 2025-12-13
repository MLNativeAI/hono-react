import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import "../../styles.css";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { Session, User } from "better-auth";
import { authQueries } from "@/queries/auth";

type RouterContext = {
  session: Session | undefined;
  user: User | undefined;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  beforeLoad: async ({ context }) => {
    try {
      const userSession = await context.queryClient.fetchQuery(authQueries.session());
      return { session: userSession.session, user: userSession.user };
    } catch (error) {
      console.error(error, "Session loading failed: backend likely not available");
      return { session: null, user: null };
    }
  },
  notFoundComponent: () => <div>404 Not Found</div>,
});
