import { logger } from "@repo/shared";
import { sampleWorker } from "./jobs/sample-job";

export { defaultQueue } from "./jobs/sample-job";
export { redisConnection } from "./redis";
export { QUEUE_NAMES, type QueueName } from "./types";

export const allWorkers = [sampleWorker] as const;

for (const worker of allWorkers) {
  worker.on("completed", (job, result) => {
    logger.trace({ jobId: job?.id, jobName: job?.name, result }, "Worker job completed");
  });
  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, jobName: job?.name, error: err.message }, "Worker job failed");
  });
  worker.on("stalled", (jobId) => {
    logger.warn({ jobId }, "Worker job stalled");
  });
  worker.on("error", (err) => {
    logger.error(err, "Worker error");
  });
}
