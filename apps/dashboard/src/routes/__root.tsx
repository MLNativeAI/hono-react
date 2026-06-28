import { createRootRouteWithContext, Navigate, Outlet } from "@tanstack/react-router";
import "@repo/ui/globals.css";
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
      return {
        session: null,
        user: null,
      };
    }
  },
  notFoundComponent: NotFoundRedirect,
  errorComponent: ({ error, reset }) => <ErrorBoundary error={error} reset={reset} />,
});

function NotFoundRedirect() {
  return <Navigate to="/" />;
}

function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Try again
        </button>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 rounded-md bg-muted p-4 text-left">
            <pre className="text-xs text-muted-foreground overflow-auto">{error.stack}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
