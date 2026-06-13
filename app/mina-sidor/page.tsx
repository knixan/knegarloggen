import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getJobs } from "@/lib/job-actions";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import JobDashboard from "./job-dashboard";

export default async function MinaSidorPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const jobs = await getJobs();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mina jobb</h1>
          <p className="text-muted-foreground text-sm">
            Välkommen, {session.user.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/mina-sidor/foretag">
            <Button variant="outline">
              <Building2 className="h-4 w-4 mr-2" />
              Företagsuppgifter
            </Button>
          </Link>
          <Link href="/mina-sidor/nytt-jobb">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nytt jobb
            </Button>
          </Link>
        </div>
      </div>
      <JobDashboard jobs={jobs} />
    </main>
  );
}
