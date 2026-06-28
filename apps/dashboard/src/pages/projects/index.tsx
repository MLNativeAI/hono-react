import type { Project } from "@repo/db/types";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/table";
import { Textarea } from "@repo/ui/components/textarea";
import { IconDotsVertical, IconFolder, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateProject, useDeleteProject, useProjects } from "@/hooks/use-projects";
import { useRole } from "@/hooks/use-role";
import { formatDate } from "@/lib/date";

const canCreate = (role?: string) => role === "owner" || role === "admin";
const canDelete = (role?: string) => role === "owner";

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects();
  const { member } = useRole();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const showCreate = canCreate(member?.role);
  const showDelete = canDelete(member?.role);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Org-scoped projects managed with role-based access control.</p>
        </div>
        {showCreate && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  {showDelete && <TableHead className="w-12">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    {showDelete && (
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded" />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <IconFolder className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">No projects yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {showCreate ? "Create your first project to get started." : "Ask an admin to create a project."}
              </p>
            </div>
            {showCreate && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <IconPlus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                {showDelete && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{project.description ?? "—"}</TableCell>
                  <TableCell className="text-sm">{formatDate(project.createdAt)}</TableCell>
                  {showDelete && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              className="data-open:bg-muted text-muted-foreground flex size-8"
                              size="icon"
                            />
                          }
                        >
                          <IconDotsVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(project)}>
                            <IconTrash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

      <DeleteProjectDialog project={deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)} />
    </div>
  );
}

function CreateProjectDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { mutate: createProject, isPending } = useCreateProject();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(
      { name: name.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Project created");
          setName("");
          setDescription("");
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to create project"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Create a new project for this organization.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Project"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              disabled={isPending}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteProjectDialog({
  project,
  onOpenChange,
}: {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: deleteProject, isPending } = useDeleteProject();
  const open = project !== null;

  const onConfirm = () => {
    if (!project) return;
    deleteProject(project.id, {
      onSuccess: () => {
        toast.success("Project deleted");
        onOpenChange(false);
      },
      onError: () => toast.error("Failed to delete project"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{project?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
