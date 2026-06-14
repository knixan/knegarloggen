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
    .string()
    .trim()
    .max(200)
    .email("Ogiltig e-post")
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

export const articleSchema = z.object({
  id: z.string().optional(),
  namn: z.string().trim().min(1, "Namn krävs").max(120),
  artikelnr: z.string().trim().max(50).optional().default(""),
  aterforsaljare: z.string().trim().max(120).optional().default(""),
  pris: z.coerce.number().min(0, "Pris får inte vara negativt"),
  antal: z.coerce.number().min(1, "Minst 1").default(1),
});

export const resaSchema = z.object({
  id: z.string().optional(),
  datum: z.string().min(1, "Datum krävs"),
  stracka: z.coerce.number().min(0, "Sträcka får inte vara negativ"),
});

export const arbetstidSchema = z.object({
  id: z.string().optional(),
  datum: z.string().min(1, "Datum krävs"),
  timmar: z.coerce.number().min(0, "Timmar får inte vara negativt"),
});

export const jobSchema = z.object({
  customerId: z.string().optional(),

  rotAvdrag: z.boolean().default(false),
  pagaende: z.boolean().default(false),
  utfort: z.boolean().default(false),
  fakturerat: z.boolean().default(false),
  betalt: z.boolean().default(false),

  artiklar: z.array(articleSchema).default([]),
  resor: z.array(resaSchema).default([]),
  arbetstider: z.array(arbetstidSchema).default([]),

  anteckningar: z.string().max(2000).optional().default(""),
  ovrigaArtiklar: z.string().max(2000).optional().default(""),
  utfortArbete: z.string().max(2000).optional().default(""),
  planeratArbete: z.string().max(2000).optional().default(""),

  bilder: z
    .array(z.object({ url: z.string(), key: z.string() }))
    .default([]),
});

export type JobInput = z.infer<typeof jobSchema>;

export type Job = JobInput & {
  id: string;
  skapad: string;
  customer?: Customer | null;
};

export function beräknaSummering(job: JobInput) {
  const artiklarSum = job.artiklar.reduce(
    (sum, artikel) => sum + artikel.pris * artikel.antal,
    0,
  );
  const totalTimmar = job.arbetstider.reduce(
    (sum, a) => sum + a.timmar,
    0,
  );
  const totalStracka = job.resor.reduce((sum, r) => sum + r.stracka, 0);
  const antalResor = job.resor.length;

  return { artiklarSum, totalTimmar, totalStracka, antalResor };
}
