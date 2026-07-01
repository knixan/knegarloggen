import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompanySettingsForm } from "@/components/minasidor/foretag/company-settings-form";

export default async function ForetagPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Företagsinformation</h1>
        <p className="text-sm text-muted-foreground">
          Dessa uppgifter används på dina fakturor.
        </p>
      </div>
      <div className="max-w-2xl">
        <CompanySettingsForm defaultValues={company ?? undefined} />
      </div>
    </div>
  );
}
