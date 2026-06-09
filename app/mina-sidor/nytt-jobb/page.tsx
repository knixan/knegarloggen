"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import JobForm from "@/components/site/job-form";
import { createJob } from "@/lib/job-actions";
import type { JobInput } from "@/lib/job-schema";

export default function NyttJobbPage() {
  const router = useRouter();

  async function handleSubmit(data: JobInput) {
    const result = await createJob(data);
    if (result.ok) {
      toast.success("Jobb sparat!");
      router.push("/mina-sidor");
    } else {
      toast.error(result.error ?? "Kunde inte spara jobb");
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Nytt jobb</h1>
      <JobForm onSubmit={handleSubmit} submitLabel="Spara jobb" />
    </main>
  );
}
