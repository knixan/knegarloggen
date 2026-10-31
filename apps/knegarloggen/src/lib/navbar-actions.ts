"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

/** Företagets namn och logga för inloggad användare, till navbaren. */
export async function getNavbarCompany(): Promise<{
  name: string;
  logoUrl: string;
} | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  return prisma.company.findFirst({
    where: { ownerId: session.user.id },
    select: { name: true, logoUrl: true },
  });
}
