import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { apikey } from "../schema";
import type { ApiKey } from "../types/api-keys";
import type { DbApiKey } from "../types/tables";

export async function getApiKeys({ organizationId }: { organizationId: string }) {
  const data = await db.query.apikey.findMany({
    where: and(eq(apikey.referenceId, organizationId), eq(apikey.enabled, true)),
  });

  const apiKeys: ApiKey[] = data.map((fullKey) => {
    return {
      id: fullKey.id,
      name: fullKey.name,
      userId: fullKey.userId,
      enabled: fullKey.enabled ?? true,
      key: `${fullKey.start}*****`,
      lastRequest: fullKey.lastRequest ? fullKey.lastRequest.toISOString() : null,
      createdAt: fullKey.createdAt.toISOString(),
    };
  });
  return apiKeys;
}

export async function getAuthFromApiKey({ apiKeyId }: { apiKeyId: string }) {
  const apiKey = await db.query.apikey.findFirst({
    where: eq(apikey.id, apiKeyId),
  });
  if (!apiKey) {
    throw new Error("Api key not found");
  }
  // For org-owned keys the owner is the organization (referenceId).
  return { organizationId: apiKey.referenceId, userId: apiKey.userId };
}

export async function getApiKey({
  apiKeyId,
  organizationId,
}: {
  apiKeyId: string;
  organizationId: string;
}): Promise<DbApiKey> {
  const apiKey = await db.query.apikey.findFirst({
    where: and(eq(apikey.referenceId, organizationId), eq(apikey.id, apiKeyId)),
  });
  if (!apiKey) {
    throw new Error("Api key not found");
  }
  return apiKey;
}
