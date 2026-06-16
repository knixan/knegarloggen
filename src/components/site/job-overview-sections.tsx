// componenter för att visa olika sektioner i jobboverview dialogen, som kontaktuppgifter, snabböversikt, arbetsbeskrivning, material och anteckningar
"use client";

import {
  ClipboardList,
  Clock,
  Home,
  IdCard,
  Mail,
  MapPinned,
  NotebookPen,
  Package,
  Phone,
  Van,
  Wrench,
} from "lucide-react";
import { beräknaSummering, type Job } from "@/lib/job-schema";
import { InfoItem, toTelHref } from "./job-overview-badges";

export function ContactSection({ job }: { job: Job }) {
  const customer = job.customer;
  const customerDisplayName =
    customer?.foretagsnamn?.trim() || customer?.namn?.trim();

  const phoneHref = customer?.telefon
    ? `tel:${toTelHref(customer.telefon)}`
    : undefined;
  const emailHref = customer?.epost ? `mailto:${customer.epost}` : undefined;

  const fullAddress = [customer?.adress, customer?.postnummer, customer?.ort]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
      <InfoItem icon={<IdCard />} label="Kund" value={customerDisplayName} />
      <InfoItem icon={<MapPinned />} label="Adress" value={fullAddress} />
      <InfoItem
        icon={<Phone />}
        label="Telefon"
        value={customer?.telefon}
        href={phoneHref}
      />
      <InfoItem
        icon={<Mail />}
        label="E-post"
        value={customer?.epost}
        href={emailHref}
      />
      <InfoItem
        icon={<IdCard />} // Kan bytas mot User/Building2 om IdCard känns fel för kontaktperson
        label="Personnummer"
        value={customer?.personnummer}
      />
      <InfoItem
        icon={<Home />}
        label="Kontaktperson"
        value={customer?.kontaktperson}
      />
      <InfoItem
        icon={<ClipboardList />}
        label="Kund"
        value={customerDisplayName}
      />
    </section>
  );
}

export function QuickOverviewSection({
  job,
  summary,
}: {
  job: Job;
  summary: ReturnType<typeof beräknaSummering>;
}) {
  return (
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
          value={`${summary.artiklarSum.toLocaleString("sv-SE")} kr`}
        />
        {job.bilder && job.bilder.length > 0 && (
          <InfoItem
            icon={<ClipboardList />}
            label="Bilder"
            value={`${job.bilder.length} st`}
          />
        )}
      </div>
    </section>
  );
}

export function WorkDescriptionSection({ job }: { job: Job }) {
  return (
    <>
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
    </>
  );
}

export function MaterialSection({ job }: { job: Job }) {
  if (job.artiklar.length === 0) return null;

  return (
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
                  key={index}
                  className="grid gap-2 p-3 text-sm sm:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{artikel.namn}</p>
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

    </section>
  );
}

export function NotesSection({ job }: { job: Job }) {
  if (!job.anteckningar) return null;

  return (
    <section className="space-y-2 border-t pt-2">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <NotebookPen className="h-4 w-4" /> Interna anteckningar
      </h4>
      <p className="whitespace-pre-wrap text-sm">{job.anteckningar}</p>
    </section>
  );
}
