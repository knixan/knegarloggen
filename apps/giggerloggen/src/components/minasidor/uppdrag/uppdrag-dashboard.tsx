import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Clock, CheckCircle2, FileText, Banknote } from "lucide-react";
import type { UppdragMedRelationer } from "@/lib/uppdrag-schema";
import { beraknaTotal } from "@/lib/uppdrag-schema";
import { formatCurrency, cn } from "@/lib/utils";

type Props = {
  uppdrag: UppdragMedRelationer[];
};

const statusConfig: Record<string, {
  label: string;
  color: string;
  icon: React.ElementType;
}> = {
  pagaende: { label: "Pågående", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", icon: Clock },
  utfort: { label: "Utfört", color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300", icon: CheckCircle2 },
  fakturerat: { label: "Fakturerat", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", icon: FileText },
  betalt: { label: "Betalt", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: Banknote },
};

export function UppdragDashboard({ uppdrag }: Props) {
  const stats = {
    pagaende: uppdrag.filter((u) => u.status === "pagaende").length,
    utfort: uppdrag.filter((u) => u.status === "utfort").length,
    fakturerat: uppdrag.filter((u) => u.status === "fakturerat").length,
    betalt: uppdrag.filter((u) => u.status === "betalt").length,
  };

  const totalBetalt = uppdrag
    .filter((u) => u.status === "betalt")
    .reduce((s, u) => s + beraknaTotal(u).totalExklMoms, 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map(([key, count]) => {
          const cfg = statusConfig[key];
          return (
            <Card key={key}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-lg p-2 ${cfg.color}`}>
                  <cfg.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Mina uppdrag</h2>
          <p className="text-sm text-muted-foreground">
            Totalt intjänat (betalt): {formatCurrency(totalBetalt)}
          </p>
        </div>
        <Link href="/mina-sidor/nytt-uppdrag" className={cn(buttonVariants(), "gap-2")}>
          <Plus className="h-4 w-4" /> Nytt uppdrag
        </Link>
      </div>

      {/* List */}
      {uppdrag.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Inga uppdrag ännu.</p>
            <Link href="/mina-sidor/nytt-uppdrag" className={buttonVariants()}>
              Skapa ditt första uppdrag
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {uppdrag.map((u) => {
            const cfg = statusConfig[u.status] ?? statusConfig.pagaende;
            const total = beraknaTotal(u);
            return (
              <Card key={u.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{u.titel}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
                        <cfg.icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {u.customer
                        ? u.customer.foretagsnamn || u.customer.namn
                        : "Ingen kund kopplad"}
                      {" · "}
                      {u.uppdragsTyp}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold">{formatCurrency(total.totalExklMoms)}</p>
                    <p className="text-xs text-muted-foreground">exkl. moms</p>
                  </div>
                  <Link
                    href={`/mina-sidor/uppdrag/${u.id}/redigera`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Öppna
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
