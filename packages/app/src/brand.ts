// Det som skiljer apparna åt. Allt annat i packages/app är gemensamt.
// Varje app sätter NEXT_PUBLIC_APP i sin next.config.ts.

export type AppId = "knegarloggen" | "giggerloggen" | "hemfixloggen";

export type Skatteavdrag = {
  typ: "ROT" | "RUT";
  /** Andel av arbetskostnaden inkl. moms. Verifiera mot Skatteverket vid årsskifte. */
  sats: number;
  /** Den som ansöker om utbetalningen, används i fakturans fotnot. */
  utforare: string;
  /** ROT kräver fastighetsbeteckning eller BRF + lägenhetsnummer, RUT bara personnummer. */
  kraverFastighet: boolean;
};

export type Brand = {
  id: AppId;
  namn: string;
  /** Namnet i två färger i navbar/footer, t.ex. Knegar + Loggen. */
  namnDelar: [string, string];
  beskrivning: string;
  /** Vem appen är till för, används i texter ("för hantverkare"). */
  malgrupp: string;
  /** Logga i appens public-mapp, eller null för bara namnet. */
  logo: string | null;
  skatteavdrag: Skatteavdrag | null;
  /** Pris per månad exkl. moms, för texter. Det som dras styrs av STRIPE_PRICE_ID. */
  prisPerManad: number;
};

const ROT: Skatteavdrag = {
  typ: "ROT",
  // 30 % från 2026 (tillfälligt 50 % 12 maj–31 dec 2025).
  sats: 0.3,
  utforare: "Hantverkaren",
  kraverFastighet: true,
};

const RUT: Skatteavdrag = {
  typ: "RUT",
  sats: 0.5,
  utforare: "Utföraren",
  kraverFastighet: false,
};

export const BRANDS: Record<AppId, Brand> = {
  knegarloggen: {
    id: "knegarloggen",
    namn: "Knegarloggen",
    namnDelar: ["Knegar", "Loggen"],
    beskrivning: "Jobblogg för hantverkare",
    malgrupp: "hantverkare",
    logo: "/knegaloggen-logga.png",
    skatteavdrag: ROT,
    prisPerManad: 99,
  },
  giggerloggen: {
    id: "giggerloggen",
    namn: "Giggerloggen",
    namnDelar: ["Gigger", "Loggen"],
    beskrivning:
      "Logga, fakturera och håll koll på dina uppdrag som frilansare",
    malgrupp: "frilansare och konsulter",
    logo: null,
    skatteavdrag: null,
    prisPerManad: 99,
  },
  hemfixloggen: {
    id: "hemfixloggen",
    namn: "Hemfixloggen",
    namnDelar: ["Hemfix", "Loggen"],
    beskrivning: "Jobblogg för hushållsnära tjänster med RUT-avdrag",
    malgrupp: "företag inom hushållsnära tjänster",
    logo: null,
    skatteavdrag: RUT,
    prisPerManad: 99,
  },
};

function hamtaBrand(): Brand {
  const id = process.env.NEXT_PUBLIC_APP as AppId | undefined;
  if (!id || !(id in BRANDS)) {
    throw new Error(
      `NEXT_PUBLIC_APP saknas eller är okänd (${id}). Sätt den i appens next.config.ts.`,
    );
  }
  return BRANDS[id];
}

export const brand = hamtaBrand();
