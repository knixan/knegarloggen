import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

type PrismaClientLike = Parameters<typeof prismaAdapter>[0];

export function createAuth(config: {
  appUrl: string;
  prisma: PrismaClientLike;
  sendVerificationEmail: (email: string, url: string) => Promise<void>;
  /**
   * Körs när ett konto har skapats – oavsett hur (klientens signUp, server,
   * admin). Används för att skapa provperioden.
   */
  onUserCreated?: (user: { id: string; email: string }) => Promise<void>;
}) {
  return betterAuth({
    baseURL: config.appUrl,
    trustedOrigins: [config.appUrl],

    database: prismaAdapter(config.prisma, {
      provider: "postgresql",
    }),

    rateLimit: {
      // Databasen – minnet fungerar inte på Vercel (en räknare per instans).
      storage: "database",
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

    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await config.onUserCreated?.({ id: user.id, email: user.email });
          },
        },
      },
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
          required: false,
          // Får aldrig sättas från klienten (sign-up/update-user) – annars
          // kan vem som helst göra sig till admin. Ändras bara via admin-actions.
          input: false,
        },
      },
    },
  });
}
