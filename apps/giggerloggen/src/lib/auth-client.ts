import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
if (!appUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL saknas i miljövariablerna.");
}

export const authClient = createAuthClient({
  baseURL: appUrl,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession } = authClient;

export default authClient;
