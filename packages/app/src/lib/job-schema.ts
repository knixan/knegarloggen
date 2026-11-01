import { brand } from "../brand";
import { z } from "zod";

// ============================================================
// Kund-schema
// ============================================================

export const customerSchema = z.object({
  typ: z.enum(["privat", "foretag"]).default("privat"),
  namn: z.string().trim().min(1, "Namn krävs").max(120),
  adress: z.string().trim().max(200).optional().default(""),
  postnummer: z.string().trim().max(10).optional().default(""),
  ort: z.string().trim().max(100).optional().default(""),
  telefon: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-\s()]*$/, "Endast siffror och + - ( ) tillåtna")
    .optional()
    .default(""),
  epost: z
    .email({ error: "Ogiltig e-post" })
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),
  personnummer: z.string().trim().max(30).optional().default(""),
  foretagsnamn: z.string().trim().max(120).optional().default(""),
  kontaktperson: z.string().trim().max(120).optional().default(""),
  orgNummer: z.string().trim().max(30).optional().default(""),
  fastighetsbeteckning: z.string().trim().max(120).optional().default(""),
  lagenhetsnummer: z.string().trim().max(30).optional().default(""),
  bostadsrattsforening: z.string().trim().max(120).optional().default(""),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export type Customer = CustomerInput & {
  id: string;
  companyId: string;
  skapad: string;
};

// ============================================================
// Jobb-schema
// ============================================================

// Övre gränser – skyddar mot orimliga belopp och enorma anrop.
const MAX_RADER = 200;
const MAX_BILDER = 30;
const MAX_BELOPP = 10_000_000;

/** ÅÅÅÅ-MM-DD som är ett riktigt datum (inte t.ex. 2026-02-31). */
export const datumSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ogiltigt datum")
  .refine((d) => {
    const dt = new Date(`${d}T00:00:00Z`);
    return !Number.isNaN(dt.getTime()) && dt.toISOString().startsWith(d);
  }, "Ogiltigt datum");

/** Datum från formuläret som UTC-midnatt – samma som @db.Date i databasen. */
export function tillDbDatum(datum: string) {
  return new Date(`${datum}T00:00:00Z`);
}

export const articleSchema = z.object({
  id: z.string().optional(),
  namn: z.string().trim().min(1, "Namn krävs").max(120),
  artikelnr: z.string().trim().max(50).optional().default(""),
  aterforsaljare: z.string().trim().max(120).optional().default(""),
  inkopspris: z.coerce.number().min(0).max(MAX_BELOPP).optional().default(0),
  pris: z.coerce
    .number()
    .min(0, "Pris får inte vara negativt")
    .max(MAX_BELOPP, "För stort belopp"),
  antal: z.coerce
    .number()
    .int("Antal måste vara ett heltal")
    .min(1, "Minst 1")
    .max(100_000)
    .default(1),
});

export const resaSchema = z.object({
  id: z.string().optional(),
  datum: datumSchema,
  stracka: z.coerce
    .number()
    .min(0, "Sträcka får inte vara negativ")
    .max(10_000, "Orimligt lång sträcka"),
});

export const arbetstidSchema = z.object({
  id: z.string().optional(),
  datum: datumSchema,
  timmar: z.coerce
    .number()
    .min(0, "Timmar får inte vara negativt")
    .max(24, "Max 24 timmar per pass"),
});

export const ovrigKostnadSchema = z.object({
  id: z.string().optional(),
  beskrivning: z.string().trim().min(1, "Beskrivning krävs").max(200),
  pris: z.coerce
    .number()
    .min(0, "Pris får inte vara negativt")
    .max(MAX_BELOPP, "För stort belopp"),
});

export const jobSchema = z
  .object({
    customerId: z.string().optional(),

    timpris: z.coerce.number().min(0).max(100_000).default(0),
    milersattning: z.coerce.number().min(0).max(1_000).default(0),

    skatteavdrag: z.boolean().default(false),
    pagaende: z.boolean().default(false),
    utfort: z.boolean().default(false),
    fakturerat: z.boolean().default(false),
    betalt: z.boolean().default(false),

    artiklar: z.array(articleSchema).max(MAX_RADER).default([]),
    resor: z.array(resaSchema).max(MAX_RADER).default([]),
    arbetstider: z.array(arbetstidSchema).max(MAX_RADER).default([]),
    ovrigaKostnader: z.array(ovrigKostnadSchema).max(MAX_RADER).default([]),

    anteckningar: z.string().max(2000).optional().default(""),
    utfortArbete: z.string().max(2000).optional().default(""),
    planeratArbete: z.string().max(2000).optional().default(""),

    bilder: z
      .array(z.object({ url: z.string(), key: z.string() }))
      .max(MAX_BILDER)
      .default([]),

    fastPris: z.coerce.number().min(0).max(MAX_BELOPP).optional(),
  })
  .refine((data) => !(data.betalt && !data.fakturerat), {
    message: "Kan inte markera som betalt utan att ha fakturerat",
    path: ["betalt"],
  });

export type JobInput = z.infer<typeof jobSchema>;

export type Job = JobInput & {
  id: string;
  skapad: string;
  fakturanummer?: number;
  customer?: Customer | null;
};

export const companySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Företagsnamn krävs")
    .max(120, "Företagsnamnet är för långt"),
  orgNummer: z.string().trim().max(30).default(""),
  adress: z.string().trim().max(200).default(""),
  postnummer: z.string().trim().max(10).default(""),
  ort: z.string().trim().max(100).default(""),
  telefon: z.string().trim().max(30).default(""),
  epost: z.string().trim().max(200).default(""),
  fSkatt: z.boolean().default(false),
  momsNummer: z.string().trim().max(30).default(""),
  bankgiro: z.string().trim().max(30).default(""),
  plusgiro: z.string().trim().max(30).default(""),
  swish: z.string().trim().max(30).default(""),
  nastaFakturanummer: z.coerce.number().int().min(1).default(1),
  forfallodagar: z.coerce.number().int().min(0).default(30),
  drojsmalsranta: z.coerce.number().min(0).default(0),
  fakturatext: z.string().max(1000).default(""),
});

export type CompanyInput = z.infer<typeof companySchema>;

export const MOMS_SATS = 0.25;

/**
 * Enda stället där jobbets summor räknas ut – formulär, lista, faktura,
 * utskrift och e-post ska alla använda denna så att de visar samma belopp.
 */
export function beräknaSummering(
  job: Pick<
    JobInput,
    | "artiklar"
    | "ovrigaKostnader"
    | "arbetstider"
    | "resor"
    | "timpris"
    | "milersattning"
    | "fastPris"
  > & { skatteavdrag?: boolean },
  /** ROT/RUT-sats från appens brand (0 = appen har inget skatteavdrag). */
  avdragSats: number = brand.skatteavdrag?.sats ?? 0,
) {
  const artiklarSum = job.artiklar.reduce(
    (sum, a) => sum + a.pris * a.antal,
    0,
  );
  const ovrigaSum = (job.ovrigaKostnader ?? []).reduce(
    (sum, k) => sum + k.pris,
    0,
  );
  const totalTimmar = job.arbetstider.reduce((sum, a) => sum + a.timmar, 0);
  const totalStracka = job.resor.reduce((sum, r) => sum + r.stracka, 0);
  const antalResor = job.resor.length;

  const timpris = job.timpris ?? 0;
  const milersattning = job.milersattning ?? 0;
  const arbetstidSum = totalTimmar * timpris;
  const resorSum = totalStracka * milersattning;
  const beraknatExklMoms = artiklarSum + ovrigaSum + arbetstidSum + resorSum;

  // Fast pris ersätter det beräknade beloppet. Ett tomt fält i formuläret
  // ger NaN (valueAsNumber) – räkna det som 0 så länge fast pris är påslaget.
  const harFastPris = job.fastPris !== undefined && job.fastPris !== null;
  const fastPris = harFastPris
    ? Number.isFinite(job.fastPris)
      ? (job.fastPris as number)
      : 0
    : null;

  const totalExklMoms = fastPris ?? beraknatExklMoms;
  const moms = totalExklMoms * MOMS_SATS;
  const totalInklMoms = totalExklMoms + moms;

  // ROT/RUT gäller bara arbetskostnaden. Med fast pris vet vi inte exakt
  // hur stor del som är arbete – använd loggad arbetstid, men aldrig mer
  // än det fasta priset (#81). Taket per person och år hanteras inte här.
  const avdragUnderlagExklMoms =
    job.skatteavdrag && avdragSats > 0
      ? Math.min(arbetstidSum, totalExklMoms)
      : 0;
  const avdragUnderlagInklMoms = avdragUnderlagExklMoms * (1 + MOMS_SATS);
  const avdrag = avdragUnderlagInklMoms * avdragSats;
  const attBetala = totalInklMoms - avdrag;

  return {
    artiklarSum,
    ovrigaSum,
    totalTimmar,
    totalStracka,
    antalResor,
    timpris,
    milersattning,
    arbetstidSum,
    resorSum,
    beraknatExklMoms,
    harFastPris,
    fastPris,
    totalExklMoms,
    moms,
    totalInklMoms,
    avdragUnderlagInklMoms,
    avdrag,
    attBetala,
  };
}
