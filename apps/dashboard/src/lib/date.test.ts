import { describe, expect, test } from "bun:test";
import { formatDuration, formatRelativeTime, getInvitationSendDate } from "./date";

describe("date formatting", () => {
  test("formats running and completed durations", () => {
    expect(formatDuration("2025-01-01T00:00:00Z")).toBe("Running...");
    expect(formatDuration("2025-01-01T00:00:00Z", "2025-01-01T01:02:03Z")).toBe("1h 2m 3s");
    expect(formatDuration("2025-01-01T00:00:00Z", "2025-01-01T00:00:00.500Z")).toBe("< 1s");
  });

  test("describes past and future times", () => {
    const now = Date.now();
    expect(formatRelativeTime(new Date(now - 120_000))).toBe("2 minutes ago");
    expect(formatRelativeTime(new Date(now + 120_000))).toBe("2 minutes from now");
  });

  test("derives the invitation send date", () => {
    expect(getInvitationSendDate(new Date("2025-01-03T00:00:00Z"))).toEqual(new Date("2025-01-01T00:00:00Z"));
  });
});
