import Stripe from "stripe";

//TODO! Byt STRIPE_SECRET_KEY i .env till den riktiga live-nyckeln (sk_live_...) från Stripe Dashboard
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
