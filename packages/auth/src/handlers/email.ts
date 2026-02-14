import { emailQueue } from "@repo/queue";
import { logger } from "@repo/shared";
import { addDays } from "date-fns";

export async function scheduleFeedbackEmail(email: string) {
  const targetTime = addDays(new Date(), 7);
  logger.info(`Scheduling feedback email for ${targetTime.toLocaleString()}`);
  const delay = Number(targetTime) - Number(Date.now());

  await emailQueue.add("feedback-email", { email: email, emailType: "feedback" }, { delay });
}
