// Gemensam Prisma-config. Körs från appens mapp (pnpm db:migrate i
// apps/<app>), så dotenv läser den appens .env och DATABASE_URL.
import "dotenv/config";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const har = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  schema: har("./prisma/schema.prisma"),
  migrations: {
    path: har("./prisma/migrations"),
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
