"use client";

import {
  Check,
  X,
  Trash2,
  Pencil,
  Wrench,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  beräknaSummering,
  type Job,
} from "@/lib/job-schema";

interface Props {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobList({
  jobs,
  onEdit,
  onDelete,
}: Props) {
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
                <div className="font-semibold truncate">
                  {job.namn}
                </div>

                <div className="text-sm text-muted-foreground truncate">
                  {job.adress} · {job.telefon}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge
                    variant={job.utfort ? "default" : "outline"}
                  >
                    <Wrench className="h-3 w-3 mr-1" />

                    {job.utfort
                      ? "Utfört"
                      : "Pågående"}
                  </Badge>

                  {job.rotAvdrag && (
                    <Badge variant="secondary">
                      ROT
                    </Badge>
                  )}

                  <Badge
                    variant={
                      job.fakturerat
                        ? "default"
                        : "outline"
                    }
                  >
                    {job.fakturerat ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <X className="h-3 w-3 mr-1" />
                    )}

                    Fakturerat
                  </Badge>

                  <Badge
                    variant={
                      job.betalt
                        ? "default"
                        : "outline"
                    }
                  >
                    {job.betalt ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <X className="h-3 w-3 mr-1" />
                    )}

                    Betalt
                  </Badge>
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
                    <span className="tabular-nums font-medium text-foreground">
                      {summary.totalAvstand}
                    </span>{" "}
                    km avstånd
                  </div>

                  <div className="tabular-nums font-medium text-foreground">
                    {summary.artiklarSum.toLocaleString(
                      "sv-SE",
                      {
                        style: "currency",
                        currency: "SEK",
                        maximumFractionDigits: 0,
                      }
                    )}{" "}
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