import { describe, expect, it } from "vitest";
import { beräknaSummering, jobSchema, type JobInput } from "./job-schema";

// 2 × 500 kr material, 200 kr övrigt, 10 h × 600 kr, 50 km × 2,50 kr
// = 1 000 + 200 + 6 000 + 125 = 7 325 kr exkl. moms.
function jobb(extra: Partial<JobInput> = {}) {
  return {
    timpris: 600,
    milersattning: 2.5,
    artiklar: [
      {
        namn: "Kakel",
        artikelnr: "",
        aterforsaljare: "",
        inkopspris: 400,
        pris: 500,
        antal: 2,
      },
    ],
    ovrigaKostnader: [{ beskrivning: "Container", pris: 200 }],
    arbetstider: [
      { datum: "2026-10-01", timmar: 6 },
      { datum: "2026-10-02", timmar: 4 },
    ],
    resor: [{ datum: "2026-10-01", stracka: 50 }],
    ...extra,
  };
}

describe("beräknaSummering", () => {
  it("räknar ihop material, övrigt, arbete och resor", () => {
    const s = beräknaSummering(jobb());
    expect(s.artiklarSum).toBe(1000);
    expect(s.ovrigaSum).toBe(200);
    expect(s.totalTimmar).toBe(10);
    expect(s.arbetstidSum).toBe(6000);
    expect(s.totalStracka).toBe(50);
    expect(s.resorSum).toBe(125);
    expect(s.totalExklMoms).toBe(7325);
  });

  it("lägger på 25 % moms", () => {
    const s = beräknaSummering(jobb());
    expect(s.moms).toBe(1831.25);
    expect(s.totalInklMoms).toBe(9156.25);
  });

  it("ger inget ROT-avdrag när ROT inte är markerat", () => {
    const s = beräknaSummering(jobb());
    expect(s.avdrag).toBe(0);
    expect(s.attBetala).toBe(s.totalInklMoms);
  });

  it("ROT: 30 % av arbetskostnaden inkl. moms – inte av material", () => {
    const s = beräknaSummering({ ...jobb(), skatteavdrag: true });
    expect(s.avdragUnderlagInklMoms).toBe(7500); // 6 000 × 1,25
    expect(s.avdrag).toBe(2250); // 7 500 × 0,3
    expect(s.attBetala).toBe(6906.25); // 9 156,25 − 2 250
  });

  it("fast pris ersätter det beräknade beloppet", () => {
    const s = beräknaSummering(jobb({ fastPris: 5000 }));
    expect(s.harFastPris).toBe(true);
    expect(s.beraknatExklMoms).toBe(7325);
    expect(s.totalExklMoms).toBe(5000);
    expect(s.totalInklMoms).toBe(6250);
  });

  it("ROT med fast pris: underlaget blir aldrig större än det fasta priset", () => {
    const s = beräknaSummering({
      ...jobb({ fastPris: 5000 }),
      skatteavdrag: true,
    });
    expect(s.avdragUnderlagInklMoms).toBe(6250); // min(6 000, 5 000) × 1,25
    expect(s.avdrag).toBe(1875);
    expect(s.attBetala).toBe(4375);
  });

  it("tomt fast pris (NaN från formuläret) räknas som 0", () => {
    const s = beräknaSummering(jobb({ fastPris: Number.NaN }));
    expect(s.totalExklMoms).toBe(0);
    expect(s.totalInklMoms).toBe(0);
  });

  it("tomt jobb ger 0 överallt", () => {
    const s = beräknaSummering({
      timpris: 0,
      milersattning: 0,
      artiklar: [],
      ovrigaKostnader: [],
      arbetstider: [],
      resor: [],
    });
    expect(s.totalInklMoms).toBe(0);
    expect(s.attBetala).toBe(0);
  });
});

describe("jobSchema", () => {
  it("godkänner ett vanligt jobb", () => {
    expect(jobSchema.safeParse(jobb()).success).toBe(true);
  });

  it("nekar negativa priser och timmar", () => {
    expect(
      jobSchema.safeParse(
        jobb({ arbetstider: [{ datum: "2026-10-01", timmar: -1 }] }),
      ).success,
    ).toBe(false);
    expect(
      jobSchema.safeParse(
        jobb({ ovrigaKostnader: [{ beskrivning: "x", pris: -5 }] }),
      ).success,
    ).toBe(false);
  });

  it("kan inte vara betalt utan att vara fakturerat", () => {
    expect(
      jobSchema.safeParse({ ...jobb(), betalt: true, fakturerat: false })
        .success,
    ).toBe(false);
  });
});
