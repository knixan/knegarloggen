"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { beraknaTotal } from "@/lib/uppdrag-schema";
import type { UppdragMedRelationer } from "@/lib/uppdrag-schema";
import {
  laggTillArbetspass,
  raderaArbetspass,
  laggTillResa,
  raderaResa,
  laggTillOvrigKostnad,
  raderaOvrigKostnad,
  uppdateraStatus,
} from "@/lib/uppdrag-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { uppdrag: UppdragMedRelationer };

export function UppdragDetaljer({ uppdrag }: Props) {
  const [status, setStatus] = useState(uppdrag.status);
  const totals = beraknaTotal({ ...uppdrag, status });

  async function handleStatusChange(newStatus: string | null) {
    if (!newStatus) return;
    setStatus(newStatus);
    await uppdateraStatus(uppdrag.id, newStatus);
    toast.success("Status uppdaterad");
  }

  async function handleAddArbetspass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await laggTillArbetspass(
      uppdrag.id,
      fd.get("datum") as string,
      Number(fd.get("timmar")),
      fd.get("beskrivning") as string,
    );
    if (result.ok) {
      toast.success("Arbetspass tillagt");
      (e.target as HTMLFormElement).reset();
    }
  }

  async function handleAddResa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await laggTillResa(
      uppdrag.id,
      fd.get("datum") as string,
      Number(fd.get("stracka")),
      fd.get("beskrivning") as string,
    );
    if (result.ok) {
      toast.success("Resa tillagd");
      (e.target as HTMLFormElement).reset();
    }
  }

  async function handleAddKostnad(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = await laggTillOvrigKostnad(
      uppdrag.id,
      fd.get("beskrivning") as string,
      Number(fd.get("pris")),
    );
    if (result.ok) {
      toast.success("Kostnad tillagd");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="space-y-6">
      {/* Status */}
      <Card>
        <CardHeader><CardTitle>Status</CardTitle></CardHeader>
        <CardContent>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pagaende">Pågående</SelectItem>
              <SelectItem value="utfort">Utfört</SelectItem>
              <SelectItem value="fakturerat">Fakturerat</SelectItem>
              <SelectItem value="betalt">Betalt</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader><CardTitle>Summering</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {uppdrag.prisTyp === "timme" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Arbetstid ({totals.totalTimmar} h × {uppdrag.timpris} kr/h)
              </span>
              <span>{formatCurrency(totals.arbetstidSum)}</span>
            </div>
          )}
          {uppdrag.prisTyp === "fast" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fast pris</span>
              <span>{formatCurrency(uppdrag.fastPris)}</span>
            </div>
          )}
          {totals.resorSum > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Resor ({totals.totalStracka} km × {uppdrag.milersattning} kr/km)
              </span>
              <span>{formatCurrency(totals.resorSum)}</span>
            </div>
          )}
          {totals.ovrigaSum > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Övriga kostnader</span>
              <span>{formatCurrency(totals.ovrigaSum)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Totalt exkl. moms</span>
            <span>{formatCurrency(totals.totalExklMoms)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Moms (25%)</span>
            <span>{formatCurrency(totals.moms)}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Totalt inkl. moms</span>
            <span>{formatCurrency(totals.totalInklMoms)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Arbetspass */}
      <Card>
        <CardHeader><CardTitle>Arbetspass</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {uppdrag.arbetspass.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">{formatDate(new Date(a.datum))}</span>
              <span className="flex-1 truncate">{a.beskrivning || "—"}</span>
              <span className="font-medium">{a.timmar} h</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={async () => {
                  await raderaArbetspass(a.id, uppdrag.id);
                  toast.success("Arbetspass raderat");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <form onSubmit={handleAddArbetspass} className="grid grid-cols-3 gap-2 pt-2">
            <Input type="date" name="datum" required defaultValue={new Date().toISOString().split("T")[0]} />
            <Input type="number" name="timmar" placeholder="Timmar" step={0.25} min={0.25} required />
            <Input name="beskrivning" placeholder="Beskrivning (valfri)" />
            <Button type="submit" size="sm" className="col-span-3 gap-1">
              <Plus className="h-3.5 w-3.5" /> Lägg till arbetspass
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resor */}
      {uppdrag.milersattning > 0 && (
        <Card>
          <CardHeader><CardTitle>Resor</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {uppdrag.resor.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{formatDate(new Date(r.datum))}</span>
                <span className="flex-1 truncate">{r.beskrivning || "—"}</span>
                <span className="font-medium">{r.stracka} km</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={async () => {
                    await raderaResa(r.id, uppdrag.id);
                    toast.success("Resa raderad");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <form onSubmit={handleAddResa} className="grid grid-cols-3 gap-2 pt-2">
              <Input type="date" name="datum" required defaultValue={new Date().toISOString().split("T")[0]} />
              <Input type="number" name="stracka" placeholder="Km" min={1} required />
              <Input name="beskrivning" placeholder="Beskrivning (valfri)" />
              <Button type="submit" size="sm" className="col-span-3 gap-1">
                <Plus className="h-3.5 w-3.5" /> Lägg till resa
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Övriga kostnader */}
      <Card>
        <CardHeader><CardTitle>Övriga kostnader</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {uppdrag.ovrigaKostnader.map((k) => (
            <div key={k.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex-1 truncate">{k.beskrivning}</span>
              <span className="font-medium">{formatCurrency(k.pris)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={async () => {
                  await raderaOvrigKostnad(k.id, uppdrag.id);
                  toast.success("Kostnad raderad");
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <form onSubmit={handleAddKostnad} className="grid grid-cols-2 gap-2 pt-2">
            <Input name="beskrivning" placeholder="Beskrivning" required />
            <Input type="number" name="pris" placeholder="Pris (kr)" min={0} required />
            <Button type="submit" size="sm" className="col-span-2 gap-1">
              <Plus className="h-3.5 w-3.5" /> Lägg till kostnad
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
