import Stripe from "stripe";

export function createStripeClient(secretKey: string) {
  return new Stripe(secretKey, {
    apiVersion: "2026-06-24.dahlia",
  });
}
