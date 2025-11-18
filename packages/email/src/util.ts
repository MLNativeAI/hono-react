
import { envVars, logger } from "@repo/shared";

export function getApiBaseUrl() {
  if (envVars.ENVIRONMENT === "dev") {
    return "http://localhost:3000";
  } else {
    return envVars.BASE_URL;
  }
}
