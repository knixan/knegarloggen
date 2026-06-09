"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import JobForm from "@/components/site/job-form";
import { updateJob } from "@/lib/job-actions";
import type { Job, JobInput } from "@/lib/job-schema";

interface Props {
  job: Job;
}

export default function EditJobClient({ job }: Props) {
  const router = useRouter();

  async function handleSubmit(data: JobInput) {
    const result = await updateJob(job.id, data);
    if (result.ok) {
      toast.success("Jobb uppdaterat!");
      router.push("/mina-sidor");
    } else {
      toast.error(result.error ?? "Kunde inte uppdatera jobb");
    }
  }

  const defaultValues: Partial<JobInput> = {
    namn: job.namn,
    adress: job.adress,
    telefon: job.telefon,
    epost: job.epost,
    rotAvdrag: job.rotAvdrag,
    utfort: job.utfort,
    fakturerat: job.fakturerat,
    betalt: job.betalt,
    anteckningar: job.anteckningar,
    artiklar: job.artiklar,
    resor: job.resor,
    arbetstider: job.arbetstider,
  };

  return (
    <JobForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      submitLabel="Uppdatera jobb"
    />
  );
}
