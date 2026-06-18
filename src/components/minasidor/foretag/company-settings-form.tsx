"use client";

import * as React from "react";
import Image from "next/image";
import { useState, useRef, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  Building2,
  MapPinned,
  Hash,
  Phone,
  Mail,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  FileText,
  ImagePlus,
  X,
  CalendarClock,
  Percent,
  ListOrdered,
} from "lucide-react";

import { useUploadThing } from "@/lib/uploadthing-client";
import {
  updateCompanySettings,
  updateCompanyLogo,
  type CompanyInput,
} from "@/lib/job-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanySettings extends CompanyInput {
  id: string;
  logoUrl: string;
  logoKey: string;
}

interface Props {
  company: CompanySettings;
}

export default function CompanySettingsForm({ company }: Props) {
  const [isPending, startTransition] = useTransition();
  const [logo, setLogo] = useState<{ url: string; key: string } | null>(
    company.logoUrl && company.logoKey
      ? { url: company.logoUrl, key: company.logoKey }
      : null,
  );
  const [laddarUppLogga, setLaddarUppLogga] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing("companyLogo");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CompanyInput>({
    defaultValues: {
      name: company.name,
      orgNummer: company.orgNummer,
      adress: company.adress,
      postnummer: company.postnummer,
      ort: company.ort,
      telefon: company.telefon,
      epost: company.epost,
      fSkatt: company.fSkatt,
      momsNummer: company.momsNummer,
      bankgiro: company.bankgiro,
      plusgiro: company.plusgiro,
      swish: company.swish,
      nastaFakturanummer: company.nastaFakturanummer,
      forfallodagar: company.forfallodagar,
      drojsmalsranta: company.drojsmalsranta,
      fakturatext: company.fakturatext,
    },
  });

  const fSkattWatch = useWatch({ control, name: "fSkatt" });
  const fSkatt =
    typeof fSkattWatch === "boolean" ? fSkattWatch : company.fSkatt;

  async function hanteraLoggaFil(e: React.ChangeEvent<HTMLInputElement>) {
    const filer = Array.from(e.target.files ?? []);
    if (!filer.length) return;
    setLaddarUppLogga(true);
    const res = await startUpload(filer);
    if (res && res[0]) {
      const ny = { url: res[0].ufsUrl, key: res[0].key };
      setLogo(ny);
      const result = await updateCompanyLogo(ny);
      if (result.ok) {
        toast.success("Logotyp uppdaterad");
      } else {
        toast.error(result.error ?? "Kunde inte spara logotyp");
      }
    }
    setLaddarUppLogga(false);
  }

  async function taBortLogga() {
    setLogo(null);
    const result = await updateCompanyLogo(null);
    if (result.ok) {
      toast.success("Logotyp borttagen");
    } else {
      toast.error(result.error ?? "Kunde inte ta bort logotyp");
    }
  }

  function onSubmit(data: CompanyInput) {
    startTransition(async () => {
      const result = await updateCompanySettings(data);
      if (result.ok) {
        toast.success("Företagsuppgifter sparade");
      } else {
        toast.error(result.error ?? "Kunde inte spara företagsuppgifter");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Logotyp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
            Logotyp
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Visas på fakturor och PDF-underlag. Om ingen logotyp laddas upp
            visas företagsnamnet istället.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={hanteraLoggaFil}
          />

          {logo ? (
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={logo.url}
                  alt="Företagslogotyp"
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={laddarUppLogga}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {laddarUppLogga ? "Laddar upp..." : "Byt logotyp"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={taBortLogga}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="mr-1 h-4 w-4" />
                  Ta bort
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={laddarUppLogga}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mr-1 h-4 w-4" />
              {laddarUppLogga ? "Laddar upp..." : "Ladda upp logotyp"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Företagsuppgifter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Företagsuppgifter
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Företagsnamn"
            icon={<Building2 className="h-3.5 w-3.5" />}
            error={errors.name?.message}
          >
            <Input
              {...register("name", { required: "Företagsnamn krävs" })}
              placeholder="Mitt Företag AB"
            />
          </Field>

          <Field
            label="Organisationsnummer"
            icon={<Hash className="h-3.5 w-3.5" />}
          >
            <Input {...register("orgNummer")} placeholder="556677-8899" />
          </Field>

          <Field label="Adress" icon={<MapPinned className="h-3.5 w-3.5" />}>
            <Input {...register("adress")} placeholder="Storgatan 1" />
          </Field>

          <Field
            label="Postnummer"
            icon={<MapPinned className="h-3.5 w-3.5" />}
          >
            <Input {...register("postnummer")} placeholder="123 45" />
          </Field>

          <Field label="Ort" icon={<MapPinned className="h-3.5 w-3.5" />}>
            <Input {...register("ort")} placeholder="Stockholm" />
          </Field>

          <Field label="Telefonnummer" icon={<Phone className="h-3.5 w-3.5" />}>
            <Input {...register("telefon")} placeholder="070-123 45 67" />
          </Field>

          <Field label="E-postadress" icon={<Mail className="h-3.5 w-3.5" />}>
            <Input
              type="email"
              {...register("epost")}
              placeholder="info@mittforetag.se"
            />
          </Field>

          <Field
            label="Momsregistreringsnummer (VAT)"
            icon={<Receipt className="h-3.5 w-3.5" />}
          >
            <Input {...register("momsNummer")} placeholder="SE556677889901" />
          </Field>

          <div className="flex items-center gap-3 pt-2 sm:col-span-2">
            <Checkbox
              id="fSkatt"
              checked={fSkatt}
              onCheckedChange={(v) =>
                setValue("fSkatt", Boolean(v), { shouldDirty: true })
              }
            />
            <Label htmlFor="fSkatt" className="font-normal cursor-pointer">
              Innehar F-skatt
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Betalningsuppgifter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Betalningsuppgifter
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Fyll i de betalsätt du erbjuder kunder. Lämna tomt om de inte
            används.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Bankgiro" icon={<Banknote className="h-3.5 w-3.5" />}>
            <Input {...register("bankgiro")} placeholder="123-4567" />
          </Field>

          <Field label="Plusgiro" icon={<Banknote className="h-3.5 w-3.5" />}>
            <Input {...register("plusgiro")} placeholder="12 34 56-7" />
          </Field>

          <Field
            label="Swish-nummer"
            icon={<Smartphone className="h-3.5 w-3.5" />}
          >
            <Input {...register("swish")} placeholder="123 456 78 90" />
          </Field>
        </CardContent>
      </Card>

      {/* Fakturainställningar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Fakturainställningar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Nästa fakturanummer"
              icon={<ListOrdered className="h-3.5 w-3.5" />}
            >
              <Input
                type="number"
                step="1"
                min="1"
                {...register("nastaFakturanummer", { valueAsNumber: true })}
                placeholder="1"
              />
            </Field>

            <Field
              label="Standard förfallodagar"
              icon={<CalendarClock className="h-3.5 w-3.5" />}
            >
              <Input
                type="number"
                step="1"
                min="0"
                {...register("forfallodagar", { valueAsNumber: true })}
                placeholder="30"
              />
            </Field>

            <Field
              label="Dröjsmålsränta (%)"
              icon={<Percent className="h-3.5 w-3.5" />}
            >
              <Input
                type="number"
                step="0.1"
                min="0"
                {...register("drojsmalsranta", { valueAsNumber: true })}
                placeholder="8"
              />
            </Field>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Standardtext på fakturor
            </Label>
            <Textarea
              rows={3}
              {...register("fakturatext")}
              placeholder="T.ex. Tack för att du anlitade oss! Vid frågor om fakturan, kontakta oss på..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Sparar..." : "Spara företagsuppgifter"}
        </Button>
      </div>
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
