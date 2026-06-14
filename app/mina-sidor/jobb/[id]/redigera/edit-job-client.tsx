"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import JobForm from "@/components/site/job-form";
import { updateJob } from "@/lib/job-actions";
import type { Job, JobInput, Customer } from "@/lib/job-schema";

interface Props {
  job: Job;
  customers: Customer[];
}

export default function EditJobClient({ job, customers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(
    data: JobInput,
    bilder: { url: string; key: string }[],
  ) {
    startTransition(async () => {
      const result = await updateJob(job.id, data, bilder);
      if (result.ok) {
        toast.success("Jobb uppdaterat!");
        router.push("/mina-sidor");
      } else {
        toast.error(result.error ?? "Kunde inte uppdatera jobb");
      }
    });
  }

  const defaultValues: Partial<JobInput> = {
    customerId: job.customerId,
    rotAvdrag: job.rotAvdrag,
    pagaende: job.pagaende,
    utfort: job.utfort,
    fakturerat: job.fakturerat,
    betalt: job.betalt,
    anteckningar: job.anteckningar,
    ovrigaArtiklar: job.ovrigaArtiklar,
    utfortArbete: job.utfortArbete,
    planeratArbete: job.planeratArbete,
    artiklar: job.artiklar,
    resor: job.resor,
    arbetstider: job.arbetstider,
    bilder: job.bilder ?? [],
  };

  return (
    <JobForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      submitLabel="Uppdatera jobb"
      isPending={isPending}
      customers={customers}
    />
  );
}
