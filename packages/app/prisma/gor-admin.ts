// Gör ett befintligt konto till admin: pnpm db:admin namn@example.com
// Körs från appens mapp, så rätt .env (DATABASE_URL) används.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Ange e-post: pnpm db:admin namn@example.com");

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" },
      select: { email: true, role: true },
    });
    console.log(`${user.email} är nu ${user.role}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
