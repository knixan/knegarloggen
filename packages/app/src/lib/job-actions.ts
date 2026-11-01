"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import {
  companySchema,
  customerSchema,
  jobSchema,
  type JobInput,
  type CustomerInput,
  type CompanyInput,
  tillDbDatum,
} from "./job-schema";
import { brand } from "../brand";
import { getJobs } from "./jobb-data";
import {
  allBelongToJob,
  firstIssue,
  ids,
  isUploadThingUrl,
  type UploadedFile,
} from "./validering";

import { stripe } from "./stripe";
import { hasActiveSubscription } from "./subscription";

const utapi = new UTApi();
const DEFAULT_COMPANY_NAME = "Mitt företag";
const SUBSCRIPTION_EXPIRED =
  "Provperioden har gått ut – lägg till betalning för att fortsätta";

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

// Alla skrivande actions kräver inloggning OCH aktiv prenumeration/provperiod.
// TrialGate döljer bara gränssnittet – den här kontrollen är den som skyddar.
async function requireActiveUser(): Promise<{ userId: string } | AuthError> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };
  if (!(await hasActiveSubscription(session.user.id))) {
    return { ok: false, error: SUBSCRIPTION_EXPIRED };
  }
  return { userId: session.user.id };
}

async function requireCompany(): Promise<CompanyCtx | AuthError> {
  const ctx = await requireActiveUser();
  if ("error" in ctx) return ctx;
  const company = await getOrCreateCompany(ctx.userId);
  return { company };
}

async function requireExistingCompany(): Promise<CompanyCtx | AuthError> {
  const ctx = await requireActiveUser();
  if ("error" in ctx) return ctx;
  const company = await prisma.company.findFirst({
    where: { ownerId: ctx.userId },
  });
  if (!company) return { ok: false, error: "Inget företag hittat" };
  return { company };
}

async function requireSession(): Promise<{ userId: string } | AuthError> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Inte inloggad" };
  return { userId: session.user.id };
}

/**
 * Validerar nyuppladdade filer innan de kopplas till ett jobb/företag:
 * 1. riktig UploadThing-URL,
 * 2. uppladdad av den här användaren i den här appen (tabellen Uppladdning,
 *    fylls i av uploadthing.ts) – apparna delar UploadThing-app, så annars
 *    kunde man "låna" någon annans fil och sedan radera den,
 * 3. inte redan kopplad till ett jobb eller en logga.
 */
async function validateNewUploads(
  files: UploadedFile[],
  userId: string,
): Promise<string | null> {
  if (files.length === 0) return null;
  if (!files.every(isUploadThingUrl)) return "Ogiltig bild";

  const keys = files.map((f) => f.key);
  if (new Set(keys).size !== keys.length) return "Ogiltig bild";

  const egna = await prisma.uppladdning.count({
    where: { key: { in: keys }, userId },
  });
  if (egna !== keys.length) return "Ogiltig bild";

  const [imageInUse, logoInUse] = await Promise.all([
    prisma.jobImage.findFirst({
      where: { key: { in: keys } },
      select: { id: true },
    }),
    prisma.company.findFirst({
      where: { logoKey: { in: keys } },
      select: { id: true },
    }),
  ]);
  if (imageInUse || logoInUse) return "Ogiltig bild";
  return null;
}

// ============================================================
// FÖRETAGSUPPGIFTER
// ============================================================

export async function updateCompanySettings(data: CompanyInput) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;

  const parsed = companySchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter",
    };
  }
  const d = parsed.data;

  const { company } = ctx;

  await prisma.company.update({
    where: { id: company.id },
    data: {
      name: d.name,
      orgNummer: d.orgNummer,
      adress: d.adress,
      postnummer: d.postnummer,
      ort: d.ort,
      telefon: d.telefon,
      epost: d.epost,
      fSkatt: d.fSkatt,
      momsNummer: d.momsNummer,
      bankgiro: d.bankgiro,
      plusgiro: d.plusgiro,
      swish: d.swish,
      nastaFakturanummer: d.nastaFakturanummer,
      forfallodagar: d.forfallodagar,
      drojsmalsranta: d.drojsmalsranta,
      fakturatext: d.fakturatext,
    },
  });

  revalidatePath("/mina-sidor", "layout");
  revalidatePath("/mina-sidor/foretag");
  return { ok: true as const };
}

export async function updateCompanyLogo(
  logo: { url: string; key: string } | null,
) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  if (logo && logo.key !== company.logoKey) {
    const uploadError = await validateNewUploads([logo], company.ownerId);
    if (uploadError) return { ok: false, error: uploadError };
  }

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

  revalidatePath("/mina-sidor", "layout");
  revalidatePath("/mina-sidor/foretag");
  return { ok: true as const };
}

// ============================================================
// KUNDREGISTER
// ============================================================

export async function createCustomer(input: CustomerInput) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  const data = parsed.data;

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

export async function updateCustomer(id: string, input: CustomerInput) {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  const data = parsed.data;

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
  revalidatePath("/mina-sidor", "layout");
  return { ok: true as const };
}

// ============================================================
// JOBB
// ============================================================

export async function createJob(input: JobInput, bilder: UploadedFile[] = []) {
  const ctx = await requireCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const parsed = jobSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  const data = parsed.data;

  const uploadError = await validateNewUploads(bilder, company.ownerId);
  if (uploadError) return { ok: false, error: uploadError };

  if (data.customerId) {
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, companyId: company.id },
    });
    if (!customer) return { ok: false, error: "Kund hittades inte" };
  }

  const nyttJobb = await prisma.job.create({
    data: {
      companyId: company.id,
      customerId: data.customerId ?? null,
      skatteavdrag: Boolean(brand.skatteavdrag) && data.skatteavdrag,
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
          datum: tillDbDatum(r.datum),
          stracka: r.stracka,
        })),
      },
      arbetspass: {
        create: data.arbetstider.map((w) => ({
          datum: tillDbDatum(w.datum),
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

  // Markerat som fakturerat direkt → jobbet får sitt fakturanummer nu.
  if (data.fakturerat) {
    await prisma.$transaction((tx) =>
      tilldelaFakturanummer(tx, company.id, nyttJobb.id),
    );
  }

  revalidatePath("/mina-sidor", "layout");
  return { ok: true as const };
}

export async function updateJob(
  id: string,
  input: JobInput,
  bilder: UploadedFile[] = [],
) {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  const parsed = jobSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };
  const data = parsed.data;

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

  if (
    !allBelongToJob(data.artiklar, existing.artiklar) ||
    !allBelongToJob(data.resor, existing.resor) ||
    !allBelongToJob(data.arbetstider, existing.arbetspass) ||
    !allBelongToJob(data.ovrigaKostnader ?? [], existing.ovrigaKostnader)
  ) {
    return { ok: false, error: "Ogiltiga rader i jobbet" };
  }

  const existingImageKeys = existing.images.map((i) => i.key);
  const uploadError = await validateNewUploads(
    bilder.filter((b) => !existingImageKeys.includes(b.key)),
    company.ownerId,
  );
  if (uploadError) return { ok: false, error: uploadError };

  const newImageKeys = bilder.map((b) => b.key);
  const toDelete = existingImageKeys.filter((k) => !newImageKeys.includes(k));

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
            where: { id: a.id, jobId: id },
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
            where: { id: r.id, jobId: id },
            data: { datum: tillDbDatum(r.datum), stracka: r.stracka },
          })
        : prisma.trip.create({
            data: {
              jobId: id,
              datum: tillDbDatum(r.datum),
              stracka: r.stracka,
            },
          }),
    ),
    // Arbetspass
    prisma.workSession.deleteMany({
      where: { id: { in: deleteArbetspassIds } },
    }),
    ...data.arbetstider.map((w) =>
      w.id
        ? prisma.workSession.update({
            where: { id: w.id, jobId: id },
            data: { datum: tillDbDatum(w.datum), timmar: w.timmar },
          })
        : prisma.workSession.create({
            data: { jobId: id, datum: tillDbDatum(w.datum), timmar: w.timmar },
          }),
    ),
    // Övriga kostnader
    prisma.ovrigKostnad.deleteMany({
      where: { id: { in: deleteKostnaderIds } },
    }),
    ...(data.ovrigaKostnader ?? []).map((k) =>
      k.id
        ? prisma.ovrigKostnad.update({
            where: { id: k.id, jobId: id },
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
        skatteavdrag: Boolean(brand.skatteavdrag) && data.skatteavdrag,
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

  if (data.fakturerat && !existing.fakturanummer) {
    await prisma.$transaction((tx) =>
      tilldelaFakturanummer(tx, company.id, id),
    );
  }

  if (toDelete.length > 0) {
    try {
      await utapi.deleteFiles(toDelete);
    } catch (err) {
      console.error("Kunde inte radera bilder från UploadThing:", err);
    }
  }

  revalidatePath("/mina-sidor", "layout");
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

  await prisma.job.delete({ where: { id } });

  if (job.images.length > 0) {
    try {
      await utapi.deleteFiles(job.images.map((i) => i.key));
    } catch (err) {
      console.error("Kunde inte radera jobbbilder:", err);
    }
  }

  revalidatePath("/mina-sidor", "layout");
  return { ok: true as const };
}

export async function deleteAccount(): Promise<{
  ok: boolean;
  error?: string;
}> {
  // Bara inloggning krävs – man ska kunna radera sitt konto även när
  // provperioden har gått ut (GDPR).
  const ctx = await requireSession();
  if ("error" in ctx) return ctx;
  const { userId } = ctx;

  const [company, subscription] = await Promise.all([
    prisma.company.findFirst({
      where: { ownerId: userId },
      select: {
        logoKey: true,
        jobs: { select: { images: { select: { key: true } } } },
      },
    }),
    prisma.subscription.findUnique({
      where: { userId },
      select: { stripeSubscriptionId: true },
    }),
  ]);

  // Alla filer användaren laddat upp i appen – även sådana som aldrig
  // kopplades till ett jobb. (Logga och jobbilder finns också i Uppladdning,
  // men tas med för säkerhets skull.)
  const uppladdningar = await prisma.uppladdning.findMany({
    where: { userId },
    select: { key: true },
  });
  const keys = new Set<string>(uppladdningar.map((u) => u.key));
  if (company?.logoKey) keys.add(company.logoKey);
  company?.jobs.forEach((job) =>
    job.images.forEach((img) => keys.add(img.key)),
  );

  // Avbryt prenumerationen först. Misslyckas det får kontot inte raderas –
  // då skulle Stripe fortsätta dra pengar utan att kunden kan logga in.
  if (subscription?.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch (err) {
      console.error("Kunde inte avbryta Stripe-prenumeration:", err);
      return {
        ok: false,
        error:
          "Kunde inte avsluta prenumerationen. Försök igen eller kontakta support.",
      };
    }
  }

  await prisma.user.delete({ where: { id: userId } });

  if (keys.size > 0) {
    try {
      await utapi.deleteFiles([...keys]);
    } catch (err) {
      console.error("Kunde inte radera filer vid kontoborttagning:", err);
    }
  }

  return { ok: true as const };
}

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * Ger jobbet nästa fakturanummer om det inte redan har ett. Atomärt: raden
 * låses och gamla värdet returneras i en enda SQL-sats, så två samtidiga
 * anrop aldrig får samma nummer.
 */
async function tilldelaFakturanummer(tx: Tx, companyId: string, jobId: string) {
  const job = await tx.job.findFirst({
    where: { id: jobId, companyId },
    select: { fakturanummer: true },
  });
  if (!job) throw new Error("Jobb hittades inte");
  if (job.fakturanummer) return job.fakturanummer;

  const result = await tx.$queryRaw<[{ nummer: number }]>`
    UPDATE company
    SET "nastaFakturanummer" = "nastaFakturanummer" + 1
    WHERE id = ${companyId}
    RETURNING "nastaFakturanummer" - 1 AS nummer
  `;
  const n = result[0]?.nummer;
  if (n == null) throw new Error("Kunde inte reservera fakturanummer");

  await tx.job.update({ where: { id: jobId }, data: { fakturanummer: n } });
  return n;
}

/**
 * Skapar fakturan: jobbet får ett fakturanummer och markeras som fakturerat.
 * Förhandsvisningen (skriv-ut) delar inte ut något nummer själv (#49).
 */
export async function faktureraJobb(
  jobId: string,
): Promise<{ ok: true; nummer: number } | { ok: false; error: string }> {
  const ctx = await requireExistingCompany();
  if ("error" in ctx) return ctx;
  const { company } = ctx;

  try {
    const nummer = await prisma.$transaction(async (tx) => {
      const n = await tilldelaFakturanummer(tx, company.id, jobId);
      await tx.job.update({
        where: { id: jobId },
        data: { fakturerat: true, pagaende: false, utfort: true },
      });
      return n;
    });
    revalidatePath("/mina-sidor", "layout");
    return { ok: true, nummer };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Okänt fel",
    };
  }
}

/** "Visa fler jobb" i jobblistan (klienten). Läsningen ligger i jobb-data.ts. */
export async function hamtaFlerJobb(cursor: string) {
  return getJobs(cursor);
}
