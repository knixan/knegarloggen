"use client";

import * as React from "react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { jobSchema, type JobInput, beräknaSummering } from "@/lib/job-schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  onSubmit: (data: JobInput) => void;
  defaultValues?: Partial<JobInput>;
  submitLabel?: string;
}

const idag = () => new Date().toISOString().slice(0, 10);

const tomDefaults: JobInput = {
  namn: "",
  adress: "",
  telefon: "",
  epost: "",
  artiklar: [{ namn: "", artikelnr: "", pris: 0, antal: 1 }],
  resor: [],
  arbetstider: [],
  rotAvdrag: false,
  utfort: false,
  fakturerat: false,
  betalt: false,
  anteckningar: "",
};

export default function JobForm({
  onSubmit,
  defaultValues,
  submitLabel = "Spara jobb",
}: Props) {
  const form = useForm<JobInput>({
    resolver: zodResolver(jobSchema) as Resolver<JobInput>,
    defaultValues: {
      ...tomDefaults,
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const artiklar = useFieldArray({
    control,
    name: "artiklar",
  });

  const resor = useFieldArray({
    control,
    name: "resor",
  });

  const arbetstider = useFieldArray({
    control,
    name: "arbetstider",
  });

  const live = watch();
  const summering = beräknaSummering(live);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-6"
    >
      {/* Kunduppgifter */}
      <Card>
        <CardHeader>
          <CardTitle>Kunduppgifter</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Namn" error={errors.namn?.message}>
            <Input
              {...register("namn")}
              placeholder="Anna Andersson"
            />
          </Field>

          <Field label="Telefon" error={errors.telefon?.message}>
            <Input
              {...register("telefon")}
              placeholder="070-123 45 67"
            />
          </Field>

          <Field label="E-post" error={errors.epost?.message}>
            <Input
              type="email"
              {...register("epost")}
              placeholder="anna@exempel.se"
            />
          </Field>

          <Field label="Adress" error={errors.adress?.message}>
            <Input
              {...register("adress")}
              placeholder="Storgatan 1, 123 45 Stad"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Artiklar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Artiklar</CardTitle>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              artiklar.append({
                namn: "",
                artikelnr: "",
                pris: 0,
                antal: 1,
              })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Lägg till
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
            <div className="col-span-5">Artikelnamn</div>
            <div className="col-span-3">Artikelnr</div>
            <div className="col-span-1 text-center">Antal</div>
            <div className="col-span-2">Pris (kr)</div>
            <div className="col-span-1"></div>
          </div>

          {artiklar.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-start"
            >
              <div className="col-span-12 sm:col-span-5">
                <Input
                  {...register(`artiklar.${i}.namn`)}
                  placeholder="Artikelnamn"
                />

                {errors.artiklar?.[i]?.namn && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.artiklar[i]?.namn?.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <Input
                  {...register(`artiklar.${i}.artikelnr`)}
                  placeholder="Artikelnr"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input
                  type="number"
                  step="1"
                  min="1"
                  {...register(`artiklar.${i}.antal`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Antal"
                />
              </div>

              <div className="col-span-3 sm:col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`artiklar.${i}.pris`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Pris kr"
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    artiklar.fields.length > 1 && artiklar.remove(i)
                  }
                  disabled={artiklar.fields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resor</CardTitle>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              resor.append({
                datum: idag(),
                stracka: 0,
                avstand: 0,
              })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Lägg till resa
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {resor.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-start"
            >
              <div className="col-span-6 sm:col-span-4">
                <Input
                  type="date"
                  {...register(`resor.${i}.datum`)}
                />
              </div>

              <div className="col-span-3 sm:col-span-3">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register(`resor.${i}.stracka`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Sträcka km"
                />
              </div>

              <div className="col-span-3 sm:col-span-4">
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register(`resor.${i}.avstand`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Avstånd km"
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => resor.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Arbetstid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Arbetstid</CardTitle>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              arbetstider.append({
                datum: idag(),
                timmar: 0,
              })
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Lägg till pass
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {arbetstider.fields.map((field, i) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 items-start"
            >
              <div className="col-span-6 sm:col-span-5">
                <Input
                  type="date"
                  {...register(`arbetstider.${i}.datum`)}
                />
              </div>

              <div className="col-span-5 sm:col-span-6">
                <Input
                  type="number"
                  step="0.25"
                  min="0"
                  {...register(`arbetstider.${i}.timmar`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Timmar"
                />
              </div>

              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => arbetstider.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Hantverkarens status</CardTitle>

          <p className="text-xs text-muted-foreground">
            Bockas av hantverkaren när jobbet är klart.
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <ToggleRow
            id="utfort"
            label="Jobb utfört och klart"
            checked={live.utfort}
            onChange={(v) =>
              setValue("utfort", v, {
                shouldDirty: true,
              })
            }
          />

          <ToggleRow
            id="rot"
            label="ROT-avdrag ska tillämpas"
            checked={live.rotAvdrag}
            onChange={(v) =>
              setValue("rotAvdrag", v, {
                shouldDirty: true,
              })
            }
          />
        </CardContent>
      </Card>

      {/* Fakturering */}
      <Card>
        <CardHeader>
          <CardTitle>Faktura & betalning</CardTitle>

          <p className="text-xs text-muted-foreground">
            Bockas av den som sköter fakturering och bokföring.
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <ToggleRow
            id="fakturerat"
            label="Fakturerat"
            checked={live.fakturerat}
            onChange={(v) =>
              setValue("fakturerat", v, {
                shouldDirty: true,
              })
            }
          />

          <ToggleRow
            id="betalt"
            label="Betalt"
            checked={live.betalt}
            onChange={(v) =>
              setValue("betalt", v, {
                shouldDirty: true,
              })
            }
          />
        </CardContent>
      </Card>

      {/* Anteckningar */}
      <Card>
        <CardHeader>
          <CardTitle>Övriga anteckningar</CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            rows={4}
            {...register("anteckningar")}
            placeholder="T.ex. tillval, garanti, kommande arbete..."
          />
        </CardContent>
      </Card>

      {/* Summering */}
      <Card className="border-primary/30">
        <CardContent className="pt-6 space-y-2 text-sm">
          <SumRow
            label="Artiklar totalt"
            value={summering.artiklarSum.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 2,
            })}
          />

          <SumRow
            label="Antal resor"
            value={`${summering.antalResor} st`}
          />

          <SumRow
            label="Total sträcka"
            value={`${summering.totalStracka.toLocaleString(
              "sv-SE"
            )} km`}
          />

          <SumRow
            label="Total avstånd"
            value={`${summering.totalAvstand.toLocaleString(
              "sv-SE"
            )} km`}
          />

          <SumRow
            label="Total arbetstid"
            value={`${summering.totalTimmar.toLocaleString(
              "sv-SE"
            )} h`}
          />

          {live.rotAvdrag && (
            <>
              <Separator />

              <p className="text-xs text-muted-foreground">
                ROT-avdrag markerat — beräknas av den som fakturerar.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>

      {children}

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
      />

      <Label
        htmlFor={id}
        className="font-normal cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
}

function SumRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="tabular-nums font-medium">
        {value}
      </span>
    </div>
  );
}