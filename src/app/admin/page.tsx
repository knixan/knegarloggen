import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAdminUsers } from "@/lib/admin-actions";
import AdminKlient from "./admin-klient";

export const metadata = { title: "Admin – Knegarloggen" };

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="animate-pulse h-8 w-32 bg-muted rounded" />}>
        <AdminInnehall />
      </Suspense>
    </main>
  );
}

async function AdminInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "admin") redirect("/");

  const users = await getAdminUsers();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hantera användare och roller
        </p>
      </div>
      <AdminKlient initialUsers={users} currentUserId={session.user.id} />
    </>
  );
}
