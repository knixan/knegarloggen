"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { uppdragSchema } from "@/lib/uppdrag-schema";
import type { UppdragFormValues } from "@/lib/uppdrag-schema";
import { skapaUppdrag, uppdateraUppdrag } from "@/lib/uppdrag-actions";

type Customer = { id: string; namn: string; foretagsnamn: string; kundTyp: string };

type Props = {
  uppdragId?: string;
  defaultValues?: Partial<UppdragFormValues>;
  customers: Customer[];
};

const uppdragsTyper = [
  { value: "konsulting", label: "Konsulting" },
  { value: "design", label: "Design" },
  { value: "utbildning", label: "Utbildning" },
  { value: "handel", label: "Handel" },
  { value: "it", label: "IT" },
  { value: "juridik", label: "Juridik" },
  { value: "annat", label: "Annat" },
];

export function UppdragForm({ uppdragId, defaultValues, customers }: Props) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UppdragFormValues>({
    resolver: zodResolver(uppdragSchema) as any,
    defaultValues: {
      titel: "",
      beskrivning: "",
      uppdragsTyp: "konsulting",
      prisTyp: "timme",
      timpris: 0,
      fastPris: 0,
      milersattning: 0,
      anteckningar: "",
      utfortArbete: "",
      planeratArbete: "",
      ...defaultValues,
    },
  });

  const prisTyp = watch("prisTyp");

  async function onSubmit(data: UppdragFormValues) {
    const result = uppdragId
      ? await uppdateraUppdrag(uppdragId, data)
      : await skapaUppdrag(data);

    if (result.ok) {
      toast.success(uppdragId ? "Uppdrag sparat!" : "Uppdrag skapat!");
      if (!uppdragId && "id" in result) {
        router.push(`/mina-sidor/uppdrag/${result.id}/redigera`);
      }
    } else {
      toast.error(result.error ?? "Något gick fel");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Uppdragsinformation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="titel">Titel *</Label>
            <Input id="titel" {...register("titel")} placeholder="Ex. Webbutveckling för Acme AB" />
            {errors.titel && <p className="text-xs text-destructive">{errors.titel.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Uppdragstyp</Label>
              <Select
                defaultValue={defaultValues?.uppdragsTyp ?? "konsulting"}
                onValueChange={(v) => setValue("uppdragsTyp", v as UppdragFormValues["uppdragsTyp"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {uppdragsTyper.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Kund</Label>
              <Select
                defaultValue={defaultValues?.customerId ?? "ingen"}
                onValueChange={(v) => setValue("customerId", v === "ingen" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kund (valfritt)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingen">Ingen kund</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.foretagsnamn || c.namn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="beskrivning">Beskrivning</Label>
            <Textarea
              id="beskrivning"
              {...register("beskrivning")}
              rows={3}
              placeholder="Kort beskrivning av uppdraget..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prissättning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Prismodell</Label>
            <Select
              defaultValue={defaultValues?.prisTyp ?? "timme"}
              onValueChange={(v) => setValue("prisTyp", v as "timme" | "fast")}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timme">Per timme</SelectItem>
                <SelectItem value="fast">Fast pris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {prisTyp === "timme" ? (
              <div className="space-y-1">
                <Label htmlFor="timpris">Timpris (kr/h)</Label>
                <Input
                  id="timpris"
                  type="number"
                  min={0}
                  step={50}
                  {...register("timpris", { valueAsNumber: true })}
                />
              </div>
            ) : (
              <div className="space-y-1">
                <Label htmlFor="fastPris">Fast pris (kr)</Label>
                <Input
                  id="fastPris"
                  type="number"
                  min={0}
                  {...register("fastPris", { valueAsNumber: true })}
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="milersattning">Milersättning (kr/km)</Label>
              <Input
                id="milersattning"
                type="number"
                min={0}
                step={0.1}
                {...register("milersattning", { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anteckningar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="planeratArbete">Planerat arbete</Label>
            <Textarea id="planeratArbete" {...register("planeratArbete")} rows={3} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="utfortArbete">Utfört arbete</Label>
            <Textarea id="utfortArbete" {...register("utfortArbete")} rows={3} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="anteckningar">Övriga anteckningar</Label>
            <Textarea id="anteckningar" {...register("anteckningar")} rows={2} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Avbryt
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sparar..." : uppdragId ? "Spara ändringar" : "Skapa uppdrag"}
        </Button>
      </div>
    </form>
  );
}
