import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../lib/auth";
import { getJobs } from "../../../lib/jobb-data";
import { Button } from "@knegarloggen/ui/button";
import { Plus } from "lucide-react";
import JobDashboard from "../../../components/minasidor/jobb/job-dashboard";

export default function MinaJobbPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense
        fallback={<div className="animate-pulse h-8 w-48 bg-muted rounded" />}
      >
        <MinaJobbInnehall />
      </Suspense>
    </main>
  );
}

async function MinaJobbInnehall() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const { jobs, nextCursor } = await getJobs();

  return (
    <>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Mina jobb</h1>
        <Link href="/mina-sidor/nytt-jobb">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nytt jobb
          </Button>
        </Link>
      </div>
      <JobDashboard jobs={jobs} nextCursor={nextCursor} />
    </>
  );
}
