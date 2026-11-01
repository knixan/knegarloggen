import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { brand } from "../../../../brand";
import { auth } from "../../../../lib/auth";
import { stripe } from "../../../../lib/stripe";
import { prisma } from "../../../../lib/prisma";
import { env } from "../../../../lib/env";
import {
  kanStartaCheckout,
  stripeTrialEnd,
} from "../../../../lib/prenumeration-regel";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
    }

    const user = session.user;
    const appUrl = env.NEXT_PUBLIC_APP_URL;

    const existing = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        status: true,
        trialEnd: true,
      },
    });

    // En prenumeration som redan löper ska ändras i kundportalen – en ny
    // checkout skulle ge dubbla prenumerationer och dubbel debitering.
    if (!kanStartaCheckout(existing)) {
      return NextResponse.json(
        {
          error:
            "Du har redan en prenumeration. Hantera den via Hantera prenumeration.",
        },
        { status: 409 },
      );
    }

    // Märker allt med appen – apparna delar Stripe-konto (se webhooken).
    const metadata = { userId: user.id, app: brand.id };

    let stripeCustomerId: string;

    if (existing?.stripeCustomerId) {
      stripeCustomerId = existing.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create(
        {
          email: user.email,
          name: user.name,
          metadata,
        },
        { idempotencyKey: `stripe-customer-${brand.id}-${user.id}` },
      );
      stripeCustomerId = customer.id;

      // Spara direkt så vi kan synka vid success-redirect (utan att vänta på webhook)
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          stripeCustomerId,
          status: "trialing",
        },
        update: { stripeCustomerId },
      });
    }

    // Betalar man under provperioden ska resten av den följa med – första
    // dragningen sker när provperioden tar slut.
    const trialEnd =
      existing?.status === "trialing"
        ? stripeTrialEnd(existing.trialEnd)
        : undefined;

    const checkoutSession = await stripe.checkout.sessions.create(
      {
        customer: stripeCustomerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: env.STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata,
          ...(trialEnd ? { trial_end: trialEnd } : {}),
        },
        metadata,
        success_url: `${appUrl}/mina-sidor/installningar?checkout=success`,
        cancel_url: `${appUrl}/mina-sidor/installningar`,
        locale: "sv",
      },
      {
        idempotencyKey: `checkout-${brand.id}-${user.id}-${Math.floor(Date.now() / 60000)}`,
      },
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    // Detaljerna loggas – kunden får ett allmänt fel.
    console.error("Checkout-fel:", err);
    return NextResponse.json(
      { error: "Kunde inte starta betalningen. Försök igen om en stund." },
      { status: 500 },
    );
  }
}
