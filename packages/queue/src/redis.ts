import { logger } from "@repo/shared";
import { envVars } from "@repo/shared/env";
import IORedis from "ioredis";

export const redisConnection = new IORedis(envVars.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

redisConnection.on("connect", () => {
  logger.info("Redis connected");
});

redisConnection.on("error", (error) => {
  logger.error(error, "Redis connection error:");
});

redisConnection.on("close", () => {
  logger.info("Redis connection closed");
});
