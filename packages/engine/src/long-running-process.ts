import { logger } from "@repo/shared";
import type { RunProcessInput, RunProcessResult } from "./types";

export async function runLongProcess({ sampleId }: RunProcessInput): Promise<RunProcessResult> {
  logger.debug({ sampleId }, "Processing job");

  // an actual business process implementation goes here

  return {
    success: true,
  };
}
