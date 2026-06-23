import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import InstallningarKlient from "@/components/minasidor/installningar/installningar-klient";

export const metadata = { title: "Inställningar – Knegarloggen" };

// Synka alltid mot Stripe vid sidladdning om kunden har en Stripe-koppling
async function syncFromStripe(userId: string) {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeCustomerId: true },
  });
  if (!sub?.stripeCustomerId) return;

  try {
    const stripeSubs = await stripe.subscriptions.list({
      customer: sub.stripeCustomerId,
      limit: 1,
      status: "all",
    });
    const stripeSub = stripeSubs.data[0];
    if (!stripeSub) return;

    await prisma.subscription.update({
      where: { userId },
      data: {
        stripeSubscriptionId: stripeSub.id,
        status: stripeSub.status,
        trialEnd: stripeSub.trial_end
          ? new Date(stripeSub.trial_end * 1000)
          : null,
        ...(stripeSub.billing_schedules?.[0]?.bill_until.computed_timestamp && {
          currentPeriodEnd: new Date(
            stripeSub.billing_schedules[0].bill_until.computed_timestamp * 1000
          ),
        }),
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    });
  } catch (err) {
    console.error("Stripe-sync misslyckades:", err);
  }
}

export default async function InstallningarPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  await syncFromStripe(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: {
      status: true,
      trialEnd: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  });

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
