"use client";

import * as React from "react";
import { z } from "zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPinned,
  Hash,
  IdCard,
  Home,
  Users,
  Key,
} from "lucide-react";

import { createCustomer, updateCustomer } from "@/lib/job-actions";
import { customerSchema } from "@/lib/job-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CustomerFormInput = z.input<typeof customerSchema>;
type CustomerFormOutput = z.output<typeof customerSchema>;

interface Props {
  defaultValues?: Partial<CustomerFormInput> & { id?: string };
  mode: "create" | "edit";
}

export default function CustomerForm({ defaultValues, mode }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormInput, unknown, CustomerFormOutput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      typ: "privat",
      namn: "",
      adress: "",
      postnummer: "",
      ort: "",
      telefon: "",
      epost: "",
      personnummer: "",
      foretagsnamn: "",
      kontaktperson: "",
      orgNummer: "",
      fastighetsbeteckning: "",
      lagenhetsnummer: "",
      bostadsrattsforening: "",
      ...defaultValues,
    },
  });

  const typ = useWatch({ control, name: "typ" });
  const arPrivat = typ === "privat";

  async function onSubmit(data: CustomerFormOutput) {
    startTransition(async () => {
      const result =
        mode === "edit" && defaultValues?.id
          ? await updateCustomer(defaultValues.id, data)
          : await createCustomer(data);

      if (result.ok) {
        toast.success(mode === "edit" ? "Kund uppdaterad" : "Kund sparad");
        router.push("/mina-sidor/kunder");
      } else {
        toast.error(result.error ?? "Något gick fel");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Typ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Kundtyp
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="privat"
              {...register("typ")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Privatperson</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="foretag"
              {...register("typ")}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Företagskund</span>
          </label>
        </CardContent>
      </Card>

      {/* Kontaktuppgifter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            {arPrivat ? "Personuppgifter" : "Företagsuppgifter"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Namn *"
            icon={<User className="h-3.5 w-3.5" />}
            error={errors.namn?.message}
          >
            <Input
              {...register("namn")}
              placeholder={
                arPrivat ? "Anna Andersson" : "Kontaktpersonens namn"
              }
            />
          </Field>

          {!arPrivat && (
            <>
              <Field
                label="Företagsnamn"
                icon={<Building2 className="h-3.5 w-3.5" />}
              >
                <Input
                  {...register("foretagsnamn")}
                  placeholder="Svensson AB"
                />
              </Field>
              <Field
                label="Kontaktperson"
                icon={<User className="h-3.5 w-3.5" />}
              >
                <Input
                  {...register("kontaktperson")}
                  placeholder="Anna Andersson"
                />
              </Field>
              <Field
                label="Organisationsnummer"
                icon={<Hash className="h-3.5 w-3.5" />}
              >
                <Input {...register("orgNummer")} placeholder="556677-8899" />
              </Field>
            </>
          )}

          {arPrivat && (
            <Field
              label="Personnummer"
              icon={<IdCard className="h-3.5 w-3.5" />}
            >
              <Input
                {...register("personnummer")}
                placeholder="ÅÅÅÅMMDD-XXXX"
              />
            </Field>
          )}

          <Field
            label="Telefon"
            icon={<Phone className="h-3.5 w-3.5" />}
            error={errors.telefon?.message}
          >
            <Input {...register("telefon")} placeholder="070-123 45 67" />
          </Field>

          <Field
            label="E-post"
            icon={<Mail className="h-3.5 w-3.5" />}
            error={errors.epost?.message}
          >
            <Input
              type="email"
              {...register("epost")}
              placeholder="anna@exempel.se"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Adress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-muted-foreground" />
            Adress
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Gatuadress"
              icon={<MapPinned className="h-3.5 w-3.5" />}
            >
              <Input {...register("adress")} placeholder="Storgatan 1" />
            </Field>
          </div>
          <Field
            label="Postnummer"
            icon={<MapPinned className="h-3.5 w-3.5" />}
          >
            <Input {...register("postnummer")} placeholder="123 45" />
          </Field>
          <Field label="Ort" icon={<MapPinned className="h-3.5 w-3.5" />}>
            <Input {...register("ort")} placeholder="Stockholm" />
          </Field>
        </CardContent>
      </Card>

      {/* ROT-uppgifter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-muted-foreground" />
            ROT-uppgifter
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Fyll i om kunden kan nyttja ROT-avdrag.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Fastighetsbeteckning"
            icon={<Home className="h-3.5 w-3.5" />}
          >
            <Input
              {...register("fastighetsbeteckning")}
              placeholder="Berga 1:23"
            />
          </Field>
          <Field label="Lägenhetsnummer" icon={<Key className="h-3.5 w-3.5" />}>
            <Input {...register("lagenhetsnummer")} placeholder="1101" />
          </Field>
          <div className="sm:col-span-2">
            <Field
              label="Bostadsrättsförening"
              icon={<Building2 className="h-3.5 w-3.5" />}
            >
              <Input
                {...register("bostadsrattsforening")}
                placeholder="BRF Solrosen"
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Avbryt
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Sparar..."
            : mode === "edit"
              ? "Uppdatera kund"
              : "Spara kund"}
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
