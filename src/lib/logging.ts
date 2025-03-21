import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

const logger = pino({
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true },
      }
    : undefined,
  level: "info",
});

export default logger;
