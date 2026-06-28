import { zValidator } from "@hono/zod-validator";
import { auth, requirePermission } from "@repo/auth";
import { getAuthContext } from "@repo/auth/session";
import { getApiKey, getApiKeys } from "@repo/db";
import { ApiError, ApiErrorCode } from "@repo/shared";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const router = app
  .get("/", requirePermission("apiKey", "read"), async (c) => {
    const { organizationId } = await getAuthContext(c);
    const apiKeys = await getApiKeys({
      organizationId,
    });
    return c.json(apiKeys);
  })
  .post(
    "/",
    zValidator("json", z.object({ name: z.string().min(1) })),
    requirePermission("apiKey", "create"),
    async (c) => {
      const { name } = c.req.valid("json");
      const { organizationId } = await getAuthContext(c);
      // Org-owned key: the organization is the key owner in a single write,
      // and the key inherits the creating member's permissions.
      const newKey = await auth.api.createApiKey({
        body: {
          name,
          organizationId,
        },
        headers: c.req.raw.headers,
      });

      return c.json({
        id: newKey.id,
        name: newKey.name,
        key: newKey.key,
      });
    },
  )
  .delete(
    "/:id",
    requirePermission("apiKey", "delete"),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { organizationId } = await getAuthContext(c);

      try {
        await getApiKey({ organizationId, apiKeyId: id });
      } catch (_) {
        throw new ApiError("Key not found", 404, ApiErrorCode.NOT_FOUND, c.req.path);
      }
      await auth.api.updateApiKey({
        body: {
          keyId: id,
          enabled: false,
        },
        headers: c.req.raw.headers,
      });

      return c.json({ message: "API key revoked successfully" });
    },
  );

export { router as v1ApiKeyRouter };

export type ApiKeysRoutes = typeof router;
