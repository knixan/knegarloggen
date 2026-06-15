import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getJob, getCompanySettings } from "@/lib/job-actions";
import { beräknaSummering } from "@/lib/job-schema";
import SkrivUtKlient from "./skriv-ut-klient";

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

  const summary = beräknaSummering(job);

  return <SkrivUtKlient job={job} company={company} summary={summary} />;
}
