import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

// Re-export common helpers that UI code may import directly
export const { signIn, signUp, useSession } = authClient;

export default authClient;
