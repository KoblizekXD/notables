import pino from "pino";
import { createWriteStream } from "pino-logflare"

const stream = createWriteStream({
  apiKey: process.env.LOGFLARE_API_KEY as string,
  sourceToken: process.env.LOGFLARE_SOURCE_TOKEN as string,
})

const logger = pino({
  browser: {
    asObject: true,
  },
}, process.env.NODE_ENV === "production" ? stream : undefined);

export default logger;
