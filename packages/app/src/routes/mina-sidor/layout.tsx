import { Suspense } from "react";
import { headers } from "next/headers";
import { cacheLife } from "next/cache";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { evaluateSubscription } from "../../lib/subscription";
import TrialGate from "../../components/minasidor/trial-gate";

async function getSubscriptionStatus(userId: string) {
  "use cache";
  cacheLife("seconds");
  return prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, trialEnd: true },
  });
}

export default function MinaSidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Navigeringen för mina sidor ligger i navbaren (components/site/navbar.tsx).
  return (
    <div className="flex min-h-[calc(100vh-4rem)] min-w-0 flex-col">
      <Suspense fallback={<div className="flex-1" />}>
        <MinaSidorGate>{children}</MinaSidorGate>
      </Suspense>
    </div>
  );
}

async function MinaSidorGate({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  let isExpired = false;
  let daysLeft = 30;

  if (session?.user) {
    const subscription = await getSubscriptionStatus(session.user.id);
    ({ isExpired, daysLeft } = evaluateSubscription(subscription));
  }

  return (
    <TrialGate isExpired={isExpired} daysLeft={daysLeft}>
      {children}
    </TrialGate>
  );
}
