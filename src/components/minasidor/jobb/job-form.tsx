"use client";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Package,
  Tag,
  Store,
  Layers2,
  Receipt,
  StickyNote,
  MapPin,
  Calendar,
  Van,
  Clock,
  ClipboardList,
  CheckCircle2,
  CreditCard,
  NotebookPen,
  TriangleAlert,
  Wrench,
  User,
  UserPlus,
  Search,
  X as XIcon,
} from "lucide-react";

import {
  jobSchema,
  type JobInput,
  beräknaSummering,
  type Customer,
} from "@/lib/job-schema";
import { useUploadThing } from "@/lib/uploadthing-client";
import { ImagePlus, X } from "lucide-react";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  onSubmit: (data: JobInput, bilder: { url: string; key: string }[]) => void;
  defaultValues?: Partial<JobInput>;
  submitLabel?: string;
  isPending?: boolean;
  customers?: Customer[];
}

const idag = () => new Date().toISOString().slice(0, 10);

const tomDefaults: JobInput = {
  customerId: undefined,
  artiklar: [],
  resor: [],
  arbetstider: [],
  ovrigaKostnader: [],
  timpris: 0,
  milersattning: 0,
  rotAvdrag: false,
  pagaende: false,
  utfort: false,
  fakturerat: false,
  betalt: false,
  anteckningar: "",
  utfortArbete: "",
  planeratArbete: "",
  bilder: [],
  fastPris: undefined,
};

export default function JobForm({
  onSubmit,
  defaultValues,
  submitLabel = "Spara jobb",
  isPending = false,
  customers = [],
}: Props) {
  const form = useForm<JobInput>({
    resolver: zodResolver(jobSchema) as Resolver<JobInput>,
    defaultValues: { ...tomDefaults, ...defaultValues },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  const artiklar = useFieldArray({ control, name: "artiklar" });
  const resor = useFieldArray({ control, name: "resor" });
  const arbetstider = useFieldArray({ control, name: "arbetstider" });
  const ovrigaKostnader = useFieldArray({ control, name: "ovrigaKostnader" });

  const live = useWatch({ control }) as Partial<JobInput>;
  const summering = beräknaSummering({ ...tomDefaults, ...live } as JobInput);

  // Kundväljare
  const [kundSok, setKundSok] = useState("");
  const [kundFokus, setKundFokus] = useState(false);
  const kundSokRef = useRef<HTMLInputElement>(null);
  const valdCustomerId = live.customerId;
  const valdKund = customers.find((c) => c.id === valdCustomerId) ?? null;

  const filtradeKunder = kundSok.trim()
    ? customers.filter((c) => {
        const q = kundSok.toLowerCase();
        return (
          c.namn.toLowerCase().includes(q) ||
          (c.foretagsnamn ?? "").toLowerCase().includes(q) ||
          (c.telefon ?? "").includes(q) ||
          (c.epost ?? "").toLowerCase().includes(q)
        );
      })
    : customers;

  // Bilder
  const [bilder, setBilder] = useState<{ url: string; key: string }[]>(
    defaultValues?.bilder ?? [],
  );
  const [laddarUpp, setLaddarUpp] = useState(false);
  const [valdBild, setValdBild] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("jobbBilder");

  async function hanteraFiler(e: React.ChangeEvent<HTMLInputElement>) {
    const filer = Array.from(e.target.files ?? []);
    if (!filer.length) return;
    setLaddarUpp(true);
    try {
      const res = await startUpload(filer);
      if (res) {
        setBilder((prev) => [
          ...prev,
          ...res.map((bild) => ({ url: bild.ufsUrl, key: bild.key })),
        ]);
      }
    } catch {
      toast.error("Bilduppladdning misslyckades. Försök igen.");
    } finally {
      setLaddarUpp(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, bilder))}
      className="space-y-6"
    >
      {/* Kundväljare */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            Kund
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {valdKund ? (
            <div className="flex items-center justify-between rounded-md border bg-muted/30 px-4 py-3">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">
                  {valdKund.typ === "foretag" && valdKund.foretagsnamn
                    ? valdKund.foretagsnamn
                    : valdKund.namn}
                </p>
                <p className="text-xs text-muted-foreground">
                  {valdKund.typ === "foretag" && valdKund.kontaktperson
                    ? `${valdKund.kontaktperson} · `
                    : ""}
                  {valdKund.telefon}
                  {valdKund.telefon && valdKund.epost ? " · " : ""}
                  {valdKund.epost}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setValue("customerId", undefined, { shouldDirty: true });
                  setKundSok("");
                }}
              >
                <XIcon className="h-4 w-4 mr-1" />
                Byt kund
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => kundSokRef.current?.focus()}
                >
                  <User className="h-4 w-4 mr-2" />
                  Befintlig kund
                </Button>
                <a
                  href="/mina-sidor/kunder/ny"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button type="button" variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Skapa ny kund
                  </Button>
                </a>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={kundSokRef}
                    placeholder="Sök på namn, telefon eller e-post..."
                    value={kundSok}
                    onChange={(e) => setKundSok(e.target.value)}
                    onFocus={() => setKundFokus(true)}
                    onBlur={() => setTimeout(() => setKundFokus(false), 150)}
                    className="pl-9"
                  />
                </div>
                {customers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Inga kunder i kundregistret ännu.{" "}
                    <a
                      href="/mina-sidor/kunder/ny"
                      className="underline"
                      target="_blank"
                    >
                      Lägg till en kund
                    </a>
                    .
                  </p>
                ) : (kundSok.trim() || kundFokus) &&
                  filtradeKunder.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Inga kunder matchar sökningen.
                  </p>
                ) : kundSok.trim() || kundFokus ? (
                  <div className="rounded-md border divide-y max-h-60 overflow-y-auto">
                    {filtradeKunder.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setValue("customerId", c.id, { shouldDirty: true });
                          setKundSok("");
                          setKundFokus(false);
                        }}
                      >
                        <p className="text-sm font-medium">
                          {c.typ === "foretag" && c.foretagsnamn
                            ? c.foretagsnamn
                            : c.namn}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.typ === "foretag" && c.kontaktperson
                            ? `${c.kontaktperson} · `
                            : ""}
                          {c.telefon}
                          {c.telefon && c.epost ? " · " : ""}
                          {c.epost}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Artiklar */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            Artiklar
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              artiklar.append({
                namn: "",
                artikelnr: "",
                aterforsaljare: "",
                inkopspris: 0,
                pris: 0,
                antal: 1,
              })
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Lägg till
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
            <div className="col-span-3 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Artikelnamn
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5" />
              Återförsäljare
            </div>
            <div className="col-span-1 flex items-center justify-center gap-1">
              <Layers2 className="h-3.5 w-3.5" />
              Antal
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              Inköpspris
            </div>
            <div className="col-span-2 flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              Utpris (kr)
            </div>
            <div className="col-span-1" />
          </div>
          {artiklar.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-12 sm:col-span-3">
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
              <div className="col-span-12 sm:col-span-2">
                <Input
                  {...register(`artiklar.${i}.aterforsaljare`)}
                  placeholder="Återförsäljare"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Input
                  type="number"
                  step="1"
                  min="1"
                  {...register(`artiklar.${i}.antal`, { valueAsNumber: true })}
                  placeholder="Ant."
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`artiklar.${i}.inkopspris`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Inköpspris"
                />
              </div>
              <div className="col-span-5 sm:col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`artiklar.${i}.pris`, { valueAsNumber: true })}
                  placeholder="Utpris kr"
                />
                {(live.artiklar?.[i]?.pris === 0 ||
                  live.artiklar?.[i]?.pris === undefined) && (
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                    <TriangleAlert className="h-3 w-3" />
                    Utpris ej ifyllt
                  </p>
                )}
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => artiklar.remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Övriga kostnader */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-muted-foreground" />
            Övriga kostnader
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => ovrigaKostnader.append({ beskrivning: "", pris: 0 })}
          >
            <Plus className="mr-1 h-4 w-4" /> Lägg till
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            T.ex. förbrukningsmaterial, hyrd utrustning, parkeringskostnad.
          </p>
          {ovrigaKostnader.fields.length > 0 && (
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
              <div className="col-span-9">Produkt / tjänst</div>
              <div className="col-span-2">Pris (kr)</div>
              <div className="col-span-1" />
            </div>
          )}
          {ovrigaKostnader.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-9">
                <Input
                  {...register(`ovrigaKostnader.${i}.beskrivning`)}
                  placeholder="T.ex. parkeringskostnad, hyrd utrustning..."
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`ovrigaKostnader.${i}.pris`, {
                    valueAsNumber: true,
                  })}
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => ovrigaKostnader.remove(i)}
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
          <CardTitle className="flex items-center gap-2">
            <Van className="h-5 w-5 text-muted-foreground" />
            Resor
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => resor.append({ datum: idag(), stracka: 0 })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Lägg till resa
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {resor.fields.length > 0 && (
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
              <div className="col-span-5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Datum
              </div>
              <div className="col-span-6 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Sträcka (km körd)
              </div>
              <div className="col-span-1" />
            </div>
          )}
          {resor.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-7 sm:col-span-5 space-y-1">
                <Label className="text-xs text-muted-foreground sm:hidden flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Datum
                </Label>
                <Input type="date" {...register(`resor.${i}.datum`)} />
              </div>
              <div className="col-span-4 sm:col-span-6 space-y-1">
                <Label className="text-xs text-muted-foreground sm:hidden flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Sträcka (km)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  {...register(`resor.${i}.stracka`, { valueAsNumber: true })}
                  placeholder="0"
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
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Arbetstid
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => arbetstider.append({ datum: idag(), timmar: 0 })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Lägg till pass
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {arbetstider.fields.length > 0 && (
            <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
              <div className="col-span-5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Datum
              </div>
              <div className="col-span-6 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Antal timmar
              </div>
              <div className="col-span-1" />
            </div>
          )}
          {arbetstider.fields.map((field, i) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-7 sm:col-span-5 space-y-1">
                <Label className="text-xs text-muted-foreground sm:hidden flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Datum
                </Label>
                <Input type="date" {...register(`arbetstider.${i}.datum`)} />
              </div>
              <div className="col-span-4 sm:col-span-6 space-y-1">
                <Label className="text-xs text-muted-foreground sm:hidden flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Timmar
                </Label>
                <Input
                  type="number"
                  step="0.25"
                  min="0"
                  {...register(`arbetstider.${i}.timmar`, {
                    valueAsNumber: true,
                  })}
                  placeholder="t.ex. 7.5"
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

      {/* Planera arbete & Bilder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Planera arbete & Bilder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={4}
            {...register("planeratArbete")}
            placeholder="Vad ska göras? T.ex. byta rör i kök, dra el till garage..."
          />
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <ImagePlus className="h-3.5 w-3.5 text-muted-foreground" />
              Bilder
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={hanteraFiler}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={laddarUpp}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mr-1 h-4 w-4" />
              {laddarUpp ? "Laddar upp..." : "Lägg till bilder"}
            </Button>
            {bilder.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {bilder.map((bild) => (
                  <div key={bild.key} className="relative group aspect-square">
                    <Image
                      src={bild.url}
                      alt="Jobbild"
                      fill
                      sizes="(max-width: 640px) 33vw, 200px"
                      className="object-cover rounded-md cursor-pointer"
                      onClick={() => setValdBild(bild.url)}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setBilder((prev) =>
                          prev.filter((b) => b.key !== bild.key),
                        )
                      }
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Utfört arbete */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-muted-foreground" />
            Utfört arbete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            {...register("utfortArbete")}
            placeholder="Beskriv vad som har gjorts i projektet..."
          />
        </CardContent>
      </Card>

      {/* Prissättning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            Prissättning
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Används för att räkna ut kostnader för arbetstid och resor.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Timpris (kr/h)"
              icon={<Clock className="h-3.5 w-3.5" />}
            >
              <Input
                type="number"
                step="50"
                min="0"
                {...register("timpris", { valueAsNumber: true })}
                placeholder="t.ex. 950"
              />
            </Field>
            <Field
              label="Milersättning (kr/km)"
              icon={<Van className="h-3.5 w-3.5" />}
            >
              <Input
                type="number"
                step="0.5"
                min="0"
                {...register("milersattning", { valueAsNumber: true })}
                placeholder="t.ex. 25"
              />
            </Field>
          </div>
          <div className="border-t pt-4 space-y-3">
            <ToggleRow
              id="fast-pris"
              label="Fakturera fast pris (åsidosätter beräknad summa på fakturan)"
              checked={
                !!(live.fastPris !== undefined && live.fastPris !== null)
              }
              onChange={(v) => {
                if (v) {
                  setValue("fastPris", 0, { shouldDirty: true });
                } else {
                  setValue("fastPris", undefined, { shouldDirty: true });
                }
              }}
            />
            {live.fastPris !== undefined && live.fastPris !== null && (
              <Field
                label="Fast pris exkl. moms (kr)"
                icon={<Receipt className="h-3.5 w-3.5" />}
              >
                <Input
                  type="number"
                  step="100"
                  min="0"
                  {...register("fastPris", { valueAsNumber: true })}
                  placeholder="t.ex. 15000"
                />
              </Field>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            Hantverkarens status
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Välj aktuell status för jobbet.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            id="ej-paborjat"
            label="Ej påbörjat"
            checked={!(live.pagaende ?? false) && !(live.utfort ?? false)}
            onChange={() => {
              setValue("pagaende", false, { shouldDirty: true });
              setValue("utfort", false, { shouldDirty: true });
            }}
          />
          <ToggleRow
            id="pagaende"
            label="Pågående"
            checked={(live.pagaende ?? false) && !(live.utfort ?? false)}
            onChange={() => {
              setValue("pagaende", true, { shouldDirty: true });
              setValue("utfort", false, { shouldDirty: true });
            }}
          />
          <ToggleRow
            id="utfort"
            label="Jobb utfört och klart"
            checked={live.utfort ?? false}
            onChange={() => {
              setValue("utfort", true, { shouldDirty: true });
              setValue("pagaende", false, { shouldDirty: true });
            }}
          />
        </CardContent>
      </Card>

      {/* Fakturering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Faktura &amp; betalning
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Bockas av den som sköter fakturering och bokföring.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <ToggleRow
            id="rot"
            label="ROT-avdrag ska tillämpas"
            checked={live.rotAvdrag ?? false}
            onChange={(v) => setValue("rotAvdrag", v, { shouldDirty: true })}
          />
          <ToggleRow
            id="fakturerat"
            label="Fakturerat"
            checked={live.fakturerat ?? false}
            onChange={(v) => setValue("fakturerat", v, { shouldDirty: true })}
          />
          <ToggleRow
            id="betalt"
            label="Betalt"
            checked={live.betalt ?? false}
            onChange={(v) => setValue("betalt", v, { shouldDirty: true })}
          />
        </CardContent>
      </Card>

      {/* Anteckningar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-muted-foreground" />
            Övriga anteckningar
          </CardTitle>
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
          {live.artiklar?.some((a) => !a.pris) && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pb-1 flex items-center gap-1.5">
              <TriangleAlert className="h-3.5 w-3.5" />
              En eller flera artiklar saknar pris — totalsumman är inte
              komplett.
            </p>
          )}
          <SumRow
            label="Artiklar"
            icon={<Package className="h-3.5 w-3.5" />}
            value={summering.artiklarSum.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 0,
            })}
          />
          {summering.ovrigaSum > 0 && (
            <SumRow
              label="Övriga kostnader"
              icon={<StickyNote className="h-3.5 w-3.5" />}
              value={summering.ovrigaSum.toLocaleString("sv-SE", {
                style: "currency",
                currency: "SEK",
                maximumFractionDigits: 0,
              })}
            />
          )}
          <SumRow
            label={`Arbetstid (${summering.totalTimmar} h × ${summering.timpris} kr/h)`}
            icon={<Clock className="h-3.5 w-3.5" />}
            value={summering.arbetstidSum.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 0,
            })}
          />
          <SumRow
            label={`Resor (${summering.totalStracka} km × ${summering.milersattning} kr/km)`}
            icon={<Van className="h-3.5 w-3.5" />}
            value={summering.resorSum.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 0,
            })}
          />
          <Separator />
          <SumRow
            label="Totalt exkl. moms"
            icon={<Receipt className="h-3.5 w-3.5" />}
            value={summering.totalExklMoms.toLocaleString("sv-SE", {
              style: "currency",
              currency: "SEK",
              maximumFractionDigits: 0,
            })}
          />
          {live.rotAvdrag && (
            <>
              <Separator />
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                ROT-avdrag markerat — beräknas av den som fakturerar.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sparar..." : submitLabel}
        </Button>
      </div>

      {valdBild && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setValdBild(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[90vh] aspect-auto">
            <button
              type="button"
              className="absolute -top-10 right-0 text-white"
              onClick={() => setValdBild(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <Image
              src={valdBild}
              alt="Förstorad bild"
              width={1200}
              height={900}
              className="object-contain w-full h-full rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
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
      <Label htmlFor={id} className="font-normal cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

function SumRow({
  label,
  icon,
  value,
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}
