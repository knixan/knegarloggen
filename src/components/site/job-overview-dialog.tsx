"use client";

import Image from "next/image";
import {
  ClipboardList,
  Clock,
  Home,
  ImagePlus,
  IdCard,
  Mail,
  MapPinned,
  NotebookPen,
  Package,
  Phone,
  Printer,
  User,
  Van,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { beräknaSummering, type Job } from "@/lib/job-schema";

interface JobOverviewDialogProps {
  job: Job | null;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (url: string) => void;
}

export default function JobOverviewDialog({
  job,
  onOpenChange,
  onSelectImage,
}: JobOverviewDialogProps) {
  const summary = job ? beräknaSummering(job) : null;
  const phoneHref = job?.telefon ? `tel:${toTelHref(job.telefon)}` : undefined;
  const emailHref = job?.epost ? `mailto:${job.epost}` : undefined;

function skrivUt() {
  if (!job || !summary) return;

  const status = job.utfort ? "Utfört" : job.pagaende ? "Pågående" : "Ej påbörjat";
  const statusFärg = job.utfort ? "#dc2626" : job.pagaende ? "#2563eb" : "#6b7280";

  const badges = [
    `<span class="badge" style="background:${statusFärg};color:white">${status}</span>`,
    job.rotAvdrag ? `<span class="badge">ROT-avdrag</span>` : "",
    job.fakturerat ? `<span class="badge" style="background:#ea580c;color:white">Fakturerat</span>` : "",
    job.betalt ? `<span class="badge" style="background:#16a34a;color:white">Betalt</span>` : "",
  ].filter(Boolean).join(" ");

  const artiklarHtml = job.artiklar.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Artikel</th>
          <th>Återförsäljare</th>
          <th>Art.nr</th>
          <th class="right">Antal</th>
          <th class="right">À-pris</th>
          <th class="right">Summa</th>
        </tr>
      </thead>
      <tbody>
        ${job.artiklar.map(a => `
          <tr>
            <td>${a.namn}</td>
            <td class="muted">${a.aterforsaljare ?? ""}</td>
            <td class="muted">${a.artikelnr ?? ""}</td>
            <td class="right">${a.antal} st</td>
            <td class="right">${a.pris.toLocaleString("sv-SE")} kr</td>
            <td class="right bold">${(a.pris * a.antal).toLocaleString("sv-SE")} kr</td>
          </tr>
        `).join("")}
        <tr class="total-row">
          <td colspan="5">Totalt material</td>
          <td class="right bold">${summary.artiklarSum.toLocaleString("sv-SE")} kr</td>
        </tr>
      </tbody>
    </table>
  ` : "";

  const resorHtml = job.resor.length > 0 ? `
    <table>
      <thead><tr><th>Datum</th><th class="right">Körd sträcka</th></tr></thead>
      <tbody>
        ${job.resor.map(r => `
          <tr>
            <td>${r.datum}</td>
            <td class="right">${r.stracka} km</td>
          </tr>
        `).join("")}
        <tr class="total-row">
          <td>Totalt</td>
          <td class="right bold">${summary.totalStracka} km</td>
        </tr>
      </tbody>
    </table>
  ` : "";

  const arbetstidHtml = job.arbetstider.length > 0 ? `
    <table>
      <thead><tr><th>Datum</th><th class="right">Timmar</th></tr></thead>
      <tbody>
        ${job.arbetstider.map(a => `
          <tr>
            <td>${a.datum}</td>
            <td class="right">${a.timmar} h</td>
          </tr>
        `).join("")}
        <tr class="total-row">
          <td>Totalt</td>
          <td class="right bold">${summary.totalTimmar} h</td>
        </tr>
      </tbody>
    </table>
  ` : "";

  const bilderHtml = job.bilder?.length > 0 ? `
    <div class="bilder">
      ${job.bilder.map(b => `<img src="${b.url}" alt="Jobbild" />`).join("")}
    </div>
  ` : "";

  const fönster = window.open("", "_blank");
  if (!fönster) return;

  fönster.document.write(`<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <title>Knegarloggen – ${job.namn}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a1a; background: white; }
    
    .sida { padding: 1.5cm 2cm; max-width: 21cm; margin: 0 auto; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; margin-bottom: 16px; }
    .header-left h1 { font-size: 18pt; font-weight: 700; margin-bottom: 2px; }
    .header-left p { font-size: 9pt; color: #555; }
    .header-right { text-align: right; font-size: 9pt; color: #555; }
    .header-right strong { display: block; font-size: 10pt; color: #1a1a1a; }

    /* Badges */
    .badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
    .badge { padding: 2px 10px; border-radius: 999px; font-size: 8pt; font-weight: 700; background: #e5e7eb; color: #1a1a1a; }

    /* Kontaktinfo */
    .kontakt { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #f8f8f8; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; font-size: 9pt; }
    .kontakt-item label { display: block; font-size: 7.5pt; text-transform: uppercase; color: #888; margin-bottom: 2px; letter-spacing: 0.05em; }

    /* Snabböversikt */
    .oversikt { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
    .oversikt-cell { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 10px; }
    .oversikt-cell label { display: block; font-size: 7.5pt; text-transform: uppercase; color: #888; margin-bottom: 3px; }
    .oversikt-cell span { font-size: 13pt; font-weight: 700; }

    /* Sektioner */
    section { margin-bottom: 14px; break-inside: avoid; page-break-inside: avoid; }
    section h4 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.08em; color: #888; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; }

    /* Tabeller */
    table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
    th { text-align: left; font-size: 8pt; text-transform: uppercase; color: #888; padding: 4px 6px; border-bottom: 1px solid #ddd; }
    td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    .muted { color: #777; }
    .total-row td { border-top: 1.5px solid #1a1a1a; border-bottom: none; font-weight: 600; padding-top: 6px; background: #fafafa; }

    /* Fritext */
    .fritext { background: #f8f8f8; border-left: 3px solid #d1d5db; padding: 8px 12px; font-size: 9.5pt; white-space: pre-wrap; border-radius: 0 4px 4px 0; }

    /* Bilder */
    .bilder { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
    .bilder img { width: 100%; height: 90px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb; }

    /* Anteckningar */
    .anteckningar { font-size: 9pt; white-space: pre-wrap; }

    /* Sidfot */
    .sidfot { margin-top: 20px; padding-top: 8px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 8pt; color: #aaa; }
  </style>
</head>
<body>
<div class="sida">

  <div class="header">
    <div class="header-left">
      <h1>${job.namn}</h1>
      <p>${job.adress ?? ""}</p>
    </div>
    <div class="header-right">
      <strong>Knegarloggen</strong>
      Utskrivet ${new Date().toLocaleDateString("sv-SE")}
    </div>
  </div>

  <div class="badges">${badges}</div>

  <div class="kontakt">
    ${job.telefon ? `<div class="kontakt-item"><label>Telefon</label>${job.telefon}</div>` : ""}
    ${job.epost ? `<div class="kontakt-item"><label>E-post</label>${job.epost}</div>` : ""}
    ${job.adress ? `<div class="kontakt-item"><label>Adress</label>${job.adress}</div>` : ""}
  </div>

  <div class="oversikt">
    <div class="oversikt-cell"><label>Arbetstid</label><span>${summary.totalTimmar} h</span></div>
    <div class="oversikt-cell"><label>Körd sträcka</label><span>${summary.totalStracka} km</span></div>
    <div class="oversikt-cell"><label>Material</label><span>${summary.artiklarSum.toLocaleString("sv-SE")} kr</span></div>
    <div class="oversikt-cell"><label>Bilder</label><span>${job.bilder?.length ?? 0} st</span></div>
  </div>

  ${job.planeratArbete ? `
  <section>
    <h4>Planerat arbete</h4>
    <div class="fritext">${job.planeratArbete}</div>
  </section>` : ""}

  ${job.utfortArbete ? `
  <section>
    <h4>Utfört arbete</h4>
    <div class="fritext">${job.utfortArbete}</div>
  </section>` : ""}

  ${job.artiklar.length > 0 || job.ovrigaArtiklar ? `
  <section>
    <h4>Inköpt material</h4>
    ${artiklarHtml}
    ${job.ovrigaArtiklar ? `<div class="fritext" style="margin-top:8px">${job.ovrigaArtiklar}</div>` : ""}
  </section>` : ""}

  ${job.resor.length > 0 ? `
  <section>
    <h4>Resor</h4>
    ${resorHtml}
  </section>` : ""}

  ${job.arbetstider.length > 0 ? `
  <section>
    <h4>Arbetstid</h4>
    ${arbetstidHtml}
  </section>` : ""}

  ${job.bilder?.length > 0 ? `
  <section>
    <h4>Bilder</h4>
    ${bilderHtml}
  </section>` : ""}

  ${job.anteckningar ? `
  <section>
    <h4>Interna anteckningar</h4>
    <p class="anteckningar">${job.anteckningar}</p>
  </section>` : ""}

  <div class="sidfot">
    <span>${job.namn} · ${job.adress ?? ""}</span>
    <span>Knegarloggen</span>
  </div>

</div>
</body>
</html>`);

  fönster.document.close();
  fönster.focus();
  setTimeout(() => {
    fönster.print();
    fönster.close();
  }, 600);
}


  return (
    <Dialog open={!!job} onOpenChange={onOpenChange}>
      <DialogContent className="job-overview-print flex h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] w-[calc(100vw-1rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:w-full">
        {job && summary && (
          <>
            <DialogHeader className="shrink-0 p-4 pb-2 sm:p-6 sm:pb-2">
              <div className="flex items-start gap-3 pr-8">
                <DialogTitle className="flex min-w-0 flex-1 items-center gap-2 text-lg sm:text-xl">
                  <User className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{job.namn}</span>
                </DialogTitle>
            <Button
  type="button"
  variant="outline"
  size="icon"
  className="job-overview-print-hide shrink-0"
  onClick={skrivUt}
  aria-label="Skriv ut översikt"
>
  <Printer className="h-4 w-4" />
</Button>
              </div>
            </DialogHeader>

         <ScrollArea className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-6">
  <div className="job-overview-print-content space-y-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge job={job} />
                  {job.rotAvdrag && <Badge label="ROT" />}
                  {job.fakturerat && (
                    <Badge label="Fakturerat" color="orange" />
                  )}
                  {job.betalt && <Badge label="Betalt" color="green" />}
                </div>
                <Separator />

                <section className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <InfoItem
                    icon={<MapPinned />}
                    label="Adress"
                    value={job.adress}
                  />
                  <InfoItem
                    icon={<Phone />}
                    label="Telefon"
                    value={job.telefon}
                    href={phoneHref}
                  />
                  <InfoItem
                    icon={<Mail />}
                    label="E-post"
                    value={job.epost}
                    href={emailHref}
                  />
                  <InfoItem
                    icon={<IdCard />}
                    label="Personnummer"
                    value={job.personnummer}
                  />
                  <InfoItem
                    icon={<Home />}
                    label="Fastighetsbeteckning"
                    value={job.fastighetsbeteckning}
                  />
                </section>
                <Separator />

                <section className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <ClipboardList className="h-4 w-4" /> Snabböversikt
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm min-[420px]:grid-cols-2">
                    <InfoItem
                      icon={<Clock />}
                      label="Arbetstid"
                      value={`${summary.totalTimmar} h`}
                    />
                    <InfoItem
                      icon={<Van />}
                      label="Resor"
                      value={`${summary.totalStracka} km`}
                    />
                    <InfoItem
                      icon={<Package />}
                      label="Material"
                      value={`${summary.artiklarSum.toLocaleString(
                        "sv-SE",
                      )} kr`}
                    />
                    {job.bilder?.length > 0 && (
                      <InfoItem
                        icon={<ImagePlus />}
                        label="Bilder"
                        value={`${job.bilder.length} st`}
                      />
                    )}
                  </div>
                </section>

                {job.planeratArbete && (
                  <section className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <ClipboardList className="h-4 w-4" /> Planerat arbete
                    </h4>
                    <p className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">
                      {job.planeratArbete}
                    </p>
                  </section>
                )}

                {job.utfortArbete && (
                  <section className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <Wrench className="h-4 w-4" /> Utfört arbete
                    </h4>
                    <p className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">
                      {job.utfortArbete}
                    </p>
                  </section>
                )}

                {(job.artiklar.length > 0 || job.ovrigaArtiklar) && (
                  <section className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <Package className="h-4 w-4" /> Inköpt material
                    </h4>

                    {job.artiklar.length > 0 && (
                      <div className="overflow-hidden rounded-md border">
                        <div className="divide-y">
                          {job.artiklar.map((artikel, index) => {
                            const rowTotal = artikel.pris * artikel.antal;

                            return (
                              <div
                                key={`${artikel.namn}-${artikel.artikelnr}-${index}`}
                                className="grid gap-2 p-3 text-sm sm:grid-cols-[1fr_auto]"
                              >
                                <div className="min-w-0">
                                  <p className="font-medium leading-tight">
                                    {artikel.namn}
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    {artikel.artikelnr && (
                                      <span>Art.nr {artikel.artikelnr}</span>
                                    )}
                                    {artikel.aterforsaljare && (
                                      <span>{artikel.aterforsaljare}</span>
                                    )}
                                    <span>{artikel.antal} st</span>
                                  </div>
                                </div>

                                <div className="text-left text-sm tabular-nums sm:text-right">
                                  <div className="font-medium">
                                    {rowTotal.toLocaleString("sv-SE", {
                                      style: "currency",
                                      currency: "SEK",
                                      maximumFractionDigits: 0,
                                    })}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {artikel.pris.toLocaleString("sv-SE", {
                                      style: "currency",
                                      currency: "SEK",
                                      maximumFractionDigits: 0,
                                    })}{" "}
                                    / st
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {job.ovrigaArtiklar && (
                      <p className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm text-muted-foreground">
                        {job.ovrigaArtiklar}
                      </p>
                    )}
                  </section>
                )}

                {job.bilder && job.bilder.length > 0 && (
                  <section className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <ImagePlus className="h-4 w-4" /> Bilder
                    </h4>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                      {job.bilder.map((bild) => (
                        <button
                          key={bild.key}
                          type="button"
                          className="group relative aspect-square overflow-hidden rounded-md border"
                          onClick={() => onSelectImage(bild.url)}
                        >
                          <Image
                            src={bild.url}
                            alt="Jobbild"
                            fill
                            sizes="(max-width: 640px) 50vw, 200px"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {job.anteckningar && (
                  <section className="space-y-2 border-t pt-2">
                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                      <NotebookPen className="h-4 w-4" /> Interna anteckningar
                    </h4>
                    <p className="whitespace-pre-wrap text-sm">
                      {job.anteckningar}
                    </p>
                  </section>
                )}
              </div>
            </ScrollArea>

            <div className="job-overview-print-hide shrink-0 border-t bg-muted/20 p-4 sm:p-6 sm:pt-3">
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Stäng
              </Button>
            </div>


          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  href?: string;
}) {
  if (!value) return null;
  const content = href ? (
    <a
      href={href}
      className="break-words leading-tight text-primary underline-offset-4 hover:underline"
      onClick={(event) => event.stopPropagation()}
    >
      {value}
    </a>
  ) : (
    <p className="wrap-break-words leading-tight">{value}</p>
  );

  return (
    <div className="flex min-w-0 items-start gap-2">
      <div className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-medium uppercase leading-none text-muted-foreground">
          {label}
        </p>
        {content}
      </div>
    </div>
  );
}

function toTelHref(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function Badge({
  label,
  color,
}: {
  label: string;
  color?: "orange" | "green";
}) {
  const colors = {
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
        color ? colors[color] : colors.default
      }`}
    >
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
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${colorClass}`}
    >
      <Wrench className="h-3 w-3" />
      {label}
    </span>
  );
}
