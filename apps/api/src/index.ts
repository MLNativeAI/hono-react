import { env } from "@repo/env";
import { allWorkers } from "@repo/queue";
import { logger } from "@repo/shared";
import { app } from "./routes";

const server = Bun.serve({
  port: env.PORT,
  hostname: "0.0.0.0",
  fetch: app.fetch,
  idleTimeout: 60,
});

const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, `Received ${signal}, initiating graceful shutdown...`);

  try {
    logger.info("Closing workers, waiting for active jobs to complete...");
    await Promise.all(allWorkers.map((worker) => worker.close()));

    logger.info("All workers closed successfully");
  } catch (error) {
    logger.error(error, "Error during graceful shutdown");
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

logger.info(`Started ${allWorkers.length} job workers`);
logger.info(
  {
    port: server.port,
    environment: env.ENVIRONMENT,
    hostname: "0.0.0.0",
  },
  `🚀 Server running on port ${server.port} in ${env.ENVIRONMENT} mode`,
);
