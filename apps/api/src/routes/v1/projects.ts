import { zValidator } from "@hono/zod-validator";
import { requirePermission } from "@repo/auth";
import { getAuthContext } from "@repo/auth/session";
import { createProject, deleteProject, getProject, listProjects, updateProject } from "@repo/db";
import { ApiError, ApiErrorCode } from "@repo/shared";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const router = app
  .get("/", requirePermission("project", "read"), async (c) => {
    const { organizationId } = await getAuthContext(c);
    const projects = await listProjects({ organizationId });
    return c.json(projects);
  })
  .post(
    "/",
    requirePermission("project", "create"),
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      }),
    ),
    async (c) => {
      const { name, description } = c.req.valid("json");
      const { organizationId, userId } = await getAuthContext(c);
      const project = await createProject({
        organizationId,
        createdByUserId: userId,
        name,
        description: description ?? null,
      });
      return c.json(project);
    },
  )
  .patch(
    "/:id",
    requirePermission("project", "update"),
    zValidator("param", z.object({ id: z.string() })),
    zValidator(
      "json",
      z.object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).nullable().optional(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const { name, description } = c.req.valid("json");
      const { organizationId } = await getAuthContext(c);

      const existing = await getProject({ organizationId, projectId: id });
      if (!existing) {
        throw new ApiError("Project not found", 404, ApiErrorCode.NOT_FOUND, c.req.path);
      }

      const updated = await updateProject({
        organizationId,
        projectId: id,
        name,
        description,
      });
      if (!updated) {
        throw new ApiError("Project not found", 404, ApiErrorCode.NOT_FOUND, c.req.path);
      }
      return c.json({
        id: updated.id,
        name: updated.name,
        description: updated.description,
        createdByUserId: updated.createdByUserId,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      });
    },
  )
  .delete(
    "/:id",
    requirePermission("project", "delete"),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { organizationId } = await getAuthContext(c);

      const existing = await getProject({ organizationId, projectId: id });
      if (!existing) {
        throw new ApiError("Project not found", 404, ApiErrorCode.NOT_FOUND, c.req.path);
      }

      await deleteProject({ organizationId, projectId: id });
      return c.json({ message: "Project deleted successfully" });
    },
  );

export { router as v1ProjectsRouter };

export type ProjectsRoutes = typeof router;
