import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../../lib/auth";
import { getJob, getCompanySettings } from "../../../../../lib/jobb-data";
import { hasActiveSubscription } from "../../../../../lib/subscription";
import SkrivUtKlient from "../../../../../components/minasidor/faktura/skriv-ut-klient";

export default function SkrivUtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="animate-pulse h-screen bg-muted" />}>
      <SkrivUtInnehall params={params} />
    </Suspense>
  );
}

async function SkrivUtInnehall({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const { id } = await params;
  const [job, company, aktiv] = await Promise.all([
    getJob(id),
    getCompanySettings(),
    hasActiveSubscription(session.user.id),
  ]);

  if (!job) notFound();
  if (!company) notFound();

  // Att visa fakturan kräver bara inloggning – befintliga fakturor ska gå att
  // ta fram även när prenumerationen gått ut (bokföringslagen: spara 7 år).
  // Fakturanummer delas bara ut när fakturan skapas (faktureraJobb).
  return (
    <SkrivUtKlient
      job={job}
      company={company}
      fakturanummer={job.fakturanummer ?? null}
      kanSkapaFaktura={aktiv}
    />
  );
}
