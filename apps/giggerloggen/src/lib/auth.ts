import { createAuth } from "@knegarloggen/auth";
import { prisma } from "./prisma";
import { sendVerificationEmail } from "./email";
import { env } from "./env";

export const auth = createAuth({
  appUrl: env.NEXT_PUBLIC_APP_URL,
  prisma,
  sendVerificationEmail,
});
