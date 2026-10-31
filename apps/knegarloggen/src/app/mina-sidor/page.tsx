import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { getOversikt, halsning } from "@/lib/oversikt-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OversiktVy from "@/components/minasidor/startsida/oversikt-vy";
import OversiktSkelett from "@/components/minasidor/startsida/oversikt-skelett";

export default function OversiktPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<OversiktSkelett />}>
        <OversiktInnehall />
      </Suspense>
    </main>
  );
}

async function OversiktInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const data = await getOversikt(session.user.id);

  // Företaget skapas när första jobbet, kunden eller företagsuppgifterna
  // sparas – innan dess finns inget att visa.
  if (!data) {
    return (
      <Card>
        <CardContent className="space-y-4 py-10 text-center">
          <h1 className="text-2xl font-bold">
            Välkommen, {session.user.name}!
          </h1>
          <p className="text-muted-foreground">
            Börja med att skapa ditt första jobb. Här får du sedan en översikt
            över pågående jobb, timmar och vad som ska faktureras.
          </p>
          <Link href="/mina-sidor/nytt-jobb" className="inline-block">
            <Button>
              <Plus className="mr-1 h-4 w-4" />
              Skapa ditt första jobb
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const datum = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Europe/Stockholm",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return <OversiktVy data={data} halsning={halsning()} datum={datum} />;
}
