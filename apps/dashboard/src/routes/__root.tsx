import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import "../../styles.css";
import type { ServerInfo } from "@repo/db/types";
import type { QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { Session, User } from "better-auth";
import { authQueries } from "@/queries/auth";
import { serverInfoQueries } from "@/queries/server-info";

type RouterContext = {
  session: Session | undefined;
  serverInfo: ServerInfo | undefined;
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
      const serverInfo = await context.queryClient.fetchQuery(serverInfoQueries.serverInfo());
      const userSession = await context.queryClient.fetchQuery(authQueries.session());
      return { session: userSession.session, serverInfo, user: userSession.user };
    } catch (error) {
      console.error(error, "Session loading failed: backend likely not available");
      return {
        session: null,
        user: null,
        serverInfo: {
          authMode: "password",
        },
      };
    }
  },
  notFoundComponent: () => <div>404 Not Found</div>,
});
