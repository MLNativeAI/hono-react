import { Queue } from "bullmq";
import { redisConnection } from "./redis";
import { QUEUE_NAMES } from "./types";

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 2,
    backoff: {
      type: "exponential" as const,
      delay: 2000,
    },
  },
});
