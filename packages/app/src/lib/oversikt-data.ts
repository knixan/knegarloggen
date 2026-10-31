// Data till översikten på /mina-sidor. Används bara från serverkomponenter
// (ingen "use server" – ska inte kunna anropas från klienten).
import { prisma } from "@/lib/prisma";
import { beräknaSummering } from "@/lib/job-schema";

const PAGAENDE_ANTAL = 5;

const summeringsfalt = {
  timpris: true,
  milersattning: true,
  fastPris: true,
  artiklar: { select: { pris: true, antal: true } },
  ovrigaKostnader: { select: { pris: true } },
  arbetspass: { select: { timmar: true } },
  resor: { select: { stracka: true } },
} as const;

type JobbMedSummering = {
  timpris: number;
  milersattning: number;
  fastPris: number | null;
  artiklar: { pris: number; antal: number }[];
  ovrigaKostnader: { pris: number }[];
  arbetspass: { timmar: number }[];
  resor: { stracka: number }[];
};

function summera(job: JobbMedSummering) {
  return beräknaSummering({
    timpris: job.timpris,
    milersattning: job.milersattning,
    fastPris: job.fastPris ?? undefined,
    artiklar: job.artiklar.map((a) => ({
      namn: "",
      artikelnr: "",
      aterforsaljare: "",
      inkopspris: 0,
      ...a,
    })),
    ovrigaKostnader: job.ovrigaKostnader.map((k) => ({
      beskrivning: "",
      ...k,
    })),
    arbetstider: job.arbetspass.map((w) => ({ datum: "", ...w })),
    resor: job.resor.map((r) => ({ datum: "", ...r })),
  });
}

/** Dagens datum i Sverige som UTC-midnatt – samma format som @db.Date-fälten. */
function svenskaDatum() {
  const idag = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });
  const [y, m, d] = idag.split("-").map(Number);
  const dag = new Date(Date.UTC(y, m - 1, d));
  const veckodag = (dag.getUTCDay() + 6) % 7; // måndag = 0
  return {
    veckaStart: new Date(Date.UTC(y, m - 1, d - veckodag)),
    manadStart: new Date(Date.UTC(y, m - 1, 1)),
  };
}

export function halsning() {
  const timme = Number(
    new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
      hour: "2-digit",
      hour12: false,
    }),
  );
  if (timme < 5) return "God natt";
  if (timme < 10) return "God morgon";
  if (timme < 18) return "God dag";
  return "God kväll";
}

export type CustomerNamn = {
  namn: string;
  foretagsnamn: string;
} | null;

export function kundnamn(customer: CustomerNamn) {
  return customer?.foretagsnamn.trim() || customer?.namn.trim() || "Utan kund";
}

export async function getOversikt(ownerId: string) {
  const company = await prisma.company.findFirst({ where: { ownerId } });
  if (!company) return null;

  const companyId = company.id;
  const { veckaStart, manadStart } = svenskaDatum();
  const kund = { select: { namn: true, foretagsnamn: true } } as const;

  const [
    antalPagaende,
    timmarVecka,
    timmarManad,
    attFakturera,
    obetalda,
    pagaende,
    rotJobb,
  ] = await Promise.all([
    prisma.job.count({
      where: { companyId, pagaende: true, utfort: false },
    }),
    prisma.workSession.aggregate({
      _sum: { timmar: true },
      where: { job: { companyId }, datum: { gte: veckaStart } },
    }),
    prisma.workSession.aggregate({
      _sum: { timmar: true },
      where: { job: { companyId }, datum: { gte: manadStart } },
    }),
    prisma.job.findMany({
      where: { companyId, utfort: true, fakturerat: false },
      select: { id: true, updatedAt: true, customer: kund, ...summeringsfalt },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.job.findMany({
      where: { companyId, fakturerat: true, betalt: false },
      select: {
        id: true,
        fakturanummer: true,
        customer: kund,
        ...summeringsfalt,
      },
      orderBy: { updatedAt: "asc" },
    }),
    prisma.job.findMany({
      where: { companyId, utfort: false },
      select: {
        id: true,
        pagaende: true,
        planeratArbete: true,
        updatedAt: true,
        customer: { select: { ...kund.select, adress: true, ort: true } },
        arbetspass: { select: { timmar: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: PAGAENDE_ANTAL,
    }),
    // ROT-uppgifter behövs först vid fakturering – betalda jobb är klara.
    prisma.job.findMany({
      where: { companyId, rotAvdrag: true, betalt: false },
      select: {
        id: true,
        customerId: true,
        customer: {
          select: {
            ...kund.select,
            personnummer: true,
            fastighetsbeteckning: true,
            lagenhetsnummer: true,
            bostadsrattsforening: true,
          },
        },
      },
    }),
  ]);

  const rotSaknas = rotJobb
    .filter(({ customer: c }) => {
      if (!c) return true;
      const harBostad =
        c.fastighetsbeteckning.trim() ||
        (c.lagenhetsnummer.trim() && c.bostadsrattsforening.trim());
      return !c.personnummer.trim() || !harBostad;
    })
    .map((j) => ({
      id: j.id,
      customerId: j.customerId,
      kund: kundnamn(j.customer),
    }));

  const foretagSaknas = [
    !company.orgNummer.trim() && "organisationsnummer",
    !(
      company.adress.trim() &&
      company.postnummer.trim() &&
      company.ort.trim()
    ) && "adress",
    !(
      company.bankgiro.trim() ||
      company.plusgiro.trim() ||
      company.swish.trim()
    ) && "betalsätt (bankgiro, plusgiro eller Swish)",
    !(company.telefon.trim() || company.epost.trim()) && "telefon eller e-post",
  ].filter((x): x is string => Boolean(x));

  const attFaktureraLista = attFakturera.map((j) => ({
    id: j.id,
    kund: kundnamn(j.customer),
    exklMoms: summera(j).totalExklMoms,
  }));
  const obetaldaLista = obetalda.map((j) => ({
    id: j.id,
    kund: kundnamn(j.customer),
    fakturanummer: j.fakturanummer,
    inklMoms: summera(j).totalInklMoms,
  }));

  return {
    companyName: company.name,
    antalPagaende,
    timmarVecka: timmarVecka._sum.timmar ?? 0,
    timmarManad: timmarManad._sum.timmar ?? 0,
    attFakturera: attFaktureraLista,
    attFaktureraSumma: attFaktureraLista.reduce((s, j) => s + j.exklMoms, 0),
    obetalda: obetaldaLista,
    obetaltSumma: obetaldaLista.reduce((s, j) => s + j.inklMoms, 0),
    pagaende: pagaende.map((j) => ({
      id: j.id,
      kund: kundnamn(j.customer),
      plats: [j.customer?.adress, j.customer?.ort].filter(Boolean).join(", "),
      beskrivning: j.planeratArbete.split("\n")[0]?.trim() ?? "",
      pagaende: j.pagaende,
      timmar: j.arbetspass.reduce((s, w) => s + w.timmar, 0),
    })),
    rotSaknas,
    foretagSaknas,
  };
}

export type Oversikt = NonNullable<Awaited<ReturnType<typeof getOversikt>>>;
