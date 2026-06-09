"use client";

import { Check, Trash2, Pencil, Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { beräknaSummering, type Job } from "@/lib/job-schema";

interface Props {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobList({ jobs, onEdit, onDelete }: Props) {
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

        return (
          <Card key={job.id}>
            <CardContent className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="font-semibold truncate">{job.namn}</div>

                <div className="text-sm text-muted-foreground truncate">
                  {job.adress} · {job.telefon}
                </div>

                {job.utfortArbete && (
                  <div className="text-xs text-muted-foreground/80 italic line-clamp-1">
                    {job.utfortArbete}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      job.utfort
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        : job.pagaende
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <Wrench className="h-3 w-3" />
                    {job.utfort ? "Utfört" : job.pagaende ? "Pågående" : "Ej påbörjat"}
                  </span>

                  {job.rotAvdrag && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      ROT
                    </span>
                  )}

                  {job.fakturerat && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
                      <Check className="h-3 w-3" />
                      Fakturerat
                    </span>
                  )}

                  {job.betalt && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      <Check className="h-3 w-3" />
                      Betalt
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right text-xs text-muted-foreground space-y-0.5">
                  <div>
                    <span className="tabular-nums font-medium text-foreground">
                      {summary.totalTimmar}
                    </span>{" "}
                    h arbete
                  </div>

                  <div>
                    <span className="tabular-nums font-medium text-foreground">
                      {summary.antalResor}
                    </span>{" "}
                    resor ·{" "}
                    <span className="tabular-nums font-medium text-foreground">
                      {summary.totalStracka}
                    </span>{" "}
                    km ·{" "}
                  </div>

                  <div className="tabular-nums font-medium text-foreground">
                    {summary.artiklarSum.toLocaleString("sv-SE", {
                      style: "currency",
                      currency: "SEK",
                      maximumFractionDigits: 0,
                    })}{" "}
                    artiklar
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(job)}
                  aria-label="Redigera"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(job.id)}
                  aria-label="Ta bort"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
