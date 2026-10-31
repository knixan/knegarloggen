import { z } from "zod";

export const arbetspassSchema = z.object({
  datum: z.string().min(1, "Datum krävs"),
  timmar: z.number().min(0.25, "Minst 15 minuter").max(24),
  beskrivning: z.string().optional().default(""),
});

export const resaSchema = z.object({
  datum: z.string().min(1, "Datum krävs"),
  stracka: z.number().min(1, "Ange sträcka i km"),
  beskrivning: z.string().optional().default(""),
});

export const ovrigKostnadSchema = z.object({
  beskrivning: z.string().min(1, "Beskriv kostnaden"),
  pris: z.number().min(0),
});

export const uppdragSchema = z.object({
  titel: z.string().min(1, "Titel krävs"),
  beskrivning: z.string().optional().default(""),
  uppdragsTyp: z
    .enum([
      "konsulting",
      "design",
      "utbildning",
      "handel",
      "it",
      "juridik",
      "annat",
    ])
    .default("konsulting"),
  customerId: z.string().optional().nullable(),
  prisTyp: z.enum(["timme", "fast"]).default("timme"),
  timpris: z.number().min(0).default(0),
  fastPris: z.number().min(0).default(0),
  milersattning: z.number().min(0).default(0),
  anteckningar: z.string().optional().default(""),
  utfortArbete: z.string().optional().default(""),
  planeratArbete: z.string().optional().default(""),
});

export type UppdragFormValues = z.infer<typeof uppdragSchema>;
export type ArbetspassFormValues = z.infer<typeof arbetspassSchema>;
export type ResaFormValues = z.infer<typeof resaSchema>;
export type OvrigKostnadFormValues = z.infer<typeof ovrigKostnadSchema>;

export type UppdragMedRelationer = {
  id: string;
  titel: string;
  beskrivning: string;
  uppdragsTyp: string;
  status: string;
  prisTyp: string;
  timpris: number;
  fastPris: number;
  milersattning: number;
  fakturaNummer: number | null;
  anteckningar: string;
  utfortArbete: string;
  planeratArbete: string;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    namn: string;
    foretagsnamn: string;
    kundTyp: string;
    epost: string;
    telefon: string;
  } | null;
  arbetspass: {
    id: string;
    datum: Date;
    timmar: number;
    beskrivning: string;
  }[];
  resor: { id: string; datum: Date; stracka: number; beskrivning: string }[];
  ovrigaKostnader: { id: string; beskrivning: string; pris: number }[];
};

export function beraknaTotal(uppdrag: UppdragMedRelationer): {
  totalTimmar: number;
  arbetstidSum: number;
  totalStracka: number;
  resorSum: number;
  ovrigaSum: number;
  totalExklMoms: number;
  moms: number;
  totalInklMoms: number;
} {
  const totalTimmar = uppdrag.arbetspass.reduce((s, a) => s + a.timmar, 0);
  const arbetstidSum =
    uppdrag.prisTyp === "timme" ? totalTimmar * uppdrag.timpris : 0;

  const totalStracka = uppdrag.resor.reduce((s, r) => s + r.stracka, 0);
  const resorSum = totalStracka * uppdrag.milersattning;

  const ovrigaSum = uppdrag.ovrigaKostnader.reduce((s, k) => s + k.pris, 0);

  const basePris = uppdrag.prisTyp === "fast" ? uppdrag.fastPris : arbetstidSum;
  const totalExklMoms = basePris + resorSum + ovrigaSum;
  const moms = totalExklMoms * 0.25;
  const totalInklMoms = totalExklMoms + moms;

  return {
    totalTimmar,
    arbetstidSum,
    totalStracka,
    resorSum,
    ovrigaSum,
    totalExklMoms,
    moms,
    totalInklMoms,
  };
}

// ============================================================
// Kund och företag – valideras på servern. z.object tar bort okända
// fält, så klienten kan inte smyga med t.ex. companyId eller userId.
// ============================================================

// Tomma fält i FormData kan komma som null – gör om till "".
const text = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) => v?.trim() ?? "");

export const kundSchema = z.object({
  kundTyp: z.enum(["privatperson", "foretag"]).default("privatperson"),
  namn: z.string().trim().min(1, "Namn krävs").max(120),
  adress: text(200),
  postnummer: text(20),
  stad: text(100),
  telefon: text(50),
  epost: text(200),
  personnummer: text(20),
  foretagsnamn: text(200),
  kontaktperson: text(120),
  orgNummer: text(20),
});

export const foretagSchema = z.object({
  namn: text(200),
  orgNummer: text(20),
  adress: text(200),
  postnummer: text(20),
  stad: text(100),
  telefon: text(50),
  epost: text(200),
  hemsida: text(200),
  betalningsvillkor: z.coerce.number().int().min(0).max(365).default(30),
  drojsmalsranta: text(20),
  fakturaText: text(2000),
  momsregistrerad: z.boolean().default(false),
  momsNummer: text(30),
  bankgiro: text(20),
  plusgiro: text(20),
  swish: text(20),
  iban: text(40),
  bic: text(20),
});

export type KundInput = z.input<typeof kundSchema>;
export type ForetagInput = z.input<typeof foretagSchema>;
