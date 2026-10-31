import { describe, expect, it } from "vitest";
import {
  arbetspassSchema,
  beraknaTotal,
  kundSchema,
  ovrigKostnadSchema,
  resaSchema,
  type UppdragMedRelationer,
} from "./uppdrag-schema";

// 8 h × 800 kr, 100 km × 2,50 kr, 300 kr övrigt.
function uppdrag(extra: Partial<UppdragMedRelationer> = {}) {
  return {
    id: "u1",
    titel: "Uppdrag",
    beskrivning: "",
    uppdragsTyp: "konsulting",
    status: "pagaende",
    prisTyp: "timme",
    timpris: 800,
    fastPris: 0,
    milersattning: 2.5,
    rutAvdrag: false,
    fakturaNummer: null,
    anteckningar: "",
    utfortArbete: "",
    planeratArbete: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: null,
    arbetspass: [{ id: "a", datum: new Date(), timmar: 8, beskrivning: "" }],
    resor: [{ id: "r", datum: new Date(), stracka: 100, beskrivning: "" }],
    ovrigaKostnader: [{ id: "k", beskrivning: "Licens", pris: 300 }],
    images: [],
    ...extra,
  } as UppdragMedRelationer;
}

describe("beraknaTotal", () => {
  it("timpris: arbete + resor + övrigt, plus 25 % moms", () => {
    const t = beraknaTotal(uppdrag());
    expect(t.arbetstidSum).toBe(6400);
    expect(t.resorSum).toBe(250);
    expect(t.ovrigaSum).toBe(300);
    expect(t.totalExklMoms).toBe(6950);
    expect(t.moms).toBe(1737.5);
    expect(t.totalInklMoms).toBe(8687.5);
  });

  it("fast pris ersätter arbetstiden men resor och övrigt läggs till", () => {
    const t = beraknaTotal(uppdrag({ prisTyp: "fast", fastPris: 10000 }));
    expect(t.arbetstidSum).toBe(0);
    expect(t.totalExklMoms).toBe(10550);
  });
});

describe("arbetspass, resor och kostnader", () => {
  it("godkänner vanliga värden", () => {
    expect(
      arbetspassSchema.safeParse({ datum: "2026-10-31", timmar: 7.5 }).success,
    ).toBe(true);
    expect(
      resaSchema.safeParse({ datum: "2026-10-31", stracka: 42 }).success,
    ).toBe(true);
    expect(
      ovrigKostnadSchema.safeParse({ beskrivning: "Parkering", pris: 60 })
        .success,
    ).toBe(true);
  });

  it("nekar NaN, negativa och orimliga värden", () => {
    for (const timmar of [Number.NaN, -1, 0, 25]) {
      expect(
        arbetspassSchema.safeParse({ datum: "2026-10-31", timmar }).success,
      ).toBe(false);
    }
    expect(
      resaSchema.safeParse({ datum: "2026-10-31", stracka: -10 }).success,
    ).toBe(false);
    expect(
      ovrigKostnadSchema.safeParse({ beskrivning: "x", pris: Number.NaN })
        .success,
    ).toBe(false);
  });

  it("nekar ogiltiga datum", () => {
    for (const datum of [
      "",
      "igår",
      "2026-02-31",
      "2026-13-01",
      "31/10/2026",
    ]) {
      expect(arbetspassSchema.safeParse({ datum, timmar: 1 }).success).toBe(
        false,
      );
    }
  });
});

describe("kundSchema", () => {
  it("tar bort fält som klienten inte får sätta", () => {
    const kund = kundSchema.parse({
      namn: "Test AB",
      kundTyp: "foretag",
      companyId: "annat-foretag",
      id: "x",
    });
    expect(kund).not.toHaveProperty("companyId");
    expect(kund).not.toHaveProperty("id");
  });

  it("kräver namn och giltig kundtyp", () => {
    expect(kundSchema.safeParse({ namn: "" }).success).toBe(false);
    expect(kundSchema.safeParse({ namn: "A", kundTyp: "hacker" }).success).toBe(
      false,
    );
  });
});

describe("RUT", () => {
  it("50 % av arbetskostnaden inkl. moms dras av", () => {
    const t = beraknaTotal(uppdrag({ rutAvdrag: true }));
    expect(t.rutAvdrag).toBe(4000); // 6 400 × 1,25 × 0,5
    expect(t.attBetala).toBe(4687.5); // 8 687,5 − 4 000
  });

  it("utan RUT är att betala = inkl. moms", () => {
    const t = beraknaTotal(uppdrag());
    expect(t.rutAvdrag).toBe(0);
    expect(t.attBetala).toBe(t.totalInklMoms);
  });

  // Med fast pris blir arbetstidSum 0 och därmed inget RUT-avdrag alls.
  // Arbetsdelen av det fasta priset behöver anges (se #74 för ROT).
  it.todo("RUT med fast pris");
});
