import { differenceInDays } from "date-fns";
import { prisma } from "./prisma";

type SubscriptionRow = { status: string; trialEnd: Date | null } | null;

/**
 * Gemensam regel för om ett konto får använda appen.
 * Används både av layouten (TrialGate) och av server actions.
 */
export function evaluateSubscription(subscription: SubscriptionRow) {
  if (!subscription) return { isExpired: true, daysLeft: 0 };

  const now = new Date();
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

export async function hasActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, trialEnd: true },
  });
  return !evaluateSubscription(subscription).isExpired;
}
