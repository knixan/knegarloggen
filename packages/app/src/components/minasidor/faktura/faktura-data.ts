// Fakturans innehåll – EN källa för både förhandsvisningen (skriv-ut-klient.tsx)
// och PDF:en (faktura-pdf.tsx). Layouterna ska bara rita det som står här,
// så att de inte kan visa olika texter eller belopp (#80).
import { brand } from "../../../brand";
import { beräknaSummering, MOMS_SATS, type Job } from "../../../lib/job-schema";

export type FakturaCompany = {
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
  logoUrl?: string;
  forfallodagar: number;
  drojsmalsranta: number;
  fakturatext: string;
};

export type FakturaRad = {
  beskrivning: string;
  /** Artikelnummer och återförsäljare, visas som en mindre rad under. */
  under?: string;
  antal: string;
  aPris: string;
  belopp: string;
};

export type SummeringsRad = {
  label: string;
  value: string;
  ton?: "dämpad" | "avdrag";
};

export function kr(n: number) {
  return (
    n.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " kr"
  );
}

const procent = (sats: number) => `${Math.round(sats * 100)}%`;
const datum = (d: Date) => d.toLocaleDateString("sv-SE");

export function fakturaData(
  job: Job,
  company: FakturaCompany,
  fakturanummer: number,
  idag: Date = new Date(),
) {
  const summary = beräknaSummering(job);
  const avdrag = brand.skatteavdrag;
  const forfallodagar = company.forfallodagar || 30;
  const forfallo = new Date(idag);
  forfallo.setDate(forfallo.getDate() + forfallodagar);

  const foretagRader = [
    company.orgNummer && `Org.nr ${company.orgNummer}`,
    company.adress,
    [company.postnummer, company.ort].filter(Boolean).join(" "),
    company.telefon,
    company.epost,
  ].filter((x): x is string => Boolean(x));

  const infoRader: { label: string; value: string; fet?: boolean }[] = [
    { label: "Fakturanummer", value: String(fakturanummer), fet: true },
    { label: "Fakturadatum", value: datum(idag) },
    { label: "Förfallodatum", value: datum(forfallo) },
    { label: "Betalningsvillkor", value: `${forfallodagar} dagar netto` },
    ...(company.drojsmalsranta > 0
      ? [{ label: "Dröjsmålsränta", value: `${company.drojsmalsranta}%` }]
      : []),
  ];

  const kund = job.customer;
  const kundNamn = kund
    ? kund.typ === "foretag" && kund.foretagsnamn
      ? kund.foretagsnamn
      : kund.namn
    : "Okänd kund";
  const kundRader = [
    kund?.typ === "foretag" ? kund.kontaktperson : "",
    kund?.adress,
    [kund?.postnummer, kund?.ort].filter(Boolean).join(" "),
    kund?.epost,
    kund?.telefon,
  ].filter((x): x is string => Boolean(x));
  const kundExtra = [
    kund?.personnummer && `Personnummer: ${kund.personnummer}`,
    avdrag?.kraverFastighet &&
      job.skatteavdrag &&
      kund?.fastighetsbeteckning &&
      `${avdrag.typ}-avdrag · Fastighet: ${kund.fastighetsbeteckning}${
        kund.lagenhetsnummer ? ` · Lgh: ${kund.lagenhetsnummer}` : ""
      }`,
  ].filter((x): x is string => Boolean(x));

  const rader: FakturaRad[] = [
    ...job.artiklar.map((a) => ({
      beskrivning: a.namn,
      under:
        [a.artikelnr, a.aterforsaljare].filter(Boolean).join(" · ") ||
        undefined,
      antal: `${a.antal} st`,
      aPris: kr(a.pris),
      belopp: kr(a.pris * a.antal),
    })),
    ...(job.ovrigaKostnader ?? []).map((k) => ({
      beskrivning: k.beskrivning,
      antal: "1 st",
      aPris: kr(k.pris),
      belopp: kr(k.pris),
    })),
    ...(summary.totalTimmar > 0 && summary.timpris > 0
      ? [
          {
            beskrivning: "Arbetstid",
            antal: `${summary.totalTimmar} h`,
            aPris: `${kr(summary.timpris)}/h`,
            belopp: kr(summary.arbetstidSum),
          },
        ]
      : []),
    ...(summary.totalStracka > 0 && summary.milersattning > 0
      ? [
          {
            beskrivning: "Resor / milersättning",
            antal: `${summary.totalStracka} km`,
            aPris: `${kr(summary.milersattning)}/km`,
            belopp: kr(summary.resorSum),
          },
        ]
      : []),
  ];

  const summering: SummeringsRad[] = [
    {
      label: summary.harFastPris ? "Fast pris exkl. moms" : "Summa exkl. moms",
      value: kr(summary.totalExklMoms),
    },
    {
      label: `Moms ${procent(MOMS_SATS)}`,
      value: kr(summary.moms),
      ton: "dämpad",
    },
    ...(avdrag && summary.avdrag > 0
      ? [
          {
            label: `${avdrag.typ}-avdrag ${procent(avdrag.sats)} (av ${kr(
              summary.avdragUnderlagInklMoms,
            )} arbete inkl. moms)*`,
            value: `−${kr(summary.avdrag)}`,
            ton: "avdrag" as const,
          },
        ]
      : []),
  ];

  const betalning = [
    company.bankgiro && `Bankgiro: ${company.bankgiro}`,
    company.plusgiro && `Plusgiro: ${company.plusgiro}`,
    company.swish && `Swish: ${company.swish}`,
  ].filter((x): x is string => Boolean(x));

  const fotnoter = [
    company.fSkatt &&
      `✓ Godkänd för F-skatt · Momsreg.nr: ${
        company.momsNummer ||
        `SE${(company.orgNummer ?? "").replace("-", "")}01`
      }`,
    avdrag &&
      summary.avdrag > 0 &&
      `* ${avdrag.typ}-avdrag: Avser ${procent(
        avdrag.sats,
      )} av arbetskostnad inkl. moms. ${avdrag.utforare} ansöker om utbetalning hos Skatteverket.`,
  ].filter((x): x is string => Boolean(x));

  return {
    foretag: {
      namn: company.name,
      logoUrl: company.logoUrl || undefined,
      rader: foretagRader,
    },
    infoRader,
    kund: { namn: kundNamn, rader: kundRader, extra: kundExtra },
    rader,
    utfortArbete: job.utfortArbete || undefined,
    summering,
    attBetala: kr(summary.attBetala),
    betalning,
    ocr: String(fakturanummer),
    fakturatext: company.fakturatext || undefined,
    fotnoter,
  };
}

export type FakturaData = ReturnType<typeof fakturaData>;
