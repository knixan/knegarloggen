import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MinaSidorNav } from "@/components/minasidor/mina-sidor-nav";
import { TrialGate } from "@/components/minasidor/trial-gate";

export default function MinaSidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div className="w-64 min-h-screen border-r bg-sidebar animate-pulse" />}>
        <MinaSidorNav />
      </Suspense>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <Suspense fallback={null}>
          <MinaSidorGate>{children}</MinaSidorGate>
        </Suspense>
      </main>
    </div>
  );
}

async function MinaSidorGate({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { status: true, trialEnd: true },
  });

  return (
    <>
      {subscription && (
        <TrialGate
          status={subscription.status}
          trialEnd={subscription.trialEnd}
        />
      )}
      {children}
    </>
  );
}
