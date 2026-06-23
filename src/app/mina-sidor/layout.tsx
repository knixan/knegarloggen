import { headers } from "next/headers";
import { addDays, differenceInDays } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  MinaSidorSidebar,
  MinaSidorMobileNav,
} from "../../components/minasidor/mina-sidor-nav";
import TrialGate from "@/components/minasidor/trial-gate";

export default async function MinaSidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  let isExpired = false;
  let daysLeft = 30;

  if (session?.user) {
    let subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { status: true, trialEnd: true },
    });

    if (!subscription) {
      const trialEnd = addDays(new Date(), 30);
      subscription = await prisma.subscription.create({
        data: {
          userId: session.user.id,
          status: "trialing",
          trialEnd,
          currentPeriodEnd: trialEnd,
        },
      });
    }

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
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <MinaSidorSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MinaSidorMobileNav />
        <TrialGate isExpired={isExpired} daysLeft={daysLeft}>
          {children}
        </TrialGate>
      </div>
    </div>
  );
}
