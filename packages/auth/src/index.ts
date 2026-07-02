import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

type PrismaClientLike = Parameters<typeof prismaAdapter>[0];

export function createAuth(config: {
  appUrl: string;
  prisma: PrismaClientLike;
  sendVerificationEmail: (email: string, url: string) => Promise<void>;
}) {
  return betterAuth({
    baseURL: config.appUrl,
    trustedOrigins: [config.appUrl],

    database: prismaAdapter(config.prisma, {
      provider: "postgresql",
    }),

    rateLimit: {
      window: 60,
      max: 10,
      customRules: {
        "/sign-in/email": { window: 10, max: 3 },
        "/sign-up/email": { window: 10, max: 3 },
      },
    },

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 10,
      requireEmailVerification: true,
    },

    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await config.sendVerificationEmail(user.email, url);
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          required: false,
        },
      },
    },
  });
}
