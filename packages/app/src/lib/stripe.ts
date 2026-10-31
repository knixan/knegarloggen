import { createStripeClient } from "@knegarloggen/stripe";
import { env } from "./env";

export const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
