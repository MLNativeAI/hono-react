import { envVars } from "@repo/shared/env";

export const emailConfig = {
  serviceName: "Hono-react",
  tagLine: "A production-ready react SPA setup with a Hono backend.",
  logo: "https://mlnative.com/mlnative_logo.png",
  icon: "https://mlnative.com/favicon.png",
  landingUrl: "mlnative.com", // landing page, NOT app homepage
  appUrl: envVars.DASHBOARD_BASE_URL,
  emailPerson: "Łukasz",
  fromEmail: "Łukasz from mlnative <no-reply@mlnative.com>",
  companyAddress: ["123 Frontier Street", "Cheyenne, WY 82001", "United States"],
};
