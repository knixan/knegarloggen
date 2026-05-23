import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

// Re-export common helpers that UI code may import directly
export const { signIn, signUp, useSession } = authClient;

export default authClient;
