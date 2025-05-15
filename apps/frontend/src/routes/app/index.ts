import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  loader: () => {
    redirect({
      to: "/app/files",
      throw: true,
    });
  },
});
