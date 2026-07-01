import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getJob, getCustomers } from "@/lib/job-actions";
import EditJobClient from "@/components/minasidor/jobb/edit-job-client";

export default function RedigeraJobbPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <Suspense fallback={<div className="animate-pulse h-8 w-48 bg-muted rounded" />}>
        <RedigeraJobbInnehall params={params} />
      </Suspense>
    </main>
  );
}

async function RedigeraJobbInnehall({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const { id } = await params;
  const [job, customers] = await Promise.all([getJob(id), getCustomers()]);

  if (!job) notFound();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Redigera jobb</h1>
      <EditJobClient job={job} customers={customers} />
    </>
  );
}
