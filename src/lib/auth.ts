import db from "@/db/db";
import { account, session, user, verification } from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { captcha } from "better-auth/plugins";
import logger from "./logging";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification
    }
  }),
  databaseHooks: {
    session: {
      create: {
        after: async (session, context) => {
          logger.info(`User ${session.userId} signed in`);
        },
      }
    },
    user: {
      create: {
        after: async (user, context) => {
          logger.info(`User ${user.id} signed up`);
        },
      }
    }
  },
  plugins: [
    nextCookies(),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.CAPTCHA_SECRET_KEY as string,
    }),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 40,
  },
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
