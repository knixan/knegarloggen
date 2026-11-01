// Läsningar för sidorna under /mina-sidor. Vanlig servermodul – INTE
// "use server" – så att funktionerna inte blir anropbara utifrån som server
// actions. Används från serverkomponenter. (Klientens "visa fler jobb" går via
// hamtaFlerJobb i job-actions.ts.)
import { headers } from "next/headers";
import type { Prisma } from "../generated/prisma";
import { auth } from "./auth";
import { prisma } from "./prisma";

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

/** Standardvärden när användaren inte har sparat några företagsuppgifter än. */
function tomtForetag() {
  return {
    id: "",
    name: "",
    orgNummer: "",
    adress: "",
    postnummer: "",
    ort: "",
    telefon: "",
    epost: "",
    fSkatt: false,
    momsNummer: "",
    bankgiro: "",
    plusgiro: "",
    swish: "",
    logoUrl: "",
    logoKey: "",
    nastaFakturanummer: 1,
    forfallodagar: 30,
    drojsmalsranta: 0,
    fakturatext: "",
  };
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

export function mapJob(j: JobWithRelations) {
  return {
    id: j.id,
    customerId: j.customerId ?? undefined,
    customer: j.customer ? mapCustomer(j.customer) : null,
    skatteavdrag: j.skatteavdrag,
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

export async function getCompanySettings() {
  const session = await getSession();
  if (!session?.user) return null;

  // Läsning ska inte skapa något – finns inget företag än visas tomma
  // standardvärden. Företaget skapas när uppgifterna sparas första gången.
  const company =
    (await prisma.company.findFirst({ where: { ownerId: session.user.id } })) ??
    tomtForetag();

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

  return customers.map(mapCustomer);
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

  return mapCustomer(c);
}

const JOBS_PER_PAGE = 50;

export async function getJobs(cursor?: string) {
  const session = await getSession();
  if (!session?.user) return { jobs: [], nextCursor: null };

  const company = await prisma.company.findFirst({
    where: { ownerId: session.user.id },
  });
  if (!company) return { jobs: [], nextCursor: null };

  const items = await prisma.job.findMany({
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
    take: JOBS_PER_PAGE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = items.length > JOBS_PER_PAGE;
  if (hasMore) items.pop();

  return {
    jobs: items.map(mapJob),
    nextCursor: hasMore ? (items[items.length - 1]?.id ?? null) : null,
  };
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
