import { describe, expect, it } from "vitest";
import type { Job } from "@/lib/job-schema";
import { fakturaData, kr, type FakturaCompany } from "./faktura-data";

const company: FakturaCompany = {
  name: "Bygg AB",
  orgNummer: "556677-8899",
  adress: "Storgatan 1",
  postnummer: "123 45",
  ort: "Skeninge",
  telefon: "070-123 45 67",
  epost: "info@bygg.se",
  fSkatt: true,
  momsNummer: "",
  bankgiro: "123-4567",
  plusgiro: "",
  swish: "",
  logoUrl: "",
  forfallodagar: 30,
  drojsmalsranta: 8,
  fakturatext: "Tack!",
};

function jobb(extra: Partial<Job> = {}): Job {
  return {
    id: "j1",
    customer: {
      id: "c1",
      typ: "privat",
      namn: "Anna Andersson",
      adress: "Kundvägen 2",
      postnummer: "111 22",
      ort: "Linköping",
      telefon: "",
      epost: "",
      personnummer: "19800101-1234",
      foretagsnamn: "",
      kontaktperson: "",
      orgNummer: "",
      fastighetsbeteckning: "Skeninge 1:2",
      lagenhetsnummer: "",
      bostadsrattsforening: "",
    },
    timpris: 600,
    milersattning: 0,
    rotAvdrag: false,
    pagaende: false,
    utfort: true,
    fakturerat: false,
    betalt: false,
    artiklar: [
      {
        namn: "Kakel",
        artikelnr: "K-1",
        aterforsaljare: "Ahlsell",
        inkopspris: 0,
        pris: 500,
        antal: 2,
      },
    ],
    resor: [],
    arbetstider: [{ datum: "2026-10-01", timmar: 10 }],
    ovrigaKostnader: [],
    anteckningar: "",
    utfortArbete: "Kaklat badrum",
    planeratArbete: "",
    bilder: [],
    ...extra,
  } as Job;
}

const idag = new Date("2026-10-31T12:00:00");

describe("fakturaData", () => {
  it("har fakturainformation med förfallodatum", () => {
    const d = fakturaData(jobb(), company, 42, idag);
    expect(d.infoRader.map((r) => r.label)).toEqual([
      "Fakturanummer",
      "Fakturadatum",
      "Förfallodatum",
      "Betalningsvillkor",
      "Dröjsmålsränta",
    ]);
    expect(d.infoRader[0].value).toBe("42");
    expect(d.infoRader[2].value).toBe("2026-11-30");
    expect(d.ocr).toBe("42");
  });

  it("visar artikelnummer och återförsäljare under artikeln", () => {
    const d = fakturaData(jobb(), company, 1, idag);
    expect(d.rader[0]).toMatchObject({
      beskrivning: "Kakel",
      under: "K-1 · Ahlsell",
      antal: "2 st",
      belopp: kr(1000),
    });
    expect(d.rader[1].beskrivning).toBe("Arbetstid");
  });

  it("utan ROT: ingen ROT-rad och att betala = inkl. moms", () => {
    const d = fakturaData(jobb(), company, 1, idag);
    expect(d.summering.some((r) => r.ton === "rot")).toBe(false);
    expect(d.attBetala).toBe(kr(8750)); // (1 000 + 6 000) × 1,25
    expect(d.fotnoter.some((f) => f.includes("ROT"))).toBe(false);
  });

  it("med ROT: avdrag, fastighet och fotnot", () => {
    const d = fakturaData(jobb({ rotAvdrag: true }), company, 1, idag);
    const rot = d.summering.find((r) => r.ton === "rot");
    expect(rot?.value).toBe(`−${kr(2250)}`); // 6 000 × 1,25 × 0,3
    expect(d.attBetala).toBe(kr(6500));
    expect(d.kund.extra).toContain("ROT-avdrag · Fastighet: Skeninge 1:2");
    expect(d.fotnoter.some((f) => f.includes("ROT-avdrag: Avser 30%"))).toBe(
      true,
    );
  });

  it("döljer betalningsrutan när inga betalsätt finns", () => {
    const d = fakturaData(
      jobb(),
      { ...company, bankgiro: "", plusgiro: "", swish: "" },
      1,
      idag,
    );
    expect(d.betalning).toEqual([]);
  });

  it("räknar fram momsnummer från orgnr när det saknas", () => {
    const d = fakturaData(jobb(), company, 1, idag);
    expect(d.fotnoter[0]).toContain("SE556677889901");
  });
});
