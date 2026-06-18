import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCompanySettings } from "@/lib/job-actions";
import CompanySettingsForm from "@/components/minasidor/foretag/company-settings-form";

export default async function ForetagsuppgifterPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await getCompanySettings();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Företagsuppgifter</h1>
        <p className="text-sm text-muted-foreground">
          Dessa uppgifter används för att skapa professionella fakturor och
          PDF-underlag.
        </p>
      </div>

      {company && <CompanySettingsForm company={company} />}
    </main>
  );
}
