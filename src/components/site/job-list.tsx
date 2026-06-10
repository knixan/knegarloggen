"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, Wrench, MapPinned, Phone, Mail, Clock, Package, Van, FileText, User, NotebookPen, Calendar } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { beräknaSummering, type Job } from "@/lib/job-schema";

interface Props {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobList({ jobs, onEdit, onDelete }: Props) {
  const [viewingJob, setViewingJob] = useState<Job | null>(null);

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
          <Card 
            key={job.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors group"
            onClick={() => setViewingJob(job)}
          >
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
                {/* // Status badges */}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(job);
                  }}
                  aria-label="Redigera"
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(job.id);
                  }}
                  aria-label="Ta bort"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
{/* Job details dialog */}
      <Dialog open={!!viewingJob} onOpenChange={(open) => !open && setViewingJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
          {viewingJob && (
            <>
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  {viewingJob.namn}
                </DialogTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  <StatusBadge job={viewingJob} />
                  {viewingJob.rotAvdrag && <Badge label="ROT" />}
                  {viewingJob.fakturerat && <Badge label="Fakturerat" color="orange" />}
                  {viewingJob.betalt && <Badge label="Betalt" color="green" />}
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 p-6 pt-2">
                <div className="space-y-6">
                  {/* Kundinfo */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <InfoItem icon={<MapPinned />} label="Adress" value={viewingJob.adress} />
                    <InfoItem icon={<Phone />} label="Telefon" value={viewingJob.telefon} />
                    <InfoItem icon={<Mail />} label="E-post" value={viewingJob.epost} />
                  </section>

                  <Separator />

                  {/* Utfört arbete */}
                  {viewingJob.utfortArbete && (
                    <section className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Wrench className="h-4 w-4" /> Utfört arbete
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md italic">
                        {viewingJob.utfortArbete}
                      </p>
                    </section>
                  )}

                  {/* Artiklar */}
                  <section className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Package className="h-4 w-4" /> Artiklar & Material
                    </h4>
                    {viewingJob.artiklar && viewingJob.artiklar.length > 0 ? (
                      <div className="bg-muted/30 rounded-md overflow-hidden border">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-muted text-muted-foreground font-medium">
                            <tr>
                              <th className="px-3 py-2">Namn</th>
                              <th className="px-3 py-2 text-right">Antal</th>
                              <th className="px-3 py-2 text-right">Pris</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {viewingJob.artiklar.map((a, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2">{a.namn} <span className="text-[10px] text-muted-foreground block">{a.artikelnr}</span></td>
                                <td className="px-3 py-2 text-right">{a.antal}</td>
                                <td className="px-3 py-2 text-right">{(a.pris * a.antal).toLocaleString('sv-SE')} kr</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Inga artiklar registrerade.</p>
                    )}
                    {viewingJob.ovrigaArtiklar && (
                      <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-900/10 p-2 rounded border border-amber-100 dark:border-amber-900/30">
                        <strong>Övrigt:</strong> {viewingJob.ovrigaArtiklar}
                      </div>
                    )}
                  </section>

                  {/* Arbetstider & Resor Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <section className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Arbetstid
                      </h4>
                      <div className="text-xs space-y-1">
                        {viewingJob.arbetstider?.map((t, i) => (
                          <div key={i} className="flex justify-between border-b border-dotted pb-1">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /> {formatDate(t.datum)}</span>
                            <span className="font-medium">{t.timmar} h</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Van className="h-4 w-4" /> Resor
                      </h4>
                      <div className="text-xs space-y-1">
                        {viewingJob.resor?.map((r, i) => (
                          <div key={i} className="flex justify-between border-b border-dotted pb-1">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /> {formatDate(r.datum)}</span>
                            <span className="font-medium">{r.stracka} km</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Anteckningar */}
                  {viewingJob.anteckningar && (
                    <section className="space-y-2 pt-2 border-t">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <NotebookPen className="h-4 w-4" /> Interna anteckningar
                      </h4>
                      <p className="text-sm whitespace-pre-wrap">{viewingJob.anteckningar}</p>
                    </section>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-6 pt-2 border-t bg-muted/20 flex justify-end">
                <Button variant="secondary" onClick={() => setViewingJob(null)}>
                  Stäng
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return format(date, "d MMM yyyy", { locale: sv });
  } catch (e) {
    return dateStr;
  }
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <div>
        <p className="text-[10px] font-medium text-muted-foreground uppercase leading-none mb-1">{label}</p>
        <p className="leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Badge({ label, color }: { label: string, color?: 'orange' | 'green' }) {
  const colors = {
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${color ? colors[color] : colors.default}`}>
      {label}
    </span>
  );
}

function StatusBadge({ job }: { job: Job }) {
  const label = job.utfort ? "Utfört" : job.pagaende ? "Pågående" : "Ej påbörjat";
  const colorClass = job.utfort
    ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
    : job.pagaende
    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass}`}>
      <Wrench className="h-3 w-3" />
      {label}
    </span>
  );
}
