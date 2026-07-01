import { Suspense } from "react";
import { headers } from "next/headers";
import { differenceInDays } from "date-fns";
import { cacheLife } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MinaSidorSidebar,
  MinaSidorMobileNav,
} from "../../components/minasidor/mina-sidor-nav";
import TrialGate from "@/components/minasidor/trial-gate";

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
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <MinaSidorSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MinaSidorMobileNav />
        <Suspense fallback={<div className="flex-1" />}>
          <MinaSidorGate>{children}</MinaSidorGate>
        </Suspense>
      </div>
    </div>
  );
}

async function MinaSidorGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  let isExpired = false;
  let daysLeft = 30;

  if (session?.user) {
    const subscription = await getSubscriptionStatus(session.user.id);

    if (subscription) {
      const now = new Date();
      const isActiveSubscription =
        subscription.status === "active" ||
        (subscription.status === "trialing" &&
          subscription.trialEnd &&
          subscription.trialEnd > now);

      if (!isActiveSubscription) {
        isExpired = true;
      } else if (subscription.status === "trialing" && subscription.trialEnd) {
        daysLeft = Math.max(0, differenceInDays(subscription.trialEnd, now));
      }
    } else {
      isExpired = true;
    }
  }

  return (
    <TrialGate isExpired={isExpired} daysLeft={daysLeft}>
      {children}
    </TrialGate>
  );
}
