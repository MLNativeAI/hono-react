import { logger } from "@repo/shared";
import { emailWorker } from "./jobs/email";

export { emailQueue } from "./jobs/email";

export const allWorkers = [emailWorker];

allWorkers.forEach((worker) => {
	worker.on("completed", (job: any, result: any) => {
		logger.trace(
			{
				jobId: job.id,
				jobName: job.name,
				specId: job.data.specId,
				result,
			},
			"Worker job completed",
		);
	});
	worker.on("failed", (job: any, err: Error) => {
		logger.error(
			{ error: err.message, jobName: job.jobName },
			"Worker job failed",
		);
	});
	worker.on("stalled", (jobId: any) => {
		logger.warn({ jobId }, "Worker job stalled");
	});
	worker.on("error", (err: Error) => {
		logger.error(err, "Worker error");
	});
});
