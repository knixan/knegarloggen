"use client";

import { useState } from "react";
import { Check, Trash2, Pencil, Wrench, MapPinned, Phone, Mail, Clock, Package, Van, FileText, User, NotebookPen, Calendar, X, ImagePlus, ClipboardList, ChevronDown } from "lucide-react";
import Image from "next/image";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { beräknaSummering, type Job } from "@/lib/job-schema";

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

        return (
          <Card 
            key={job.id} 
            className="cursor-pointer hover:bg-accent/50 transition-colors group"
            onClick={() => setViewingJob(job)}
          >
            <CardContent className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="font-bold text-lg truncate">{job.namn}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {job.adress}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <StatusBadge job={job} />
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
                    artiklar
                  </div>
                  {job.bilder?.length ? (
                    <div className="flex items-center gap-1">
                      <span className="tabular-nums font-medium text-foreground">
                        {job.bilder.length}
                      </span>{" "}
                      {job.bilder.length === 1 ? "bild" : "bilder"}
                    </div>
                  ) : null}
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
              </DialogHeader>

              <ScrollArea className="flex-1 p-6 pt-2">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <StatusBadge job={viewingJob} />
                    {viewingJob.rotAvdrag && <Badge label="ROT" />}
                    {viewingJob.fakturerat && <Badge label="Fakturerat" color="orange" />}
                    {viewingJob.betalt && <Badge label="Betalt" color="green" />}
                  </div>
                  <Separator />

                  {/* Kundinfo */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <InfoItem icon={<MapPinned />} label="Adress" value={viewingJob.adress} />
                    <InfoItem icon={<Phone />} label="Telefon" value={viewingJob.telefon} />
                    <InfoItem icon={<Mail />} label="E-post" value={viewingJob.epost} />
                  </section>
                  <Separator />

                  {/* Snabböversikt (Summary) */}
                  <section className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" /> Snabböversikt
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <InfoItem icon={<Clock />} label="Arbetstid" value={`${beräknaSummering(viewingJob).totalTimmar} h`} />
                      <InfoItem icon={<Van />} label="Resor" value={`${beräknaSummering(viewingJob).totalStracka} km`} />
                      <InfoItem icon={<Package />} label="Material" value={`${beräknaSummering(viewingJob).artiklarSum.toLocaleString('sv-SE')} kr`} />
                      {viewingJob.bilder?.length > 0 && (
                        <InfoItem icon={<ImagePlus />} label="Bilder" value={`${viewingJob.bilder.length} st`} />
                      )}
                    </div>
                  </section>

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

                  {/* Bilder */}
                  {viewingJob.bilder && viewingJob.bilder.length > 0 && (
                    <section className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <ImagePlus className="h-4 w-4" /> Bilder
                      </h4>                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {viewingJob.bilder.map((bild) => (
                          <div 
                            key={bild.key} 
                            className="relative aspect-square cursor-pointer group overflow-hidden rounded-md border"
                            onClick={() => setValdBild(bild.url)}
                          >
                            <Image
                              src={bild.url}
                              alt="Jobbild"
                              fill
                              sizes="(max-width: 640px) 33vw, 200px"
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

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

      {/* Lightbox overlay */}
      {valdBild && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setValdBild(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white z-[110]"
            onClick={() => setValdBild(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
            <Image
              src={valdBild}
              alt="Förstorad bild"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
              priority
            />
          </div>
        </div>
      )}
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
