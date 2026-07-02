import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InstallningarKlient } from "@/components/minasidor/installningar/installningar-klient";

export default function InstallningarPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-8 w-48 bg-muted rounded" />}>
      <InstallningarInnehall />
    </Suspense>
  );
}

async function InstallningarInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const [company, subscription] = await Promise.all([
    prisma.company.findUnique({
      where: { userId: session.user.id },
      select: { logoUrl: true, logoKey: true },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inställningar</h1>
        <p className="text-sm text-muted-foreground">
          Hantera ditt konto och din prenumeration.
        </p>
      </div>
      <div className="max-w-2xl">
        <InstallningarKlient
          user={{ name: session.user.name, email: session.user.email }}
          company={company}
          subscription={subscription}
        />
      </div>
    </div>
  );
}
