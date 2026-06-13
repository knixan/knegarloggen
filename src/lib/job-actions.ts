"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import type { JobInput } from "./job-schema";

const utapi = new UTApi();
const DEFAULT_COMPANY_NAME = "Mitt företag";

type JobWithRelations = Prisma.JobGetPayload<{
  include: { artiklar: true; resor: true; arbetspass: true; images: true };
}>;

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function getOrCreateCompany(userId: string) {
  const existing = await prisma.company.findFirst({
    where: { ownerId: userId },
  });
  if (existing) return existing;
  return prisma.company.create({
    data: { name: DEFAULT_COMPANY_NAME, ownerId: userId },
  });
}

function mapJob(j: JobWithRelations) {
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
      id: a.id,
      namn: a.namn,
      artikelnr: a.artikelnr,
      aterforsaljare: a.aterforsaljare,
      pris: a.pris,
      antal: a.antal,
    })),
    resor: j.resor.map((r) => ({
      id: r.id,
      datum: r.datum,
      stracka: r.stracka,
    })),
    arbetstider: j.arbetspass.map((w) => ({
      id: w.id,
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

function ids<T extends { id?: string }>(rows: T[]) {
  return rows.flatMap((row) => (row.id ? [row.id] : []));
}

export async function getCompanySettings() {
  const session = await getSession();
  if (!session?.user) return null;

  const company = await getOrCreateCompany(session.user.id);

  return {
    id: company.id,
    name: company.name,
    orgNummer: company.orgNummer,
    adress: company.adress,
    postnummer: company.postnummer,
    ort: company.ort,
    telefon: company.telefon,
    epost: company.epost,
    fSkatt: company.fSkatt,
    momsNummer: company.momsNummer,
    bankgiro: company.bankgiro,
    plusgiro: company.plusgiro,
    swish: company.swish,
    logoUrl: company.logoUrl,
    logoKey: company.logoKey,
    nastaFakturanummer: company.nastaFakturanummer,
    forfallodagar: company.forfallodagar,
    drojsmalsranta: company.drojsmalsranta,
    fakturatext: company.fakturatext,
  };
}

export type CompanyInput = {
  name: string;
  orgNummer: string;
  adress: string;
  postnummer: string;
  ort: string;
  telefon: string;
  epost: string;
  fSkatt: boolean;
  momsNummer: string;
  bankgiro: string;
  plusgiro: string;
  swish: string;
  nastaFakturanummer: number;
  forfallodagar: number;
  drojsmalsranta: number;
  fakturatext: string;
};

export async function updateCompanySettings(data: CompanyInput) {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  const trimmedName = data.name.trim();
  if (!trimmedName) return { ok: false, error: "Företagsnamn krävs" };
  if (trimmedName.length > 120)
    return { ok: false, error: "Företagsnamnet är för långt" };

  const company = await getOrCreateCompany(session.user.id);

  await prisma.company.update({
    where: { id: company.id },
    data: {
      name: trimmedName,
      orgNummer: data.orgNummer.trim(),
      adress: data.adress.trim(),
      postnummer: data.postnummer.trim(),
      ort: data.ort.trim(),
      telefon: data.telefon.trim(),
      epost: data.epost.trim(),
      fSkatt: data.fSkatt,
      momsNummer: data.momsNummer.trim(),
      bankgiro: data.bankgiro.trim(),
      plusgiro: data.plusgiro.trim(),
      swish: data.swish.trim(),
      nastaFakturanummer: Math.max(1, Math.floor(data.nastaFakturanummer || 1)),
      forfallodagar: Math.max(0, Math.floor(data.forfallodagar || 0)),
      drojsmalsranta: Math.max(0, data.drojsmalsranta || 0),
      fakturatext: data.fakturatext,
    },
  });

  revalidatePath("/mina-sidor");
  revalidatePath("/mina-sidor/foretag");
  return { ok: true };
}

export async function updateCompanyLogo(logo: { url: string; key: string } | null) {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  const company = await getOrCreateCompany(session.user.id);

  // Rensa gammal logga från UploadThing om den byts ut eller tas bort
  if (company.logoKey && company.logoKey !== logo?.key) {
    try {
      await utapi.deleteFiles(company.logoKey);
    } catch {
      // ignorera fel vid radering av gammal fil
    }
  }

  await prisma.company.update({
    where: { id: company.id },
    data: {
      logoUrl: logo?.url ?? "",
      logoKey: logo?.key ?? "",
    },
  });

  revalidatePath("/mina-sidor");
  revalidatePath("/mina-sidor/foretag");
  return { ok: true };
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

  return jobs.map(mapJob);
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

  return mapJob(j);
}

export async function createJob(
  data: JobInput,
  bilder: { url: string; key: string }[] = [],
) {
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

export async function updateJob(
  id: string,
  data: JobInput,
  bilder: { url: string; key: string }[] = [],
) {
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
        deleteMany: ids(data.artiklar).length
          ? { id: { notIn: ids(data.artiklar) } }
          : {},
        updateMany: data.artiklar
          .filter((a) => a.id)
          .map((a) => ({
            where: { id: a.id },
            data: {
              namn: a.namn,
              artikelnr: a.artikelnr ?? "",
              aterforsaljare: a.aterforsaljare ?? "",
              pris: a.pris,
              antal: a.antal,
            },
          })),
        create: data.artiklar
          .filter((a) => !a.id)
          .map((a) => ({
            namn: a.namn,
            artikelnr: a.artikelnr ?? "",
            aterforsaljare: a.aterforsaljare ?? "",
            pris: a.pris,
            antal: a.antal,
          })),
      },
      resor: {
        deleteMany: ids(data.resor).length
          ? { id: { notIn: ids(data.resor) } }
          : {},
        updateMany: data.resor
          .filter((r) => r.id)
          .map((r) => ({
            where: { id: r.id },
            data: {
              datum: r.datum,
              stracka: r.stracka,
            },
          })),
        create: data.resor
          .filter((r) => !r.id)
          .map((r) => ({
            datum: r.datum,
            stracka: r.stracka,
          })),
      },
      arbetspass: {
        deleteMany: ids(data.arbetstider).length
          ? { id: { notIn: ids(data.arbetstider) } }
          : {},
        updateMany: data.arbetstider
          .filter((w) => w.id)
          .map((w) => ({
            where: { id: w.id },
            data: {
              datum: w.datum,
              timmar: w.timmar,
            },
          })),
        create: data.arbetstider
          .filter((w) => !w.id)
          .map((w) => ({
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
      console.error(
        "Misslyckades att radera filer från UploadThing vid borttagning av jobb:",
        error,
      );
    }
  }

  await prisma.job.delete({ where: { id } });

  revalidatePath("/mina-sidor");
  return { ok: true };
}
