"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Ej inloggad");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "admin") throw new Error("Ej behörig");
  return user;
}

export async function getAdminUsers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      companies: {
        include: { _count: { select: { jobs: true } } },
      },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    jobCount: u.companies[0]?._count.jobs ?? 0,
    companyName: u.companies[0]?.name ?? null,
  }));
}

export type AdminUser = Awaited<ReturnType<typeof getAdminUsers>>[number];

export async function setUserRole(
  userId: string,
  role: "admin" | "user",
): Promise<{ ok: boolean; error?: string }> {
  const me = await requireAdmin();

  if (userId === me.id) {
    return { ok: false, error: "Du kan inte ändra din egen roll" };
  }

  if (role === "user") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return { ok: false, error: "Det måste finnas minst en admin" };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  return { ok: true };
}

export async function adminDeleteUser(
  userId: string,
): Promise<{ ok: boolean; error?: string }> {
  const me = await requireAdmin();

  if (userId === me.id) {
    return { ok: false, error: "Du kan inte radera ditt eget konto" };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (target?.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return { ok: false, error: "Det måste finnas minst en admin" };
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  return { ok: true };
}
