import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL saknas i miljövariablerna.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@knegarloggen.se" },
    update: { name: "Demo Användare" },
    create: {
      name: "Demo Användare",
      email: "demo@knegarloggen.se",
      emailVerified: true,
    },
  });

  const company = await prisma.company.upsert({
    where: { id: "demo-company-1" },
    update: {
      name: "Knegarloggen Bygg AB",
      ownerId: user.id,
    },
    create: {
      id: "demo-company-1",
      name: "Knegarloggen Bygg AB",
      ownerId: user.id,
    },
  });

  await prisma.job.deleteMany({ where: { companyId: company.id } });
  await prisma.customer.deleteMany({ where: { companyId: company.id } });

  const customer1 = await prisma.customer.create({
    data: {
      companyId: company.id,
      namn: "Anna Andersson",
      adress: "Storgatan 12",
      postnummer: "753 31",
      ort: "Uppsala",
      telefon: "0701234567",
      epost: "anna@example.com",
      typ: "privat",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      companyId: company.id,
      namn: "Bertil Berg",
      adress: "Kvarnvägen 4",
      postnummer: "722 11",
      ort: "Västerås",
      telefon: "0739876543",
      epost: "bertil@example.com",
      typ: "privat",
    },
  });

  const job1 = await prisma.job.create({
    data: {
      companyId: company.id,
      customerId: customer1.id,
      rotAvdrag: true,
      utfort: true,
      fakturerat: false,
      betalt: false,
      anteckningar: "Köksrenovering, etapp 1.",
      artiklar: {
        create: [
          {
            namn: "Regel 45x95",
            artikelnr: "R-4595",
            pris: 59,
            antal: 20,
          },
          {
            namn: "Gipsskiva",
            artikelnr: "G-13",
            pris: 99,
            antal: 15,
          },
        ],
      },
      resor: {
        create: [
          {
            datum: "2026-05-20",
            stracka: 24,
          },
        ],
      },
      arbetspass: {
        create: [
          {
            datum: "2026-05-20",
            timmar: 6.5,
          },
          {
            datum: "2026-05-21",
            timmar: 7,
          },
        ],
      },
    },
  });

  await prisma.job.create({
    data: {
      companyId: company.id,
      customerId: customer2.id,
      rotAvdrag: false,
      utfort: false,
      fakturerat: false,
      betalt: false,
      anteckningar: "Badrumsprojekt, inväntar material.",
      artiklar: {
        create: [
          {
            namn: "Kakel vit 20x20",
            artikelnr: "K-2020",
            pris: 149,
            antal: 12,
          },
        ],
      },
      resor: {
        create: [
          {
            datum: "2026-05-22",
            stracka: 30,
          },
        ],
      },
      arbetspass: {
        create: [
          {
            datum: "2026-05-22",
            timmar: 4,
          },
        ],
      },
    },
  });

  console.log("Seed klart ✅", {
    userId: user.id,
    companyId: company.id,
    firstJobId: job1.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
