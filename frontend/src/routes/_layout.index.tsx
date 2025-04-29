import UploadFile from "@/pages/UploadFile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
  component: Index,
});

function Index() {
  return <UploadFile />;
}
