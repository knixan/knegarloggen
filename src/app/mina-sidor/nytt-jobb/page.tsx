import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCustomers } from "@/lib/job-actions";
import NyttJobbClient from "@/components/minasidor/jobb/nytt-jobb-client";

export default function NyttJobbPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <Suspense fallback={<div className="animate-pulse h-8 w-48 bg-muted rounded" />}>
        <NyttJobbInnehall />
      </Suspense>
    </main>
  );
}

async function NyttJobbInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const customers = await getCustomers();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Nytt jobb</h1>
      <NyttJobbClient customers={customers} />
    </>
  );
}
