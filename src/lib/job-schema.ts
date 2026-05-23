import { z } from "zod";

export const articleSchema = z.object({
  namn: z
    .string()
    .trim()
    .min(1, "Namn krävs")
    .max(120),

  artikelnr: z
    .string()
    .trim()
    .max(50)
    .optional()
    .default(""),

  pris: z.coerce
    .number()
    .min(0, "Pris får inte vara negativt"),

  antal: z.coerce
    .number()
    .min(1, "Minst 1")
    .default(1),
});

export const resaSchema = z.object({
  datum: z
    .string()
    .min(1, "Datum krävs"),

  stracka: z.coerce
    .number()
    .min(0, "Sträcka får inte vara negativ"),

  avstand: z.coerce
    .number()
    .min(0, "Avstånd får inte vara negativt")
    .default(0),
});

export const arbetstidSchema = z.object({
  datum: z
    .string()
    .min(1, "Datum krävs"),

  timmar: z.coerce
    .number()
    .min(0, "Timmar får inte vara negativt"),
});

export const jobSchema = z.object({
  namn: z
    .string()
    .trim()
    .min(1, "Kundnamn krävs")
    .max(120),

  adress: z
    .string()
    .trim()
    .min(1, "Adress krävs")
    .max(200),

  telefon: z
    .string()
    .trim()
    .min(6, "Ange ett giltigt telefonnummer")
    .max(30)
    .regex(
      /^[0-9+\-\s()]+$/,
      "Endast siffror och + - ( ) tillåtna"
    ),

  epost: z
    .string()
    .trim()
    .email("Ogiltig e-post")
    .max(200),

  artiklar: z
    .array(articleSchema)
    .min(1, "Lägg till minst en artikel"),

  resor: z
    .array(resaSchema)
    .default([]),

  arbetstider: z
    .array(arbetstidSchema)
    .default([]),

  rotAvdrag: z
    .boolean()
    .default(false),

  utfort: z
    .boolean()
    .default(false),

  fakturerat: z
    .boolean()
    .default(false),

  betalt: z
    .boolean()
    .default(false),

  anteckningar: z
    .string()
    .max(2000)
    .optional()
    .default(""),
});

export type JobInput = z.infer<typeof jobSchema>;

export type Job = JobInput & {
  id: string;
  skapad: string;
};

export function beräknaSummering(job: JobInput) {
  const artiklarSum = job.artiklar.reduce(
    (sum, artikel) =>
      sum + artikel.pris * artikel.antal,
    0
  );

  const totalTimmar = job.arbetstider.reduce(
    (sum, arbetstid) =>
      sum + arbetstid.timmar,
    0
  );

  const totalStracka = job.resor.reduce(
    (sum, resa) =>
      sum + resa.stracka,
    0
  );

  const totalAvstand = job.resor.reduce(
    (sum, resa) =>
      sum + resa.avstand,
    0
  );

  const antalResor = job.resor.length;

  return {
    artiklarSum,
    totalTimmar,
    totalStracka,
    totalAvstand,
    antalResor,
  };
}