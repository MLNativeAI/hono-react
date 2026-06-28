import { env } from "@repo/env";

export const emailConfig = {
  serviceName: "Hono-react",
  tagLine: "A production-ready react SPA setup with a Hono backend.",
  logo: "https://mlnative.com/mlnative_logo.png",
  icon: "https://mlnative.com/favicon.png",
  landingUrl: "mlnative.com",
  appUrl: env.DASHBOARD_BASE_URL,
  emailPerson: "Łukasz",
  fromEmail: env.FROM_EMAIL,
  companyAddress: ["123 Frontier Street", "Cheyenne, WY 82001", "United States"],
};
