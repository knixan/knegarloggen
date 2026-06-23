import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type Stripe from "stripe";

function getPeriodEnd(sub: Stripe.Subscription): Date | null {
  const ts = sub.cancel_at ?? sub.items.data[0]?.current_period_end ?? null;
  return ts ? new Date(ts * 1000) : null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Saknar signatur" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Ogiltig signatur" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (!userId) break;

        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId,
            stripeSubscriptionId,
            status: sub.status,
            trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            currentPeriodEnd: getPeriodEnd(sub),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            stripeCustomerId,
            stripeSubscriptionId,
            status: sub.status,
            trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            currentPeriodEnd: getPeriodEnd(sub),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            status: sub.status,
            trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            currentPeriodEnd: getPeriodEnd(sub),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            status: sub.status,
            trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            currentPeriodEnd: getPeriodEnd(sub),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "canceled", cancelAtPeriodEnd: false },
        });
        break;
      }
    }
  } catch (err) {
    console.error("Webhook-fel:", err);
    return NextResponse.json({ error: "Internt fel" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
