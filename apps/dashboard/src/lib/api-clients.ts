import type { ApiKeysRoutes, InternalRoutes, ProjectsRoutes } from "@repo/api/routes";
import { hc } from "hono/client";
import { getApiUrl } from "./url";

export const apiKeysV1Client = hc<ApiKeysRoutes>(`${getApiUrl()}/api/v1/api-keys`, {
  init: {
    credentials: "include",
  },
});

export const projectsV1Client = hc<ProjectsRoutes>(`${getApiUrl()}/api/v1/projects`, {
  init: {
    credentials: "include",
  },
});

export const internalClient = hc<InternalRoutes>(`${getApiUrl()}/api/internal`, {
  init: {
    credentials: "include",
  },
});
