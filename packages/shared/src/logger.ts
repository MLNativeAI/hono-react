import { env } from "@repo/env";
import pino from "pino";

const createLogger = () => {
  const transports = [];

  if (env.AXIOM_TOKEN && env.AXIOM_DATASET) {
    transports.push({
      target: "@axiomhq/pino",
      level: env.LOG_LEVEL,
      options: {
        dataset: env.AXIOM_DATASET,
        token: env.AXIOM_TOKEN,
      },
    });
  }

  if (env.ENVIRONMENT === "dev") {
    transports.push({
      target: "pino-pretty",
      level: env.LOG_LEVEL,
      options: {
        colorize: true,
        ignore: "pid,hostname,env",
        translateTime: "HH:MM:ss",
      },
    });
  }

  const injectContext = () => {
    return {};
  };

  const rootLogger = pino(
    {
      level: env.LOG_LEVEL,
      mixin: injectContext,
    },
    transports.length > 0
      ? pino.transport({
          targets: transports,
        })
      : undefined,
  );

  return rootLogger.child({
    env: env.ENVIRONMENT,
  });
};

export const logger = createLogger();
