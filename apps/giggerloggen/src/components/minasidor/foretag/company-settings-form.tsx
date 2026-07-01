"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sparaForetagsinformation } from "@/lib/uppdrag-actions";

type Props = {
  defaultValues?: {
    namn?: string;
    orgNummer?: string;
    adress?: string;
    postnummer?: string;
    stad?: string;
    telefon?: string;
    epost?: string;
    hemsida?: string;
    betalningsvillkor?: number;
    drojsmalsranta?: string;
    fakturaText?: string;
    momsregistrerad?: boolean;
    momsNummer?: string;
    bankgiro?: string;
    plusgiro?: string;
    swish?: string;
    iban?: string;
    bic?: string;
  };
};

export function CompanySettingsForm({ defaultValues }: Props) {
  const [loading, setLoading] = useState(false);
  const [momsregistrerad, setMomsregistrerad] = useState(
    defaultValues?.momsregistrerad ?? false,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const result = await sparaForetagsinformation({
      namn: fd.get("namn") as string,
      orgNummer: fd.get("orgNummer") as string,
      adress: fd.get("adress") as string,
      postnummer: fd.get("postnummer") as string,
      stad: fd.get("stad") as string,
      telefon: fd.get("telefon") as string,
      epost: fd.get("epost") as string,
      hemsida: fd.get("hemsida") as string,
      betalningsvillkor: Number(fd.get("betalningsvillkor")),
      drojsmalsranta: fd.get("drojsmalsranta") as string,
      fakturaText: fd.get("fakturaText") as string,
      momsregistrerad,
      momsNummer: fd.get("momsNummer") as string,
      bankgiro: fd.get("bankgiro") as string,
      plusgiro: fd.get("plusgiro") as string,
      swish: fd.get("swish") as string,
      iban: fd.get("iban") as string,
      bic: fd.get("bic") as string,
    });

    setLoading(false);
    if (result.ok) {
      toast.success("Företagsuppgifter sparade!");
    } else {
      toast.error("Kunde inte spara uppgifterna");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Grunduppgifter</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="namn">Företagsnamn / Ditt namn</Label>
              <Input id="namn" name="namn" defaultValue={defaultValues?.namn} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="orgNummer">Org.nummer</Label>
              <Input id="orgNummer" name="orgNummer" placeholder="556XXX-XXXX" defaultValue={defaultValues?.orgNummer} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="adress">Adress</Label>
            <Input id="adress" name="adress" defaultValue={defaultValues?.adress} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="postnummer">Postnummer</Label>
              <Input id="postnummer" name="postnummer" defaultValue={defaultValues?.postnummer} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stad">Stad</Label>
              <Input id="stad" name="stad" defaultValue={defaultValues?.stad} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" name="telefon" type="tel" defaultValue={defaultValues?.telefon} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="epost">E-post</Label>
              <Input id="epost" name="epost" type="email" defaultValue={defaultValues?.epost} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="hemsida">Hemsida</Label>
            <Input id="hemsida" name="hemsida" type="url" placeholder="https://" defaultValue={defaultValues?.hemsida} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Fakturainstillningar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="betalningsvillkor">Betalningsvillkor (dagar)</Label>
              <Input id="betalningsvillkor" name="betalningsvillkor" type="number" min={1} defaultValue={defaultValues?.betalningsvillkor ?? 30} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="drojsmalsranta">Dröjsmålsränta</Label>
              <Input id="drojsmalsranta" name="drojsmalsranta" placeholder="8%" defaultValue={defaultValues?.drojsmalsranta ?? "8%"} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fakturaText">Fakturatext (visas längst ned på fakturan)</Label>
            <Textarea id="fakturaText" name="fakturaText" rows={3} defaultValue={defaultValues?.fakturaText} />
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Checkbox
              id="momsregistrerad"
              checked={momsregistrerad}
              onCheckedChange={(v) => setMomsregistrerad(Boolean(v))}
            />
            <Label htmlFor="momsregistrerad">Momsregistrerad</Label>
          </div>
          {momsregistrerad && (
            <div className="space-y-1">
              <Label htmlFor="momsNummer">Momsnummer</Label>
              <Input id="momsNummer" name="momsNummer" placeholder="SE5560000000001" defaultValue={defaultValues?.momsNummer} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Betalningssätt</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="bankgiro">Bankgiro</Label>
              <Input id="bankgiro" name="bankgiro" placeholder="XXX-XXXX" defaultValue={defaultValues?.bankgiro} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="plusgiro">Plusgiro</Label>
              <Input id="plusgiro" name="plusgiro" defaultValue={defaultValues?.plusgiro} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="swish">Swish</Label>
              <Input id="swish" name="swish" type="tel" defaultValue={defaultValues?.swish} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="iban">IBAN</Label>
              <Input id="iban" name="iban" placeholder="SE..." defaultValue={defaultValues?.iban} />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="bic">BIC/SWIFT</Label>
            <Input id="bic" name="bic" className="max-w-xs" defaultValue={defaultValues?.bic} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Sparar..." : "Spara företagsuppgifter"}
        </Button>
      </div>
    </form>
  );
}
