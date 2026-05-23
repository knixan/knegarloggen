"use server";
// Server-side helper for signing out users using BetterAuth
import { auth } from "./auth";
import { headers as getHeaders } from "next/headers";
import { revalidatePath } from "next/cache";

const readNextHeaders = async (): Promise<Headers> =>
  new Headers(await getHeaders());

/**
 * Sign up a new user server-side.
 */
export async function signUpServer(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Use the auth handler directly
    const response = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      headers: await readNextHeaders(),
    });

    return { ok: true, data: response };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
}

/**
 * Sign in a user server-side.
 */
export async function signInServer(data: { email: string; password: string }) {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await readNextHeaders(),
    });

    // Revalidate all paths to ensure fresh data
    revalidatePath("/", "layout");

    return { ok: true, data: response };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
  }
}

/**
 * Sign out the current user server-side.
 * If `providedHeaders` is not given, this will read headers from `next/headers()`.
 */
export async function signOutServer(providedHeaders?: HeadersInit) {
  const hdrs = providedHeaders
    ? new Headers(providedHeaders)
    : await readNextHeaders();

  try {
    await auth.api.signOut({ headers: hdrs });

    // Revalidate all paths to ensure fresh data
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to sign out",
    };
  }
}

// Server Action: exportable function callable from client components.
export async function signOutAction() {
  return signOutServer();
}
