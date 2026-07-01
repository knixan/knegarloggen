import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.mode === "subscription" && s.metadata?.userId && s.customer && s.subscription) {
        const stripeCustomerId =
          typeof s.customer === "string" ? s.customer : s.customer.id;
        const stripeSubscriptionId =
          typeof s.subscription === "string" ? s.subscription : s.subscription.id;

        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodEnd = new Date(((sub as any).current_period_end as number) * 1000);
        await prisma.subscription.upsert({
          where: { userId: s.metadata.userId },
          create: {
            userId: s.metadata.userId,
            status: "active",
            stripeCustomerId,
            stripeSubscriptionId,
            currentPeriodEnd: periodEnd,
          },
          update: {
            status: "active",
            stripeCustomerId,
            stripeSubscriptionId,
            currentPeriodEnd: periodEnd,
          },
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = new Date(((sub as any).current_period_end as number) * 1000);
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status: sub.status,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "canceled" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
