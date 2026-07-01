"use server";
import { auth } from "./auth";
import { headers as getHeaders } from "next/headers";
import { revalidatePath } from "next/cache";
import { addDays } from "date-fns";
import { prisma } from "./prisma";

const readNextHeaders = async (): Promise<Headers> =>
  new Headers(await getHeaders());

export async function signUpServer(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await auth.api.signUpEmail({
      body: { name: data.name, email: data.email, password: data.password },
      headers: await readNextHeaders(),
    });

    const trialEnd = addDays(new Date(), 30);
    await prisma.subscription.upsert({
      where: { userId: response.user.id },
      create: {
        userId: response.user.id,
        status: "trialing",
        trialEnd,
        currentPeriodEnd: trialEnd,
      },
      update: {},
    });

    return { ok: true, data: response };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Registrering misslyckades",
    };
  }
}

export async function signInServer(data: { email: string; password: string }) {
  try {
    const response = await auth.api.signInEmail({
      body: { email: data.email, password: data.password },
      headers: await readNextHeaders(),
    });
    revalidatePath("/", "layout");
    return { ok: true, data: response };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Inloggning misslyckades",
    };
  }
}

export async function signOutServer(providedHeaders?: HeadersInit) {
  const hdrs = providedHeaders
    ? new Headers(providedHeaders)
    : await readNextHeaders();
  try {
    await auth.api.signOut({ headers: hdrs });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Utloggning misslyckades",
    };
  }
}

export async function signOutAction() {
  return signOutServer();
}
