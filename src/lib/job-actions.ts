"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import type { JobInput } from "./job-schema";

const utapi = new UTApi();

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function getOrCreateCompany(userId: string) {
  const existing = await prisma.company.findFirst({
    where: { ownerId: userId },
  });
  if (existing) return existing;
  return prisma.company.create({
    data: { name: "Mitt företag", ownerId: userId },
  });
}

export async function getJobs() {
  const session = await getSession();
  if (!session?.user) return [];

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return [];

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: { artiklar: true, resor: true, arbetspass: true, images: true },
    orderBy: { skapad: "desc" },
  });

  return jobs.map((j) => ({
    id: j.id,
    namn: j.kundNamn,
    adress: j.adress,
    telefon: j.telefon,
    epost: j.epost,
    personnummer: j.personnummer,
    fastighetsbeteckning: j.fastighetsbeteckning,
    rotAvdrag: j.rotAvdrag,
    pagaende: j.pagaende,
    utfort: j.utfort,
    fakturerat: j.fakturerat,
    betalt: j.betalt,
    anteckningar: j.anteckningar,
    ovrigaArtiklar: j.ovrigaArtiklar,
    utfortArbete: j.utfortArbete,
    planeratArbete: j.planeratArbete,
    artiklar: j.artiklar.map((a) => ({
      namn: a.namn,
      artikelnr: a.artikelnr,
      aterforsaljare: a.aterforsaljare,
      pris: a.pris,
      antal: a.antal,
    })),
    resor: j.resor.map((r) => ({
      datum: r.datum,
      stracka: r.stracka,
    })),
    arbetstider: j.arbetspass.map((w) => ({
      datum: w.datum,
      timmar: w.timmar,
    })),
    bilder: j.images.map((img) => ({
      url: img.url,
      key: img.key,
    })),
    skapad: j.skapad.toISOString(),
  }));
}

export async function getJob(id: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return null;

  const j = await prisma.job.findFirst({
    where: { id, companyId: company.id },
    include: { artiklar: true, resor: true, arbetspass: true, images: true },
  });
  if (!j) return null;

  return {
    id: j.id,
    namn: j.kundNamn,
    adress: j.adress,
    telefon: j.telefon,
    epost: j.epost,
    personnummer: j.personnummer,
    fastighetsbeteckning: j.fastighetsbeteckning,
    rotAvdrag: j.rotAvdrag,
    pagaende: j.pagaende,
    utfort: j.utfort,
    fakturerat: j.fakturerat,
    betalt: j.betalt,
    anteckningar: j.anteckningar,
    ovrigaArtiklar: j.ovrigaArtiklar,
    utfortArbete: j.utfortArbete,
    planeratArbete: j.planeratArbete,
    artiklar: j.artiklar.map((a) => ({
      namn: a.namn,
      artikelnr: a.artikelnr,
      aterforsaljare: a.aterforsaljare,
      pris: a.pris,
      antal: a.antal,
    })),
    resor: j.resor.map((r) => ({
      datum: r.datum,
      stracka: r.stracka,
    })),
    arbetstider: j.arbetspass.map((w) => ({
      datum: w.datum,
      timmar: w.timmar,
    })),
    bilder: j.images.map((img) => ({
      url: img.url,
      key: img.key,
    })),
    skapad: j.skapad.toISOString(),
  };
}

export async function createJob(data: JobInput, bilder: { url: string; key: string }[] = []) {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  const company = await getOrCreateCompany(session.user.id);

  await prisma.job.create({
    data: {
      companyId: company.id,
      kundNamn: data.namn,
      adress: data.adress ?? "",
      telefon: data.telefon ?? "",
      epost: data.epost ?? "",
      personnummer: data.personnummer ?? "",
      fastighetsbeteckning: data.fastighetsbeteckning ?? "",
      rotAvdrag: data.rotAvdrag,
      pagaende: data.pagaende,
      utfort: data.utfort,
      fakturerat: data.fakturerat,
      betalt: data.betalt,
      anteckningar: data.anteckningar ?? "",
      ovrigaArtiklar: data.ovrigaArtiklar ?? "",
      utfortArbete: data.utfortArbete ?? "",
      planeratArbete: data.planeratArbete ?? "",
      artiklar: {
        create: data.artiklar.map((a) => ({
          namn: a.namn,
          artikelnr: a.artikelnr ?? "",
          aterforsaljare: a.aterforsaljare ?? "",
          pris: a.pris,
          antal: a.antal,
        })),
      },
      resor: {
        create: data.resor.map((r) => ({
          datum: r.datum,
          stracka: r.stracka,
        })),
      },
      arbetspass: {
        create: data.arbetstider.map((w) => ({
          datum: w.datum,
          timmar: w.timmar,
        })),
      },
      images: {
        create: bilder.map((b) => ({ url: b.url, key: b.key })),
      },
    },
  });

  revalidatePath("/mina-sidor");
  return { ok: true };
}

export async function updateJob(id: string, data: JobInput, bilder: { url: string; key: string }[] = []) {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return { ok: false, error: "Inget företag" };

  const job = await prisma.job.findFirst({
    where: { id, companyId: company.id },
    include: { images: true },
  });
  if (!job) return { ok: false, error: "Jobb hittades inte" };

  // Identifiera bilder som tagits bort i formuläret och radera dem från UploadThing
  const befintligaKeys = job.images.map((img) => img.key);
  const nyaKeys = new Set(bilder.map((b) => b.key));
  const keysAttRadera = befintligaKeys.filter((key) => !nyaKeys.has(key));

  if (keysAttRadera.length > 0) {
    try {
      await utapi.deleteFiles(keysAttRadera);
    } catch (error) {
      console.error("Misslyckades att radera filer från UploadThing:", error);
    }
  }

  await prisma.job.update({
    where: { id },
    data: {
      kundNamn: data.namn,
      adress: data.adress ?? "",
      telefon: data.telefon ?? "",
      epost: data.epost ?? "",
      personnummer: data.personnummer ?? "",
      fastighetsbeteckning: data.fastighetsbeteckning ?? "",
      rotAvdrag: data.rotAvdrag,
      pagaende: data.pagaende,
      utfort: data.utfort,
      fakturerat: data.fakturerat,
      betalt: data.betalt,
      anteckningar: data.anteckningar ?? "",
      ovrigaArtiklar: data.ovrigaArtiklar ?? "",
      utfortArbete: data.utfortArbete ?? "",
      planeratArbete: data.planeratArbete ?? "",
      artiklar: {
        deleteMany: {},
        create: data.artiklar.map((a) => ({
          namn: a.namn,
          artikelnr: a.artikelnr ?? "",
          aterforsaljare: a.aterforsaljare ?? "",
          pris: a.pris,
          antal: a.antal,
        })),
      },
      resor: {
        deleteMany: {},
        create: data.resor.map((r) => ({
          datum: r.datum,
          stracka: r.stracka,
        })),
      },
      arbetspass: {
        deleteMany: {},
        create: data.arbetstider.map((w) => ({
          datum: w.datum,
          timmar: w.timmar,
        })),
      },
      images: {
        deleteMany: {},
        create: bilder.map((b) => ({ url: b.url, key: b.key })),
      },
    },
  });

  revalidatePath("/mina-sidor");
  return { ok: true };
}

export async function deleteJob(id: string) {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return { ok: false, error: "Inget företag" };

  const job = await prisma.job.findFirst({
    where: { id, companyId: company.id },
    include: { images: true },
  });
  if (!job) return { ok: false, error: "Jobb hittades inte" };

  // Radera alla kopplade filer från UploadThing innan jobbet tas bort
  const keys = job.images.map((img) => img.key);
  if (keys.length > 0) {
    try {
      await utapi.deleteFiles(keys);
    } catch (error) {
      console.error("Misslyckades att radera filer från UploadThing vid borttagning av jobb:", error);
    }
  }

  await prisma.job.delete({ where: { id } });

  revalidatePath("/mina-sidor");
  return { ok: true };
}
