import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/app/homepage";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});
