import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getJob } from "@/lib/job-actions";
import EditJobClient from "./edit-job-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RedigeraJobbPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Redigera jobb</h1>
      <EditJobClient job={job} />
    </main>
  );
}
