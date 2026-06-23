import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
    }

    const user = session.user;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const existing = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { stripeCustomerId: true },
    });

    let stripeCustomerId: string;

    if (existing?.stripeCustomerId) {
      stripeCustomerId = existing.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
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

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          //TODO! Byt STRIPE_PRICE_ID i .env till det riktiga pris-ID:t från din live-produkt i Stripe Dashboard
      price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { userId: user.id },
      },
      metadata: { userId: user.id },
      success_url: `${appUrl}/mina-sidor/installningar?checkout=success`,
      cancel_url: `${appUrl}/mina-sidor/installningar`,
      locale: "sv",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout-fel:", err);
    const message = err instanceof Error ? err.message : "Okänt fel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
