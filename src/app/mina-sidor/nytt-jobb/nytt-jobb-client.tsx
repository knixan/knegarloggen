"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import JobForm from "@/components/minasidor/job-form";
import { createJob } from "@/lib/job-actions";
import type { JobInput, Customer } from "@/lib/job-schema";

interface Props {
  customers: Customer[];
}

export default function NyttJobbClient({ customers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(
    data: JobInput,
    bilder: { url: string; key: string }[],
  ) {
    startTransition(async () => {
      const result = await createJob(data, bilder);
      if (result.ok) {
        toast.success("Jobb sparat!");
        router.push("/mina-sidor");
      } else {
        toast.error(result.error ?? "Kunde inte spara jobb");
      }
    });
  }

  return (
    <JobForm
      onSubmit={handleSubmit}
      submitLabel="Spara jobb"
      isPending={isPending}
      customers={customers}
    />
  );
}
