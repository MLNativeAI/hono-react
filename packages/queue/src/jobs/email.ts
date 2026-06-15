import { sendFeedbackEmail } from "@repo/email";
import { logger } from "@repo/shared";
import { type Job, Worker } from "bullmq";
import { redisConnection } from "../redis";
import { QUEUE_NAMES } from "../types";

export type EmailType = "feedback";
export type EmailData = {
  email: string;
  emailType: EmailType;
};

export const emailWorker = new Worker(
  QUEUE_NAMES.EMAIL,
  async (job: Job<EmailData>) => {
    logger.info(job.data, "Handling email job");
    const { email, emailType } = job.data;
    switch (emailType) {
      case "feedback":
        await sendFeedbackEmail(email);
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
    name: "extract-worker",
  },
);
