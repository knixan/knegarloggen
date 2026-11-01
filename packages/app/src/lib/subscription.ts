import { prisma } from "./prisma";
import { evaluateSubscription, nyProvperiod } from "./prenumeration-regel";

export { evaluateSubscription } from "./prenumeration-regel";

export async function hasActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, trialEnd: true },
  });
  return !evaluateSubscription(subscription).isExpired;
}

/**
 * Skapar provperioden för ett nytt konto. Anropas av better-auth
 * (databaseHooks.user.create.after) – oavsett hur kontot skapades.
 * upsert + update: {} gör att en befintlig prenumeration aldrig skrivs över.
 */
export async function skapaProvperiod(userId: string) {
  await prisma.subscription.upsert({
    where: { userId },
    create: { userId, ...nyProvperiod() },
    update: {},
  });
}
