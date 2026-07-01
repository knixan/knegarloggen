// @ts-expect-error – available after `npx prisma generate`
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PC = any;

const globalForPrisma = globalThis as unknown as { prisma: PC };

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma: PC =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
