import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCustomer } from "@/lib/job-actions";
import CustomerForm from "@/components/minasidor/kunder/customer-form";

export default async function RedigeraKundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Redigera kund</h1>
        <p className="text-sm text-muted-foreground">
          {customer.typ === "foretag" && customer.foretagsnamn
            ? customer.foretagsnamn
            : customer.namn}
        </p>
      </div>
      <CustomerForm mode="edit" defaultValues={{ ...customer, id }} />
    </main>
  );
}
