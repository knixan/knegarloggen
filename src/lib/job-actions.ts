"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";
import { UTApi } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import type { JobInput, CustomerInput, CompanyInput } from "./job-schema";

const utapi = new UTApi();
const DEFAULT_COMPANY_NAME = "Mitt företag";

type JobWithRelations = Prisma.JobGetPayload<{
  include: {
    artiklar: true;
    resor: true;
    arbetspass: true;
    images: true;
    customer: true;
    ovrigaKostnader: true;
  };
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

type CompanyCtx = { company: Awaited<ReturnType<typeof getOrCreateCompany>> };
type AuthError = { ok: false; error: string };

async function requireCompany(): Promise<CompanyCtx | AuthError> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };
  const company = await getOrCreateCompany(session.user.id);
  return { company };
}

async function requireExistingCompany(): Promise<CompanyCtx | AuthError> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };
  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return { ok: false, error: "Inget företag hittat" };
  return { company };
}

async function requireSession(): Promise<{ userId: string } | AuthError> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };
  return { userId: session.user.id };
}

function mapCustomer(c: NonNullable<JobWithRelations["customer"]>) {
  return {
    id: c.id,
    companyId: c.companyId,
    typ: c.typ as "privat" | "foretag",
    namn: c.namn,
    adress: c.adress,
    postnummer: c.postnummer,
    ort: c.ort,
    telefon: c.telefon,
    epost: c.epost,
    personnummer: c.personnummer,
    foretagsnamn: c.foretagsnamn,
    kontaktperson: c.kontaktperson,
    orgNummer: c.orgNummer,
    fastighetsbeteckning: c.fastighetsbeteckning,
    lagenhetsnummer: c.lagenhetsnummer,
    bostadsrattsforening: c.bostadsrattsforening,
    skapad: c.createdAt.toISOString(),
  };
}

function mapJob(j: JobWithRelations) {
  return {
    id: j.id,
    customerId: j.customerId ?? undefined,
    customer: j.customer ? mapCustomer(j.customer) : null,
    rotAvdrag: j.rotAvdrag,
    fakturanummer: j.fakturanummer ?? undefined,
    timpris: j.timpris,
    milersattning: j.milersattning,
    fastPris: j.fastPris ?? undefined,
    pagaende: j.pagaende,
    utfort: j.utfort,
    fakturerat: j.fakturerat,
    betalt: j.betalt,
    anteckningar: j.anteckningar,
    utfortArbete: j.utfortArbete,
    planeratArbete: j.planeratArbete,
    artiklar: j.artiklar.map((a) => ({
      id: a.id,
      namn: a.namn,
      artikelnr: a.artikelnr,
      aterforsaljare: a.aterforsaljare,
      inkopspris: a.inkopspris,
      pris: a.pris,
      antal: a.antal,
    })),
    resor: j.resor.map((r) => ({
      id: r.id,
      datum: r.datum.toISOString().slice(0, 10),
      stracka: r.stracka,
    })),
    arbetstider: j.arbetspass.map((w) => ({
      id: w.id,
      datum: w.datum.toISOString().slice(0, 10),
      timmar: w.timmar,
    })),
    ovrigaKostnader: j.ovrigaKostnader.map((k) => ({
      id: k.id,
      beskrivning: k.beskrivning,
      pris: k.pris,
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

// ============================================================
// FÖRETAGSUPPGIFTER
// ============================================================

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

export async function updateCompanySettings(data: CompanyInput) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;

  const trimmedName = data.name.trim();
  if (!trimmedName) return { ok: false, error: "Företagsnamn krävs" };
  if (trimmedName.length > 120)
    return { ok: false, error: "Företagsnamnet är för långt" };

  const { company } = ctx;

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
  return { ok: true as const };
}

export async function updateCompanyLogo(
  logo: { url: string; key: string } | null,
) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  if (company.logoKey && company.logoKey !== logo?.key) {
    try {
      await utapi.deleteFiles(company.logoKey);
    } catch (err) {
      console.error("Kunde inte radera gammal logotyp:", err);
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
  return { ok: true as const };
}

// ============================================================
// KUNDREGISTER
// ============================================================

export async function getCustomers() {
  const session = await getSession();
  if (!session?.user) return [];

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return [];

  const customers = await prisma.customer.findMany({
    where: { companyId: company.id },
    orderBy: { namn: "asc" },
  });

  return customers.map((c) => ({
    id: c.id,
    companyId: c.companyId,
    typ: c.typ as "privat" | "foretag",
    namn: c.namn,
    adress: c.adress,
    postnummer: c.postnummer,
    ort: c.ort,
    telefon: c.telefon,
    epost: c.epost,
    personnummer: c.personnummer,
    foretagsnamn: c.foretagsnamn,
    kontaktperson: c.kontaktperson,
    orgNummer: c.orgNummer,
    fastighetsbeteckning: c.fastighetsbeteckning,
    lagenhetsnummer: c.lagenhetsnummer,
    bostadsrattsforening: c.bostadsrattsforening,
    skapad: c.createdAt.toISOString(),
  }));
}

export async function getCustomer(id: string) {
  const session = await getSession();
  if (!session?.user) return null;

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return null;

  const c = await prisma.customer.findFirst({
    where: { id, companyId: company.id },
  });
  if (!c) return null;

  return {
    id: c.id,
    companyId: c.companyId,
    typ: c.typ as "privat" | "foretag",
    namn: c.namn,
    adress: c.adress,
    postnummer: c.postnummer,
    ort: c.ort,
    telefon: c.telefon,
    epost: c.epost,
    personnummer: c.personnummer,
    foretagsnamn: c.foretagsnamn,
    kontaktperson: c.kontaktperson,
    orgNummer: c.orgNummer,
    fastighetsbeteckning: c.fastighetsbeteckning,
    lagenhetsnummer: c.lagenhetsnummer,
    bostadsrattsforening: c.bostadsrattsforening,
    skapad: c.createdAt.toISOString(),
  };
}

export async function createCustomer(data: CustomerInput) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const customer = await prisma.customer.create({
    data: {
      companyId: company.id,
      typ: data.typ,
      namn: data.namn.trim(),
      adress: data.adress ?? "",
      postnummer: data.postnummer ?? "",
      ort: data.ort ?? "",
      telefon: data.telefon ?? "",
      epost: data.epost ?? "",
      personnummer: data.personnummer ?? "",
      foretagsnamn: data.foretagsnamn ?? "",
      kontaktperson: data.kontaktperson ?? "",
      orgNummer: data.orgNummer ?? "",
      fastighetsbeteckning: data.fastighetsbeteckning ?? "",
      lagenhetsnummer: data.lagenhetsnummer ?? "",
      bostadsrattsforening: data.bostadsrattsforening ?? "",
    },
  });

  revalidatePath("/mina-sidor/kunder");
  return { ok: true as const, id: customer.id };
}

export async function updateCustomer(id: string, data: CustomerInput) {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const existing = await prisma.customer.findFirst({
    where: { id, companyId: company.id },
  });
  if (!existing) return { ok: false, error: "Kund hittades inte" };

  await prisma.customer.update({
    where: { id },
    data: {
      typ: data.typ,
      namn: data.namn.trim(),
      adress: data.adress ?? "",
      postnummer: data.postnummer ?? "",
      ort: data.ort ?? "",
      telefon: data.telefon ?? "",
      epost: data.epost ?? "",
      personnummer: data.personnummer ?? "",
      foretagsnamn: data.foretagsnamn ?? "",
      kontaktperson: data.kontaktperson ?? "",
      orgNummer: data.orgNummer ?? "",
      fastighetsbeteckning: data.fastighetsbeteckning ?? "",
      lagenhetsnummer: data.lagenhetsnummer ?? "",
      bostadsrattsforening: data.bostadsrattsforening ?? "",
    },
  });

  revalidatePath("/mina-sidor/kunder");
  revalidatePath(`/mina-sidor/kunder/${id}/redigera`);
  return { ok: true as const };
}

export async function deleteCustomer(id: string) {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const existing = await prisma.customer.findFirst({
    where: { id, companyId: company.id },
  });
  if (!existing) return { ok: false, error: "Kund hittades inte" };

  // Koppla loss jobben (sätt customerId = null) istället för att radera dem
  await prisma.job.updateMany({
    where: { customerId: id },
    data: { customerId: null },
  });

  await prisma.customer.delete({ where: { id } });

  revalidatePath("/mina-sidor/kunder");
  revalidatePath("/mina-sidor");
  return { ok: true as const };
}

// ============================================================
// JOBB
// ============================================================

export async function getJobs() {
  const session = await getSession();
  if (!session?.user) return [];

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return [];

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: {
      artiklar: true,
      resor: true,
      arbetspass: true,
      images: true,
      customer: true,
      ovrigaKostnader: true,
    },
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
    include: {
      artiklar: true,
      resor: true,
      arbetspass: true,
      images: true,
      customer: true,
      ovrigaKostnader: true,
    },
  });
  if (!j) return null;

  return mapJob(j);
}

export async function createJob(
  data: JobInput,
  bilder: { url: string; key: string }[] = [],
) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, companyId: company.id },
    });
    if (!customer) return { ok: false, error: "Kund hittades inte" };
  }

  await prisma.job.create({
    data: {
      companyId: company.id,
      customerId: data.customerId ?? null,
      rotAvdrag: data.rotAvdrag,
      timpris: data.timpris ?? 0,
      milersattning: data.milersattning ?? 0,
      fastPris: data.fastPris ?? null,
      pagaende: data.pagaende,
      utfort: data.utfort,
      fakturerat: data.fakturerat,
      betalt: data.betalt,
      anteckningar: data.anteckningar ?? "",
      utfortArbete: data.utfortArbete ?? "",
      planeratArbete: data.planeratArbete ?? "",
      artiklar: {
        create: data.artiklar.map((a) => ({
          namn: a.namn,
          artikelnr: a.artikelnr ?? "",
          aterforsaljare: a.aterforsaljare ?? "",
          inkopspris: a.inkopspris ?? 0,
          pris: a.pris,
          antal: a.antal,
        })),
      },
      resor: {
        create: data.resor.map((r) => ({
          datum: new Date(r.datum),
          stracka: r.stracka,
        })),
      },
      arbetspass: {
        create: data.arbetstider.map((w) => ({
          datum: new Date(w.datum),
          timmar: w.timmar,
        })),
      },
      images: {
        create: bilder.map((b) => ({ url: b.url, key: b.key })),
      },
      ovrigaKostnader: {
        create: (data.ovrigaKostnader ?? []).map((k) => ({
          beskrivning: k.beskrivning,
          pris: k.pris,
        })),
      },
    },
  });

  revalidatePath("/mina-sidor");
  return { ok: true as const };
}

export async function updateJob(
  id: string,
  data: JobInput,
  bilder: { url: string; key: string }[] = [],
) {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const existing = await prisma.job.findFirst({
    where: { id, companyId: company.id },
    include: {
      artiklar: true,
      resor: true,
      arbetspass: true,
      images: true,
      ovrigaKostnader: true,
    },
  });
  if (!existing) return { ok: false, error: "Jobb hittades inte" };

  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, companyId: company.id },
    });
    if (!customer) return { ok: false, error: "Kund hittades inte" };
  }

  // Bilder att radera från UploadThing
  const existingImageKeys = existing.images.map((i) => i.key);
  const newImageKeys = bilder.map((b) => b.key);
  const toDelete = existingImageKeys.filter((k) => !newImageKeys.includes(k));
  if (toDelete.length > 0) {
    try {
      await utapi.deleteFiles(toDelete);
    } catch (err) {
      console.error("Kunde inte radera bilder från UploadThing:", err);
    }
  }

  const existingArtiklarIds = ids(existing.artiklar);
  const keepArtiklarIds = ids(data.artiklar);
  const deleteArtiklarIds = existingArtiklarIds.filter(
    (i) => !keepArtiklarIds.includes(i),
  );

  const existingResorIds = ids(existing.resor);
  const keepResorIds = ids(data.resor);
  const deleteResorIds = existingResorIds.filter(
    (i) => !keepResorIds.includes(i),
  );

  const existingArbetspassIds = ids(existing.arbetspass);
  const keepArbetspassIds = ids(data.arbetstider);
  const deleteArbetspassIds = existingArbetspassIds.filter(
    (i) => !keepArbetspassIds.includes(i),
  );

  const existingKostnaderIds = ids(existing.ovrigaKostnader);
  const keepKostnaderIds = ids(data.ovrigaKostnader ?? []);
  const deleteKostnaderIds = existingKostnaderIds.filter(
    (i) => !keepKostnaderIds.includes(i),
  );

  await prisma.$transaction([
    // Artiklar
    prisma.article.deleteMany({ where: { id: { in: deleteArtiklarIds } } }),
    ...data.artiklar.map((a) =>
      a.id
        ? prisma.article.update({
            where: { id: a.id },
            data: {
              namn: a.namn,
              artikelnr: a.artikelnr ?? "",
              aterforsaljare: a.aterforsaljare ?? "",
              inkopspris: a.inkopspris ?? 0,
              pris: a.pris,
              antal: a.antal,
            },
          })
        : prisma.article.create({
            data: {
              jobId: id,
              namn: a.namn,
              artikelnr: a.artikelnr ?? "",
              aterforsaljare: a.aterforsaljare ?? "",
              inkopspris: a.inkopspris ?? 0,
              pris: a.pris,
              antal: a.antal,
            },
          }),
    ),
    // Resor
    prisma.trip.deleteMany({ where: { id: { in: deleteResorIds } } }),
    ...data.resor.map((r) =>
      r.id
        ? prisma.trip.update({
            where: { id: r.id },
            data: { datum: new Date(r.datum), stracka: r.stracka },
          })
        : prisma.trip.create({
            data: { jobId: id, datum: new Date(r.datum), stracka: r.stracka },
          }),
    ),
    // Arbetspass
    prisma.workSession.deleteMany({
      where: { id: { in: deleteArbetspassIds } },
    }),
    ...data.arbetstider.map((w) =>
      w.id
        ? prisma.workSession.update({
            where: { id: w.id },
            data: { datum: new Date(w.datum), timmar: w.timmar },
          })
        : prisma.workSession.create({
            data: { jobId: id, datum: new Date(w.datum), timmar: w.timmar },
          }),
    ),
    // Övriga kostnader
    prisma.ovrigKostnad.deleteMany({
      where: { id: { in: deleteKostnaderIds } },
    }),
    ...(data.ovrigaKostnader ?? []).map((k) =>
      k.id
        ? prisma.ovrigKostnad.update({
            where: { id: k.id },
            data: { beskrivning: k.beskrivning, pris: k.pris },
          })
        : prisma.ovrigKostnad.create({
            data: { jobId: id, beskrivning: k.beskrivning, pris: k.pris },
          }),
    ),
    // Bilder
    prisma.jobImage.deleteMany({ where: { jobId: id, key: { in: toDelete } } }),
    ...bilder
      .filter((b) => !existingImageKeys.includes(b.key))
      .map((b) =>
        prisma.jobImage.create({ data: { jobId: id, url: b.url, key: b.key } }),
      ),
    // Jobb-uppdatering
    prisma.job.update({
      where: { id },
      data: {
        customerId: data.customerId ?? null,
        rotAvdrag: data.rotAvdrag,
        timpris: data.timpris ?? 0,
        milersattning: data.milersattning ?? 0,
        fastPris: data.fastPris ?? null,
        pagaende: data.pagaende,
        utfort: data.utfort,
        fakturerat: data.fakturerat,
        betalt: data.betalt,
        anteckningar: data.anteckningar ?? "",
        utfortArbete: data.utfortArbete ?? "",
        planeratArbete: data.planeratArbete ?? "",
      },
    }),
  ]);

  revalidatePath("/mina-sidor");
  revalidatePath(`/mina-sidor/jobb/${id}/redigera`);
  return { ok: true as const };
}

export async function deleteJob(id: string) {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const job = await prisma.job.findFirst({
    where: { id, companyId: company.id },
    include: { images: true },
  });
  if (!job) return { ok: false, error: "Jobb hittades inte" };

  if (job.images.length > 0) {
    try {
      await utapi.deleteFiles(job.images.map((i) => i.key));
    } catch (err) {
      console.error("Kunde inte radera jobbbilder:", err);
    }
  }

  await prisma.job.delete({ where: { id } });

  revalidatePath("/mina-sidor");
  return { ok: true as const };
}

export async function deleteAccount(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const ctx = await requireSession();
  if ("error" in ctx) return ctx;
  const { userId } = ctx;

  const company = await prisma.company.findFirst({
    where: { ownerId: userId },
    select: {
      logoKey: true,
      jobs: { select: { images: { select: { key: true } } } },
    },
  });

  const keys: string[] = [];
  if (company?.logoKey) keys.push(company.logoKey);
  company?.jobs.forEach((job) =>
    job.images.forEach((img) => keys.push(img.key)),
  );

  if (keys.length > 0) {
    try {
      await utapi.deleteFiles(keys);
    } catch (err) {
      console.error("Kunde inte radera filer vid kontoborttagning:", err);
    }
  }

  await prisma.user.delete({ where: { id: userId } });

  return { ok: true as const };
}

export async function reserverFakturanummer(jobId: string): Promise<number> {
  const session = await getSession();
  if (!session?.user) throw new Error("Inte inloggad");

  return prisma.$transaction(async (tx) => {
    const company = await tx.company.findFirst({
      where: { ownerId: session.user.id },
    });
    if (!company) throw new Error("Inget företag hittat");

    const job = await tx.job.findFirst({
      where: { id: jobId, companyId: company.id },
      select: { fakturanummer: true },
    });
    if (!job) throw new Error("Jobb hittades inte");

    if (job.fakturanummer) return job.fakturanummer;

    const nummer = company.nastaFakturanummer;
    await tx.job.update({
      where: { id: jobId },
      data: { fakturanummer: nummer },
    });
    await tx.company.update({
      where: { id: company.id },
      data: { nastaFakturanummer: { increment: 1 } },
    });
    return nummer;
  });
}
