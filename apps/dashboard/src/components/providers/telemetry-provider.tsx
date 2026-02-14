import { PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";

export default function TelemetryProvider({ children }: { children: React.ReactNode }) {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    defaults: "2025-11-30",
    persistence: "localStorage",
  });

  if (posthog.__loaded) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  } else {
    return <>{children}</>;
  }
}
