// Översikten på /mina-sidor – "vad behöver jag göra nu?". Serverkomponent,
// datan hämtas i lib/oversikt-data.ts.
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  FileText,
  Hammer,
  Plus,
  Receipt,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@knegarloggen/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@knegarloggen/ui/card";
import { brand } from "../../../brand";
import type { Oversikt } from "../../../lib/oversikt-data";

const VISA_MAX = 5;

const kr = (n: number) =>
  n.toLocaleString("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  });

const tim = (n: number) =>
  n.toLocaleString("sv-SE", { maximumFractionDigits: 1 });

const jobbLank = (id: string) => `/mina-sidor/jobb/${id}/redigera`;

interface Props {
  data: Oversikt;
  halsning: string;
  datum: string;
}

export default function OversiktVy({ data, halsning, datum }: Props) {
  return (
    <div className="space-y-6">
      {/* Hälsning + snabbknappar */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {halsning}, {data.companyName}
            </p>
            <h1 className="mt-1 text-2xl font-bold">Din arbetsdag</h1>
            <p className="text-sm capitalize text-muted-foreground">{datum}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Link href="/mina-sidor/nytt-jobb">
              <Button className="w-full">
                <Plus className="mr-1 h-4 w-4" />
                Skapa jobb
              </Button>
            </Link>
            <Link href="/mina-sidor/jobb">
              <Button variant="outline" className="w-full">
                Visa alla jobb
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Nyckeltal */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Nyckeltal
          icon={Hammer}
          label="Pågående jobb"
          value={String(data.antalPagaende)}
        />
        <Nyckeltal
          icon={Clock}
          label="Timmar denna vecka"
          value={tim(data.timmarVecka)}
          sub={`${tim(data.timmarManad)} h denna månad`}
        />
        <Nyckeltal
          icon={Receipt}
          label="Att fakturera"
          value={kr(data.attFaktureraSumma)}
          sub={`${data.attFakturera.length} jobb · exkl. moms`}
          tone={data.attFakturera.length ? "red" : undefined}
        />
        <Nyckeltal
          icon={Wallet}
          label="Obetalt"
          value={kr(data.obetaltSumma)}
          sub={`${data.obetalda.length} fakturor · inkl. moms`}
          tone={data.obetalda.length ? "orange" : undefined}
        />
      </div>

      <Varningar data={data} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pågående jobb */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pågående jobb</CardTitle>
            <Link
              href="/mina-sidor/jobb"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Alla <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.pagaende.length === 0 ? (
              <Tomt>
                Inga jobb på gång.{" "}
                <Link href="/mina-sidor/nytt-jobb" className="underline">
                  Skapa ett nytt jobb
                </Link>
              </Tomt>
            ) : (
              <ul className="divide-y">
                {data.pagaende.map((j) => (
                  <li key={j.id}>
                    <Link
                      href={jobbLank(j.id)}
                      className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-3 hover:bg-muted"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{j.kund}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {j.beskrivning || j.plats || "Ingen beskrivning"}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusPill pagaende={j.pagaende} />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {tim(j.timmar)} h
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Att göra */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Att göra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.attFakturera.length === 0 && data.obetalda.length === 0 ? (
              <Tomt>
                Inget att fakturera och inga obetalda fakturor. Snyggt!
              </Tomt>
            ) : (
              <>
                {data.attFakturera.length > 0 && (
                  <AttGoraLista
                    rubrik="Utfört – inte fakturerat"
                    rader={data.attFakturera.map((j) => ({
                      id: j.id,
                      href: `/mina-sidor/jobb/${j.id}/skriv-ut`,
                      titel: j.kund,
                      belopp: kr(j.exklMoms),
                      knapp: "Fakturera",
                    }))}
                  />
                )}
                {data.obetalda.length > 0 && (
                  <AttGoraLista
                    rubrik="Fakturerat – inte betalt"
                    rader={data.obetalda.map((j) => ({
                      id: j.id,
                      href: jobbLank(j.id),
                      titel: j.fakturanummer
                        ? `${j.kund} · faktura ${j.fakturanummer}`
                        : j.kund,
                      belopp: kr(j.inklMoms),
                      knapp: "Visa",
                    }))}
                  />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Nyckeltal({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "red" | "orange";
}) {
  const toneClass =
    tone === "red"
      ? "text-red-600 dark:text-red-400"
      : tone === "orange"
        ? "text-orange-600 dark:text-orange-400"
        : "";
  return (
    <div className="rounded-xl bg-primary/5 p-4 dark:bg-primary/10">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${toneClass}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function StatusPill({ pagaende }: { pagaende: boolean }) {
  return pagaende ? (
    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
      Pågående
    </span>
  ) : (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
      Ej påbörjat
    </span>
  );
}

function AttGoraLista({
  rubrik,
  rader,
}: {
  rubrik: string;
  rader: {
    id: string;
    href: string;
    titel: string;
    belopp: string;
    knapp: string;
  }[];
}) {
  const visade = rader.slice(0, VISA_MAX);
  const fler = rader.length - visade.length;
  return (
    <div>
      <p className="mb-1 text-sm font-semibold">
        {rubrik}{" "}
        <span className="font-normal text-muted-foreground">
          ({rader.length})
        </span>
      </p>
      <ul className="divide-y">
        {visade.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{r.titel}</p>
              <p className="text-xs tabular-nums text-muted-foreground">
                {r.belopp}
              </p>
            </div>
            <Link href={r.href} className="shrink-0">
              <Button variant="outline" size="sm">
                {r.knapp === "Fakturera" && (
                  <FileText className="mr-1 h-4 w-4" />
                )}
                {r.knapp}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
      {fler > 0 && (
        <Link
          href="/mina-sidor/jobb"
          className="mt-1 inline-block text-sm text-muted-foreground underline hover:text-foreground"
        >
          + {fler} till
        </Link>
      )}
    </div>
  );
}

function Varningar({ data }: { data: Oversikt }) {
  if (!data.foretagSaknas.length && !data.avdragSaknas.length) return null;
  return (
    <div className="space-y-3">
      {data.foretagSaknas.length > 0 && (
        <Varning>
          Fakturorna saknar {lista(data.foretagSaknas)}.{" "}
          <Link href="/mina-sidor/foretag" className="font-medium underline">
            Fyll i företagsuppgifter
          </Link>
        </Varning>
      )}
      {data.avdragSaknas.length > 0 && (
        <Varning>
          {data.avdragSaknas.length === 1
            ? `Ett ${brand.skatteavdrag?.typ}-jobb`
            : `${data.avdragSaknas.length} ${brand.skatteavdrag?.typ}-jobb`}{" "}
          saknar{" "}
          {brand.skatteavdrag?.kraverFastighet
            ? "personnummer eller fastighetsbeteckning/BRF"
            : "personnummer"}{" "}
          hos kunden:{" "}
          {data.avdragSaknas.slice(0, VISA_MAX).map((j, i) => (
            <span key={j.id}>
              {i > 0 && ", "}
              <Link
                href={
                  j.customerId
                    ? `/mina-sidor/kunder/${j.customerId}/redigera`
                    : jobbLank(j.id)
                }
                className="font-medium underline"
              >
                {j.kund}
              </Link>
            </span>
          ))}
          {data.avdragSaknas.length > VISA_MAX && " …"}
        </Varning>
      )}
    </div>
  );
}

function Varning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function Tomt({ children }: { children: React.ReactNode }) {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>
  );
}

function lista(delar: string[]) {
  if (delar.length <= 1) return delar.join("");
  return `${delar.slice(0, -1).join(", ")} och ${delar[delar.length - 1]}`;
}
