import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CustomerForm from "@/components/minasidor/kunder/customer-form";

export default function NyKundPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <Suspense fallback={<div className="animate-pulse h-8 w-48 bg-muted rounded" />}>
        <NyKundInnehall />
      </Suspense>
    </main>
  );
}

async function NyKundInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ny kund</h1>
        <p className="text-sm text-muted-foreground">
          Lägg till en ny kund i kundregistret.
        </p>
      </div>
      <CustomerForm mode="create" />
    </>
  );
}
