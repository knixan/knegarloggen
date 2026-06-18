import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCustomers } from "@/lib/job-actions";
import NyttJobbClient from "./nytt-jobb-client";

export default async function NyttJobbPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const customers = await getCustomers();

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Nytt jobb</h1>
      <NyttJobbClient customers={customers} />
    </main>
  );
}
