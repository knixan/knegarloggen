// Regler för prenumeration och provperiod – utan databas, så att de kan
// användas av server, klient och tester. Databasdelen ligger i subscription.ts.
import { addDays, differenceInDays } from "date-fns";

export const PROVPERIOD_DAGAR = 30;

/** Stripe kräver att trial_end ligger minst 48 h fram i tiden. */
const STRIPE_MIN_TRIAL_MS = 48 * 60 * 60 * 1000;

export type SubscriptionRow = {
  status: string;
  trialEnd: Date | null;
} | null;

/**
 * Om kontot får använda appen. Används av layouten (TrialGate),
 * inställningssidan och server actions – samma regel överallt.
 */
export function evaluateSubscription(
  subscription: SubscriptionRow,
  now: Date = new Date(),
) {
  if (!subscription) return { isExpired: true, daysLeft: 0 };

  const isActive =
    subscription.status === "active" ||
    (subscription.status === "trialing" &&
      !!subscription.trialEnd &&
      subscription.trialEnd > now);

  if (!isActive) return { isExpired: true, daysLeft: 0 };

  const daysLeft =
    subscription.status === "trialing" && subscription.trialEnd
      ? Math.max(0, differenceInDays(subscription.trialEnd, now))
      : 30;

  return { isExpired: false, daysLeft };
}

/** Provperioden som skapas för varje nytt konto. */
export function nyProvperiod(now: Date = new Date()) {
  const trialEnd = addDays(now, PROVPERIOD_DAGAR);
  return {
    status: "trialing",
    trialEnd,
    currentPeriodEnd: trialEnd,
  } as const;
}

/**
 * Får användaren starta en ny Stripe Checkout? Nej om det redan finns en
 * Stripe-prenumeration som löper – annars kan man betala dubbelt.
 */
export function kanStartaCheckout(
  sub: { status: string; stripeSubscriptionId: string | null } | null,
) {
  if (!sub?.stripeSubscriptionId) return true;
  return !["active", "trialing", "past_due", "unpaid"].includes(sub.status);
}

/**
 * Hur länge den gratis provperioden ska fortsätta i Stripe när man betalar
 * innan den är slut – annars försvinner resten av provperioden. Returnerar
 * Unix-sekunder, eller undefined om det är för nära slutet (Stripes 48 h-gräns).
 */
export function stripeTrialEnd(
  trialEnd: Date | null,
  now: Date = new Date(),
): number | undefined {
  if (!trialEnd) return undefined;
  if (trialEnd.getTime() - now.getTime() < STRIPE_MIN_TRIAL_MS)
    return undefined;
  return Math.floor(trialEnd.getTime() / 1000);
}

/**
 * Apparna delar Stripe-konto, så varje webhook får händelser för alla
 * apparnas prenumerationer. Checkout märker dem med metadata.app – bara
 * händelser för den här appen får röra databasen.
 */
export function tillhorAppen(
  metadata: Record<string, string> | null | undefined,
  appId: string,
) {
  return metadata?.app === appId;
}
