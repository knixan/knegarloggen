import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import InstallningarKlient from "@/components/minasidor/installningar/installningar-klient";

export const metadata = { title: "Inställningar – Knegarloggen" };

export default async function InstallningarPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const params = await searchParams;

  const shouldSync =
    params.checkout === "success" || params.portal === "return";

  // Synka mot Stripe direkt vid success/portal-redirect (fallback om webhook ej är konfigurerad)
  if (shouldSync) {
    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (sub?.stripeCustomerId) {
      try {
        const stripeSubs = await stripe.subscriptions.list({
          customer: sub.stripeCustomerId,
          limit: 1,
          status: "all",
        });
        const stripeSub = stripeSubs.data[0];
        if (stripeSub) {
          await prisma.subscription.update({
            where: { userId: session.user.id },
            data: {
              stripeSubscriptionId: stripeSub.id,
              status: stripeSub.status,
              trialEnd: stripeSub.trial_end
                ? new Date(stripeSub.trial_end * 1000)
                : null,
              ...(stripeSub.current_period_end && {
                currentPeriodEnd: new Date(
                  stripeSub.current_period_end * 1000
                ),
              }),
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            },
          });
        }
      } catch (err) {
        console.error("Stripe-sync misslyckades:", err);
      }
    }
  }

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
    (subscription.status === "active" || subscription.status === "trialing");

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
