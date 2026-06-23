import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import InstallningarKlient from "@/components/minasidor/installningar/installningar-klient";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inställningar – Knegarloggen" };

type SubscriptionData = {
  status: string;
  trialEnd: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
};

async function getSubscriptionData(userId: string): Promise<SubscriptionData | null> {
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

  // Om ingen Stripe-koppling finns, returnera lokalt DB-värde (trial utan kort)
  if (!localSub.stripeCustomerId) {
    return localSub;
  }

  // Hämta live-data direkt från Stripe
  try {
    const stripeSubs = await stripe.subscriptions.list({
      customer: localSub.stripeCustomerId,
      limit: 1,
      status: "all",
    });

    const s = stripeSubs.data[0] as Stripe.Subscription | undefined;
    if (!s) return localSub;

    const periodEndTs =
      s.cancel_at ??
      s.billing_schedules?.[0]?.bill_until.computed_timestamp ??
      null;

    // Spara uppdatering i bakgrunden (fire-and-forget)
    prisma.subscription.update({
      where: { userId },
      data: {
        stripeSubscriptionId: s.id,
        status: s.status,
        cancelAtPeriodEnd: s.cancel_at_period_end,
        trialEnd: s.trial_end ? new Date(s.trial_end * 1000) : null,
        ...(periodEndTs && { currentPeriodEnd: new Date(periodEndTs * 1000) }),
      },
    }).catch(() => {});

    return {
      status: s.status,
      cancelAtPeriodEnd: s.cancel_at_period_end,
      trialEnd: s.trial_end ? new Date(s.trial_end * 1000) : null,
      currentPeriodEnd: periodEndTs ? new Date(periodEndTs * 1000) : localSub.currentPeriodEnd,
      stripeSubscriptionId: s.id,
    };
  } catch {
    // Stripe inte tillgänglig — fall tillbaka på DB
    return localSub;
  }
}

export default async function InstallningarPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const subscription = await getSubscriptionData(session.user.id);

  const hasActiveStripeSub =
    !!subscription?.stripeSubscriptionId &&
    (subscription.status === "active" || subscription.status === "trialing") &&
    !subscription.cancelAtPeriodEnd;

  return (
    <main className="container mx-auto px-4 py-8">
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
    </main>
  );
}
