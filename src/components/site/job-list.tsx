// jobb-listan som visar alla jobb i en överskådlig lista, med möjlighet att se detaljer, redigera eller ta bort varje jobb
"use client";

import { useState } from "react";
import { ClipboardList, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { beräknaSummering, type Job } from "@/lib/job-schema";
import JobOverviewDialog from "./job-overview-dialog";
import { StatusBadge } from "./job-overview-badges";

interface Props {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobList({ jobs, onEdit, onDelete }: Props) {
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [valdBild, setValdBild] = useState<string | null>(null);

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Inga jobb ännu. Lägg till ditt första jobb ovan.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {jobs.map((job) => {
        const summary = beräknaSummering(job);
        const customerDisplayName =
          job.customer?.foretagsnamn?.trim() || job.customer?.namn?.trim();
        const customerAddress = [
          job.customer?.adress,
          job.customer?.postnummer,
          job.customer?.ort,
        ]
          .filter(Boolean)
          .join(", ");

        return (
          <Card
            key={job.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => setViewingJob(job)}
          >
            <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="truncate text-lg font-bold">
                  {customerDisplayName || "Jobb utan kundnamn"}
                </div>
                {customerDisplayName && (
                  <div className="truncate text-sm font-medium text-foreground/80">
                    {customerDisplayName}
                  </div>
                )}
                <div className="truncate text-sm text-muted-foreground">
                  {customerAddress || "Ingen adress angiven"}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <StatusBadge job={job} />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="space-y-0.5 text-left text-xs text-muted-foreground sm:text-right">
                  <div>
                    <span className="tabular-nums font-medium text-foreground">
                      {summary.totalTimmar}
                    </span>{" "}
                    h arbete
                  </div>

                  <div>
                    <span className="tabular-nums font-medium text-foreground">
                      {summary.totalStracka}
                    </span>{" "}
                    km resa
                  </div>

                  <div className="tabular-nums font-medium text-foreground">
                    {summary.artiklarSum.toLocaleString("sv-SE", {
                      style: "currency",
                      currency: "SEK",
                      maximumFractionDigits: 0,
                    })}{" "}
                    material
                  </div>
                  {job.bilder?.length ? (
                    <div>
                      <span className="tabular-nums font-medium text-foreground">
                        {job.bilder.length}
                      </span>{" "}
                      {job.bilder.length === 1 ? "bild" : "bilder"}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 sm:justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      setViewingJob(job);
                    }}
                  >
                    <ClipboardList className="h-4 w-4" />
                    Översikt
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(job);
                    }}
                    aria-label="Redigera"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(job.id);
                    }}
                    aria-label="Ta bort"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <JobOverviewDialog
        job={viewingJob}
        onOpenChange={(open) => {
          if (!open) setViewingJob(null);
        }}
        onSelectImage={setValdBild}
      />

      {valdBild && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setValdBild(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-110 text-white/70 hover:text-white"
            onClick={() => setValdBild(null)}
            aria-label="Stäng bild"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl">
            <Image
              src={valdBild}
              alt="Förstorad bild"
              fill
              className="object-contain"
              onClick={(event) => event.stopPropagation()}
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
