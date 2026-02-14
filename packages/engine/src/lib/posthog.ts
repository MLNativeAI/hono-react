import { logger } from "@repo/shared";
import { envVars } from "@repo/shared/env";
import { PostHog } from "posthog-node";

export const posthogClient = envVars.POSTHOG_API_KEY
  ? new PostHog(envVars.POSTHOG_API_KEY, {
      host: "https://eu.i.posthog.com",
    })
  : undefined;

if (!posthogClient) {
  logger.warn("Posthog is not enabled");
}

export async function flushPosthog() {
  await posthogClient?.shutdown(); // On program exit, call shutdown to stop pending pollers and flush any remaining events
}
