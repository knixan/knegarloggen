import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CustomerForm } from "@/components/minasidor/kunder/customer-form";
import { CustomerDeleteButton } from "@/components/minasidor/kunder/customer-delete-button";

export default async function RedigeraKundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
  if (!company) redirect("/mina-sidor/foretag");

  const customer = await prisma.customer.findFirst({
    where: { id, companyId: company.id },
  });

  if (!customer) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Redigera kund</h1>
          <p className="text-sm text-muted-foreground">
            {customer.kundTyp === "foretag" ? customer.foretagsnamn : customer.namn}
          </p>
        </div>
        <CustomerDeleteButton id={customer.id} />
      </div>
      <div className="max-w-2xl">
        <CustomerForm
          defaultValues={{
            id: customer.id,
            kundTyp: customer.kundTyp,
            namn: customer.namn,
            adress: customer.adress,
            postnummer: customer.postnummer,
            stad: customer.stad,
            telefon: customer.telefon,
            epost: customer.epost,
            personnummer: customer.personnummer,
            foretagsnamn: customer.foretagsnamn,
            kontaktperson: customer.kontaktperson,
            orgNummer: customer.orgNummer,
          }}
        />
      </div>
    </div>
  );
}
