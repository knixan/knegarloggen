import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { prisma } from "../../../../lib/prisma";
import { env } from "../../../../lib/env";
import type Stripe from "stripe";
import { brand } from "../../../../brand";
import { tillhorAppen } from "../../../../lib/prenumeration-regel";

/** Användaren måste finnas i den här appens databas – annars kraschar upsert. */
async function anvandareFinns(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  return Boolean(user);
}

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
        // Apparna delar Stripe-konto – hoppa över andra appars händelser.
        if (!tillhorAppen(session.metadata, brand.id)) break;

        const userId = session.metadata?.userId;
        const stripeCustomerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        if (!userId || !(await anvandareFinns(userId))) break;

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
        if (!tillhorAppen(sub.metadata, brand.id)) break;
        const userId = sub.metadata?.userId;
        if (!userId || !(await anvandareFinns(userId))) break;

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
        if (!tillhorAppen(sub.metadata, brand.id)) break;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "canceled", cancelAtPeriodEnd: false },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const sub = invoice.parent?.subscription_details?.subscription;
        const subId = typeof sub === "string" ? sub : (sub?.id ?? null);
        if (!subId) break;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: { status: "past_due" },
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
