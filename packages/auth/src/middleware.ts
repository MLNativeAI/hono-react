import { getAuthFromApiKey } from "@repo/db";
import { logger } from "@repo/shared";
import type { AuthContext } from "@repo/shared/types";
import type { Context, Next } from "hono";
import { auth } from "./auth";
import type { Action, OrgRole, Resource } from "./permissions";
import { roles } from "./permissions";
import { matchesPattern } from "./util/pattern";

const publicRoutes = ["/api/health", "/api/auth/**"];

export const userAuthMiddleware = async (c: Context, next: Next) => {
  if (publicRoutes.some((pattern) => matchesPattern(c.req.path, pattern))) {
    return next();
  }

  const apiKey = c.req.header("x-api-key");

  if (apiKey) {
    const data = await auth.api.verifyApiKey({
      body: {
        key: apiKey,
      },
    });
    if (data.error) {
      logger.error(data.error, "API Key validation failed");
      return c.json({ message: "Unauthorized" }, 401);
    }
    if (!data.key) {
      logger.error(data.error, "API Key missing");
      return c.json({ message: "Unauthorized" }, 401);
    }
    const { userId, organizationId } = await getAuthFromApiKey({ apiKeyId: data.key.id });

    if (!organizationId) {
      logger.error("Fatal error, API key without and org Id");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const authContext: AuthContext = {
      userId,
      organizationId,
      scope: "user",
    };
    c.set("context", authContext);
    return next();
  } else {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      logger.info("missing auth");
      return c.json({ message: "Unauthorized" }, 401);
    }
    if (!session.session.activeOrganizationId) {
      logger.info("missing auth");
      return c.json({ message: "Unauthorized" }, 401);
    }

    const authContext: AuthContext = {
      userId: session.user.id,
      organizationId: session.session.activeOrganizationId,
      scope: "user",
    };
    c.set("context", authContext);
    return next();
  }
};

/**
 * Hono middleware that checks the active member has a given permission
 * for the current organization. Uses BetterAuth's access control system
 * (the same `roles` map passed to the organization plugin) so org-scoped
 * routes share one declarative RBAC source of truth.
 *
 * For API-key requests, the key's permissions are checked via `verifyApiKey`,
 * since keys inherit the creating member's role.
 */
export const requirePermission = <R extends Resource, A extends Action<R>>(resource: R, action: A) => {
  return async (c: Context, next: Next) => {
    const apiKeyHeader = c.req.header("x-api-key");

    if (apiKeyHeader) {
      const result = await auth.api.verifyApiKey({
        body: {
          key: apiKeyHeader,
          permissions: {
            [resource]: [action],
          },
        },
      });
      if (result.error || !result.key) {
        logger.info({ resource, action }, "API key lacks required permission");
        return c.json({ message: "Forbidden" }, 403);
      }
      return next();
    }

    const activeMember = await auth.api.getActiveMember({ headers: c.req.raw.headers });
    if (!activeMember) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const role = roles[activeMember.role as OrgRole];
    const result = role?.authorize({ [resource]: [action] });
    if (!result?.success) {
      logger.info({ resource, action, role: activeMember.role }, "Member lacks required permission");
      return c.json({ message: "Forbidden" }, 403);
    }

    return next();
  };
};

export const authHandler = async (c: Context) => {
  return auth.handler(c.req.raw);
};
