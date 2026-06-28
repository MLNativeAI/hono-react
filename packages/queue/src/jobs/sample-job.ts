import { type RunProcessInput, type RunProcessResult, runLongProcess } from "@repo/engine";
import { Queue, Worker } from "bullmq";
import { redisConnection } from "../redis";
import { QUEUE_NAMES } from "../types";

export const defaultQueue = new Queue(QUEUE_NAMES.DEFAULT, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 500,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export const sampleWorker = new Worker<RunProcessInput, RunProcessResult>(
  QUEUE_NAMES.DEFAULT,
  (job) => runLongProcess(job.data),
  {
    connection: redisConnection,
    concurrency: 5,
    name: "sample-worker",
  },
);
