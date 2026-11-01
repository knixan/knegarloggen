import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL saknas"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET saknas eller för kort (min 32 tecken)"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY saknas"),
  RESEND_FROM: z.string().min(1, "RESEND_FROM saknas"),
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY saknas"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, "STRIPE_WEBHOOK_SECRET saknas"),
  STRIPE_PRICE_ID: z.string().min(1, "STRIPE_PRICE_ID saknas"),
  UPLOADTHING_TOKEN: z.string().min(1, "UPLOADTHING_TOKEN saknas"),
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL saknas"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  const lines = result.error.issues.map(
    (issue) => `  ${String(issue.path[0])}: ${issue.message}`,
  );
  throw new Error(`Ogiltig miljökonfiguration:\n${lines.join("\n")}`);
}

export const env = result.data;
