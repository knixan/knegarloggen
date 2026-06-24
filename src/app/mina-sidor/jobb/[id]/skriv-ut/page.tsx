import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getJob,
  getCompanySettings,
  reserverFakturanummer,
} from "@/lib/job-actions";
import { beräknaSummering } from "@/lib/job-schema";
import SkrivUtKlient from "@/components/minasidor/faktura/skriv-ut-klient";

export default async function SkrivUtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const { id } = await params;
  const [job, company] = await Promise.all([getJob(id), getCompanySettings()]);

  if (!job) notFound();
  if (!company) notFound();

  const fakturaResult = await reserverFakturanummer(id);
  if (!fakturaResult.ok) notFound();
  const fakturanummer = fakturaResult.nummer;
  const summary = beräknaSummering(job);

  return (
    <SkrivUtKlient
      job={job}
      company={company}
      summary={summary}
      fakturanummer={fakturanummer}
    />
  );
}
