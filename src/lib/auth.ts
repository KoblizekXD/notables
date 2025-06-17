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
      verification,
    },
  }),
  user: {
    additionalFields: {
      description: {
        type: "string",
        name: "description",
        required: false,
        defaultValue: null,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  onAPIError: {
    throw: true,
    errorURL: "/error",
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session: { userId: string }) => {
          logger.info(`User ${session.userId} signed in`);
        },
      },
      delete: {
        after: async (session: { userId: string }) => {
          logger.info(`User ${session.userId} signed out`);
        },
      },
    },
    user: {
      create: {
        after: async (user: { id: string }) => {
          logger.info(`User ${user.id} signed up`);
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    captcha({
      provider: "cloudflare-turnstile",
      secretKey: process.env.CAPTCHA_SECRET_KEY as string,
    }),
    // user: {
    //   description: {
    //     type: "text",
    //     name: "description",
    //     required: false,
    //   },
    // }
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
