import { generateId, ID_PREFIXES } from "@repo/shared/id";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { project } from "../schema";
import type { Project } from "../types/project";

export async function listProjects({ organizationId }: { organizationId: string }): Promise<Project[]> {
  const rows = await db.query.project.findMany({
    where: eq(project.organizationId, organizationId),
    orderBy: desc(project.createdAt),
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getProject({ organizationId, projectId }: { organizationId: string; projectId: string }) {
  return db.query.project.findFirst({
    where: and(eq(project.id, projectId), eq(project.organizationId, organizationId)),
  });
}

export async function createProject({
  organizationId,
  createdByUserId,
  name,
  description,
}: {
  organizationId: string;
  createdByUserId: string | null;
  name: string;
  description?: string | null;
}): Promise<Project> {
  const now = new Date();
  const [row] = await db
    .insert(project)
    .values({
      id: generateId(ID_PREFIXES.project),
      organizationId,
      createdByUserId,
      name,
      description: description ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!row) {
    throw new Error("Failed to create project");
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function updateProject({
  organizationId,
  projectId,
  name,
  description,
}: {
  organizationId: string;
  projectId: string;
  name?: string;
  description?: string | null;
}) {
  const [row] = await db
    .update(project)
    .set({
      ...(name !== undefined ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(project.id, projectId), eq(project.organizationId, organizationId)))
    .returning();

  return row ?? null;
}

export async function deleteProject({ organizationId, projectId }: { organizationId: string; projectId: string }) {
  const [row] = await db
    .delete(project)
    .where(and(eq(project.id, projectId), eq(project.organizationId, organizationId)))
    .returning();
  return row ?? null;
}
