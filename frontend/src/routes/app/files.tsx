import { createFileRoute } from "@tanstack/react-router";
import { FileTable } from "@/pages/FileTable";

export const Route = createFileRoute("/app/files")({
  component: FileTable,
});
