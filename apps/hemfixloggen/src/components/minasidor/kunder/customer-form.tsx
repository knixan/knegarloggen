"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { skapaKund, uppdateraKund } from "@/lib/uppdrag-actions";

type CustomerData = {
  id?: string;
  kundTyp: string;
  namn: string;
  adress: string;
  postnummer: string;
  stad: string;
  telefon: string;
  epost: string;
  personnummer: string;
  foretagsnamn: string;
  kontaktperson: string;
  orgNummer: string;
};

type Props = {
  defaultValues?: CustomerData;
};

export function CustomerForm({ defaultValues }: Props) {
  const router = useRouter();
  const [kundTyp, setKundTyp] = useState(defaultValues?.kundTyp ?? "privatperson");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      kundTyp,
      namn: fd.get("namn") as string,
      adress: fd.get("adress") as string,
      postnummer: fd.get("postnummer") as string,
      stad: fd.get("stad") as string,
      telefon: fd.get("telefon") as string,
      epost: fd.get("epost") as string,
      personnummer: fd.get("personnummer") as string,
      foretagsnamn: fd.get("foretagsnamn") as string,
      kontaktperson: fd.get("kontaktperson") as string,
      orgNummer: fd.get("orgNummer") as string,
    };

    const result = defaultValues?.id
      ? await uppdateraKund(defaultValues.id, data)
      : await skapaKund(data);

    setLoading(false);
    if (result.ok) {
      toast.success(defaultValues?.id ? "Kund uppdaterad!" : "Kund skapad!");
      router.push("/mina-sidor/kunder");
    } else {
      toast.error("Något gick fel");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={kundTyp} onValueChange={setKundTyp}>
        <TabsList>
          <TabsTrigger value="privatperson">Privatperson</TabsTrigger>
          <TabsTrigger value="foretag">Företag</TabsTrigger>
        </TabsList>

        <TabsContent value="privatperson">
          <Card className="mt-4">
            <CardHeader><CardTitle>Personuppgifter</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="namn">Namn *</Label>
                  <Input id="namn" name="namn" required defaultValue={defaultValues?.namn} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="personnummer">Personnummer</Label>
                  <Input id="personnummer" name="personnummer" placeholder="YYYYMMDD-XXXX" defaultValue={defaultValues?.personnummer} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="foretag">
          <Card className="mt-4">
            <CardHeader><CardTitle>Företagsuppgifter</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="foretagsnamn">Företagsnamn *</Label>
                  <Input id="foretagsnamn" name="foretagsnamn" required={kundTyp === "foretag"} defaultValue={defaultValues?.foretagsnamn} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="orgNummer">Org.nummer</Label>
                  <Input id="orgNummer" name="orgNummer" placeholder="556XXX-XXXX" defaultValue={defaultValues?.orgNummer} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="kontaktperson">Kontaktperson</Label>
                  <Input id="kontaktperson" name="kontaktperson" defaultValue={defaultValues?.kontaktperson} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="namn">Namn (kontakt)</Label>
                  <Input id="namn" name="namn" defaultValue={defaultValues?.namn} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden fields for unused tab */}
      <input type="hidden" name="personnummer" value={kundTyp === "privatperson" ? "" : ""} />
      <input type="hidden" name="foretagsnamn" value="" />
      <input type="hidden" name="kontaktperson" value="" />
      <input type="hidden" name="orgNummer" value="" />

      <Card>
        <CardHeader><CardTitle>Kontaktuppgifter</CardTitle></CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Avbryt
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Sparar..." : defaultValues?.id ? "Spara kund" : "Skapa kund"}
        </Button>
      </div>
    </form>
  );
}
