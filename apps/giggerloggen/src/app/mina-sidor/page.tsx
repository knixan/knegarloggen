import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UppdragDashboard } from "@/components/minasidor/uppdrag/uppdrag-dashboard";

export default async function MinaSidorPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!company) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Välkommen till Giggerloggen!</h1>
        <p className="text-muted-foreground">
          Börja med att fylla i dina{" "}
          <a href="/mina-sidor/foretag" className="text-primary hover:underline">
            företagsuppgifter
          </a>{" "}
          för att komma igång.
        </p>
      </div>
    );
  }

  const uppdrag = await prisma.uppdrag.findMany({
    where: { companyId: company.id },
    orderBy: { updatedAt: "desc" },
    include: {
      customer: {
        select: { id: true, namn: true, foretagsnamn: true, kundTyp: true, epost: true, telefon: true },
      },
      arbetspass: { select: { id: true, datum: true, timmar: true, beskrivning: true } },
      resor: { select: { id: true, datum: true, stracka: true, beskrivning: true } },
      ovrigaKostnader: { select: { id: true, beskrivning: true, pris: true } },
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mina uppdrag</h1>
        <p className="text-muted-foreground text-sm">
          Hej {session.user.name}! Här är en översikt av dina uppdrag.
        </p>
      </div>
      <UppdragDashboard uppdrag={uppdrag} />
    </div>
  );
}
