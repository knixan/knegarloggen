import { createAuth } from "@knegarloggen/auth";
import { prisma } from "./prisma";
import { sendVerificationEmail } from "./email";
import { env } from "./env";
import { skapaProvperiod } from "./subscription";

export const auth = createAuth({
  appUrl: env.NEXT_PUBLIC_APP_URL,
  prisma,
  sendVerificationEmail,
  // Varje nytt konto får provperioden direkt – annars räknas det som utgånget.
  onUserCreated: ({ id }) => skapaProvperiod(id),
});
