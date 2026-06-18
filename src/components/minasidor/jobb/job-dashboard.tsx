"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search } from "lucide-react";
import JobList from "@/components/minasidor/jobb/job-list";
import { deleteJob } from "@/lib/job-actions";
import type { Job } from "@/lib/job-schema";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Filter =
  | "alla"
  | "ej-påbörjat"
  | "pågående"
  | "utfört"
  | "fakturerat"
  | "betalt";

const filters: {
  value: Filter;
  label: string;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    value: "alla",
    label: "Alla",
    activeClass: "bg-gray-800 text-white border-gray-800 hover:bg-gray-700",
    inactiveClass:
      "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300",
  },
  {
    value: "ej-påbörjat",
    label: "Ej påbörjat",
    activeClass: "bg-gray-500 text-white border-gray-500 hover:bg-gray-400",
    inactiveClass:
      "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400",
  },
  {
    value: "pågående",
    label: "Pågående",
    activeClass: "bg-blue-600 text-white border-blue-600 hover:bg-blue-500",
    inactiveClass:
      "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400",
  },
  {
    value: "utfört",
    label: "Utfört",
    activeClass: "bg-red-600 text-white border-red-600 hover:bg-red-500",
    inactiveClass:
      "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400",
  },
  {
    value: "fakturerat",
    label: "Fakturerat",
    activeClass:
      "bg-orange-500 text-white border-orange-500 hover:bg-orange-400",
    inactiveClass:
      "border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400",
  },
  {
    value: "betalt",
    label: "Betalt",
    activeClass: "bg-green-600 text-white border-green-600 hover:bg-green-500",
    inactiveClass:
      "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400",
  },
];

function applyFilter(jobs: Job[], filter: Filter): Job[] {
  switch (filter) {
    case "ej-påbörjat":
      return jobs.filter((j) => !j.pagaende && !j.utfort);
    case "pågående":
      return jobs.filter((j) => j.pagaende && !j.utfort);
    case "utfört":
      return jobs.filter((j) => j.utfort);
    case "fakturerat":
      return jobs.filter((j) => j.fakturerat);
    case "betalt":
      return jobs.filter((j) => j.betalt);
    default:
      return jobs;
  }
}

interface Props {
  jobs: Job[];
}

export default function JobDashboard({ jobs }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<Filter>("alla");
  const [sok, setSok] = useState("");
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  async function confirmDelete() {
    if (!jobToDelete) return;
    const result = await deleteJob(jobToDelete.id);
    if (result.ok) {
      toast.success("Jobb borttaget");
      router.refresh();
    } else {
      toast.error(result.error ?? "Kunde inte ta bort jobb");
    }
    setJobToDelete(null);
  }

  function handleEdit(job: Job) {
    router.push(`/mina-sidor/jobb/${job.id}/redigera`);
  }

  const afterStatus = applyFilter(jobs, active);
  const filtered = sok.trim()
    ? afterStatus.filter((j) => {
        const q = sok.toLowerCase();
        return (
          j.customer?.namn?.toLowerCase().includes(q) ||
          j.customer?.foretagsnamn?.toLowerCase().includes(q) ||
          j.customer?.adress?.toLowerCase().includes(q) ||
          j.customer?.ort?.toLowerCase().includes(q) ||
          j.utfortArbete?.toLowerCase().includes(q) ||
          j.planeratArbete?.toLowerCase().includes(q) ||
          j.anteckningar?.toLowerCase().includes(q)
        );
      })
    : afterStatus;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Sök kund, adress, utfört arbete..."
          value={sok}
          onChange={(e) => setSok(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.value === "alla"
              ? jobs.length
              : applyFilter(jobs, f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                active === f.value ? f.activeClass : f.inactiveClass
              }`}
            >
              {f.label}
              <span className="text-xs opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {jobs.length === 0 ? (
              <>
                Du har inga jobb ännu.{" "}
                <a
                  href="/mina-sidor/nytt-jobb"
                  className="underline hover:text-foreground"
                >
                  Skapa ditt första jobb
                </a>
                .
              </>
            ) : (
              `Inga jobb matchar${sok ? ` sökningen "${sok}"` : ""} med vald status.`
            )}
          </CardContent>
        </Card>
      ) : (
        <JobList
          jobs={filtered}
          onEdit={handleEdit}
          onDelete={(id) => {
            const job = jobs.find((j) => j.id === id);
            if (job) setJobToDelete(job);
          }}
        />
      )}

      <AlertDialog
        open={!!jobToDelete}
        onOpenChange={(open) => !open && setJobToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ta bort jobb?</AlertDialogTitle>
            <AlertDialogDescription>
              Du håller på att ta bort jobbet för{" "}
              <span className="font-medium text-foreground">
                {jobToDelete?.customer?.foretagsnamn?.trim() ||
                  jobToDelete?.customer?.namn?.trim() ||
                  "detta jobb"}
              </span>
              . Detta raderar all information, inklusive artiklar, resor,
              arbetstid och uppladdade bilder. Åtgärden kan inte ångras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Ta bort
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
