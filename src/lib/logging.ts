import pino from "pino";

const isDev = process.env.NODE_ENV === "development";

const logger = pino({
  level: "info",
  browser: {
    asObject: true,
  },
});

export default logger;
