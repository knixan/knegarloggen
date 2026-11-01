import { describe, expect, it, vi } from "vitest";
import { createAuth } from "@knegarloggen/auth";
import {
  PROVPERIOD_DAGAR,
  evaluateSubscription,
  kanStartaCheckout,
  nyProvperiod,
  stripeTrialEnd,
  tillhorAppen,
} from "./prenumeration-regel";

const nu = new Date("2026-11-01T12:00:00Z");
const dagar = (n: number) => new Date(nu.getTime() + n * 86_400_000);

describe("evaluateSubscription", () => {
  it("utan prenumeration är kontot spärrat", () => {
    expect(evaluateSubscription(null, nu).isExpired).toBe(true);
  });

  it("pågående provperiod är aktiv och räknar dagar kvar", () => {
    const r = evaluateSubscription(
      { status: "trialing", trialEnd: dagar(12) },
      nu,
    );
    expect(r).toEqual({ isExpired: false, daysLeft: 12 });
  });

  it("utgången provperiod spärrar", () => {
    expect(
      evaluateSubscription({ status: "trialing", trialEnd: dagar(-1) }, nu)
        .isExpired,
    ).toBe(true);
  });

  it("active är aktiv, past_due och canceled spärrar", () => {
    expect(
      evaluateSubscription({ status: "active", trialEnd: null }, nu).isExpired,
    ).toBe(false);
    for (const status of ["past_due", "canceled", "unpaid"]) {
      expect(
        evaluateSubscription({ status, trialEnd: null }, nu).isExpired,
      ).toBe(true);
    }
  });
});

describe("nyProvperiod", () => {
  it(`ger ${PROVPERIOD_DAGAR} dagar och räknas som aktiv direkt`, () => {
    const p = nyProvperiod(nu);
    expect(p.status).toBe("trialing");
    expect(p.trialEnd.getTime() - nu.getTime()).toBe(
      PROVPERIOD_DAGAR * 86_400_000,
    );
    expect(evaluateSubscription(p, nu).isExpired).toBe(false);
  });
});

describe("registrering skapar provperioden", () => {
  // Felet som låste ute alla nya användare: provperioden skapades bara i en
  // serverfunktion som aldrig anropades. Nu ligger den i better-auths hook,
  // som körs oavsett hur kontot skapas.
  it("createAuth kör onUserCreated när ett konto skapas", async () => {
    const onUserCreated = vi.fn().mockResolvedValue(undefined);
    const auth = createAuth({
      appUrl: "http://localhost:3000",
      prisma: {} as never,
      sendVerificationEmail: async () => {},
      onUserCreated,
    });
    const after = auth.options.databaseHooks?.user?.create?.after;
    expect(after).toBeTypeOf("function");
    await after!({ id: "u1", email: "a@b.se" } as never);
    expect(onUserCreated).toHaveBeenCalledWith({ id: "u1", email: "a@b.se" });
  });

  it("role kan inte sättas av klienten", () => {
    const auth = createAuth({
      appUrl: "http://localhost:3000",
      prisma: {} as never,
      sendVerificationEmail: async () => {},
    });
    expect(auth.options.user?.additionalFields?.role?.input).toBe(false);
  });
});

describe("kanStartaCheckout", () => {
  it("ny kund och avslutad prenumeration får starta checkout", () => {
    expect(kanStartaCheckout(null)).toBe(true);
    expect(
      kanStartaCheckout({ status: "trialing", stripeSubscriptionId: null }),
    ).toBe(true);
    expect(
      kanStartaCheckout({ status: "canceled", stripeSubscriptionId: "sub_1" }),
    ).toBe(true);
  });

  it("löpande prenumeration får inte starta en till (dubbel debitering)", () => {
    for (const status of ["active", "trialing", "past_due", "unpaid"]) {
      expect(kanStartaCheckout({ status, stripeSubscriptionId: "sub_1" })).toBe(
        false,
      );
    }
  });
});

describe("stripeTrialEnd", () => {
  it("resten av provperioden följer med till Stripe", () => {
    expect(stripeTrialEnd(dagar(10), nu)).toBe(
      Math.floor(dagar(10).getTime() / 1000),
    );
  });

  it("inte när det är mindre än 48 h kvar (Stripes gräns)", () => {
    expect(stripeTrialEnd(dagar(1), nu)).toBeUndefined();
    expect(stripeTrialEnd(null, nu)).toBeUndefined();
  });
});

describe("tillhorAppen", () => {
  it("bara händelser märkta med den här appen", () => {
    expect(tillhorAppen({ app: "knegarloggen" }, "knegarloggen")).toBe(true);
    expect(tillhorAppen({ app: "giggerloggen" }, "knegarloggen")).toBe(false);
    expect(tillhorAppen({}, "knegarloggen")).toBe(false);
    expect(tillhorAppen(null, "knegarloggen")).toBe(false);
  });
});
