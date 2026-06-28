import { expect, test } from "bun:test";
import { runLongProcess } from "./long-running-process";

test("runLongProcess resolves successfully for a sample input", async () => {
  const result = await runLongProcess({ sampleId: "sample_001" });
  expect(result).toEqual({ success: true });
});
