import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UppdragForm } from "@/components/minasidor/uppdrag/uppdrag-form";
import { UppdragDetaljer } from "@/components/minasidor/uppdrag/uppdrag-detaljer";

export default async function RedigeraUppdragPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!company) redirect("/mina-sidor/foretag");

  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id, companyId: company.id },
    include: {
      customer: {
        select: { id: true, namn: true, foretagsnamn: true, kundTyp: true, epost: true, telefon: true },
      },
      arbetspass: { orderBy: { datum: "desc" } },
      resor: { orderBy: { datum: "desc" } },
      ovrigaKostnader: true,
    },
  });

  if (!uppdrag) notFound();

  const customers = await prisma.customer.findMany({
    where: { companyId: company.id },
    select: { id: true, namn: true, foretagsnamn: true, kundTyp: true },
    orderBy: { namn: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{uppdrag.titel}</h1>
        <p className="text-sm text-muted-foreground">
          Status: {uppdrag.status} · Skapad {uppdrag.createdAt.toLocaleDateString("sv-SE")}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold mb-4">Redigera uppdrag</h2>
          <UppdragForm
            uppdragId={uppdrag.id}
            customers={customers}
            defaultValues={{
              titel: uppdrag.titel,
              beskrivning: uppdrag.beskrivning,
              uppdragsTyp: uppdrag.uppdragsTyp as "konsulting",
              customerId: uppdrag.customerId,
              prisTyp: uppdrag.prisTyp as "timme",
              timpris: uppdrag.timpris,
              fastPris: uppdrag.fastPris,
              milersattning: uppdrag.milersattning,
              anteckningar: uppdrag.anteckningar,
              utfortArbete: uppdrag.utfortArbete,
              planeratArbete: uppdrag.planeratArbete,
            }}
          />
        </div>
        <div>
          <UppdragDetaljer uppdrag={uppdrag} />
        </div>
      </div>
    </div>
  );
}
