import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CustomerForm from "../customer-form";

export default async function NyKundPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ny kund</h1>
        <p className="text-sm text-muted-foreground">Lägg till en ny kund i kundregistret.</p>
      </div>
      <CustomerForm mode="create" />
    </main>
  );
}
