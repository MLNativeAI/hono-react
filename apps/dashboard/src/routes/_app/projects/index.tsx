import { createFileRoute } from "@tanstack/react-router";
import ProjectsPage from "@/pages/projects";

export const Route = createFileRoute("/_app/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProjectsPage />;
}
