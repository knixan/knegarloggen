import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UppdragForm } from "@/components/minasidor/uppdrag/uppdrag-form";

export default async function NyttUppdragPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!company) redirect("/mina-sidor/foretag");

  const customers = await prisma.customer.findMany({
    where: { companyId: company.id },
    select: { id: true, namn: true, foretagsnamn: true, kundTyp: true },
    orderBy: { namn: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nytt uppdrag</h1>
        <p className="text-sm text-muted-foreground">Fyll i uppgifterna för ditt nya uppdrag.</p>
      </div>
      <div className="max-w-2xl">
        <UppdragForm customers={customers} />
      </div>
    </div>
  );
}
