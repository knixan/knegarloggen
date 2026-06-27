import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import InstallningarKlient from "@/components/minasidor/installningar/installningar-klient";
import type Stripe from "stripe";

export const metadata = { title: "Inställningar – Knegarloggen" };

type SubscriptionData = {
  status: string;
  trialEnd: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
};

function getPeriodEnd(s: Stripe.Subscription): Date | null {
  const ts = s.cancel_at ?? s.items.data[0]?.current_period_end ?? null;
  return ts ? new Date(ts * 1000) : null;
}

async function getSubscriptionData(
  userId: string,
): Promise<SubscriptionData | null> {
  const localSub = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      status: true,
      trialEnd: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      stripeSubscriptionId: true,
      stripeCustomerId: true,
    },
  });

  if (!localSub) return null;

  if (!localSub.stripeCustomerId) {
    return localSub;
  }

  try {
    const stripeSubs = await stripe.subscriptions.list({
      customer: localSub.stripeCustomerId,
      limit: 1,
      status: "all",
    });

    const s = stripeSubs.data[0] as Stripe.Subscription | undefined;
    if (!s) return localSub;

    const currentPeriodEnd = getPeriodEnd(s);

    prisma.subscription
      .update({
        where: { userId },
        data: {
          stripeSubscriptionId: s.id,
          status: s.status,
          cancelAtPeriodEnd: s.cancel_at_period_end,
          trialEnd: s.trial_end ? new Date(s.trial_end * 1000) : null,
          ...(currentPeriodEnd && { currentPeriodEnd }),
        },
      })
      .catch(() => {});

    return {
      status: s.status,
      cancelAtPeriodEnd: s.cancel_at_period_end,
      trialEnd: s.trial_end ? new Date(s.trial_end * 1000) : null,
      currentPeriodEnd,
      stripeSubscriptionId: s.id,
    };
  } catch {
    return localSub;
  }
}

export default function InstallningarPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="animate-pulse h-8 w-48 bg-muted rounded" />}>
        <InstallningarInnehall />
      </Suspense>
    </main>
  );
}

async function InstallningarInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const subscription = await getSubscriptionData(session.user.id);

  const hasActiveStripeSub =
    !!subscription?.stripeSubscriptionId &&
    (subscription.status === "active" || subscription.status === "trialing") &&
    !subscription.cancelAtPeriodEnd;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {session.user.email}
        </p>
      </div>
      <InstallningarKlient
        subscription={subscription}
        hasActiveStripeSub={hasActiveStripeSub}
      />
    </>
  );
}
