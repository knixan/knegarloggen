"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { uppdragSchema } from "./uppdrag-schema";
import type { UppdragFormValues } from "./uppdrag-schema";

async function getCompanyId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");

  const company = await prisma.company.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!company) redirect("/mina-sidor/foretag");
  return company.id;
}

export async function skapaUppdrag(data: UppdragFormValues) {
  const companyId = await getCompanyId();
  const parsed = uppdragSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ogiltiga uppgifter" };

  const uppdrag = await prisma.uppdrag.create({
    data: {
      companyId,
      customerId: parsed.data.customerId || null,
      titel: parsed.data.titel,
      beskrivning: parsed.data.beskrivning,
      uppdragsTyp: parsed.data.uppdragsTyp,
      prisTyp: parsed.data.prisTyp,
      timpris: parsed.data.timpris,
      fastPris: parsed.data.fastPris,
      milersattning: parsed.data.milersattning,
      anteckningar: parsed.data.anteckningar,
      utfortArbete: parsed.data.utfortArbete,
      planeratArbete: parsed.data.planeratArbete,
    },
  });

  revalidatePath("/mina-sidor");
  return { ok: true, id: uppdrag.id };
}

export async function uppdateraUppdrag(id: string, data: UppdragFormValues) {
  const companyId = await getCompanyId();
  const parsed = uppdragSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ogiltiga uppgifter" };

  await prisma.uppdrag.updateMany({
    where: { id, companyId },
    data: {
      customerId: parsed.data.customerId || null,
      titel: parsed.data.titel,
      beskrivning: parsed.data.beskrivning,
      uppdragsTyp: parsed.data.uppdragsTyp,
      prisTyp: parsed.data.prisTyp,
      timpris: parsed.data.timpris,
      fastPris: parsed.data.fastPris,
      milersattning: parsed.data.milersattning,
      anteckningar: parsed.data.anteckningar,
      utfortArbete: parsed.data.utfortArbete,
      planeratArbete: parsed.data.planeratArbete,
    },
  });

  revalidatePath("/mina-sidor");
  revalidatePath(`/mina-sidor/uppdrag/${id}/redigera`);
  return { ok: true };
}

export async function uppdateraStatus(id: string, status: string) {
  const companyId = await getCompanyId();
  await prisma.uppdrag.updateMany({ where: { id, companyId }, data: { status } });
  revalidatePath("/mina-sidor");
  return { ok: true };
}

export async function raderaUppdrag(id: string) {
  const companyId = await getCompanyId();
  await prisma.uppdrag.deleteMany({ where: { id, companyId } });
  revalidatePath("/mina-sidor");
  return { ok: true };
}

export async function laggTillArbetspass(
  uppdragId: string,
  datum: string,
  timmar: number,
  beskrivning: string,
) {
  const companyId = await getCompanyId();
  const uppdrag = await prisma.uppdrag.findFirst({ where: { id: uppdragId, companyId } });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };

  await prisma.arbetspass.create({
    data: { uppdragId, datum: new Date(datum), timmar, beskrivning },
  });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaArbetspass(arbetspassId: string, uppdragId: string) {
  await prisma.arbetspass.delete({ where: { id: arbetspassId } });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function laggTillResa(
  uppdragId: string,
  datum: string,
  stracka: number,
  beskrivning: string,
) {
  const companyId = await getCompanyId();
  const uppdrag = await prisma.uppdrag.findFirst({ where: { id: uppdragId, companyId } });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };

  await prisma.resa.create({
    data: { uppdragId, datum: new Date(datum), stracka, beskrivning },
  });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaResa(resaId: string, uppdragId: string) {
  await prisma.resa.delete({ where: { id: resaId } });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function laggTillOvrigKostnad(
  uppdragId: string,
  beskrivning: string,
  pris: number,
) {
  const companyId = await getCompanyId();
  const uppdrag = await prisma.uppdrag.findFirst({ where: { id: uppdragId, companyId } });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };

  await prisma.ovrigKostnad.create({ data: { uppdragId, beskrivning, pris } });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaOvrigKostnad(kostnadId: string, uppdragId: string) {
  await prisma.ovrigKostnad.delete({ where: { id: kostnadId } });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function skapaKund(data: {
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
}) {
  const companyId = await getCompanyId();
  const kund = await prisma.customer.create({
    data: { companyId, ...data },
  });
  revalidatePath("/mina-sidor/kunder");
  return { ok: true, id: kund.id };
}

export async function uppdateraKund(
  id: string,
  data: {
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
  },
) {
  const companyId = await getCompanyId();
  await prisma.customer.updateMany({ where: { id, companyId }, data });
  revalidatePath("/mina-sidor/kunder");
  return { ok: true };
}

export async function raderaKund(id: string) {
  const companyId = await getCompanyId();
  await prisma.customer.deleteMany({ where: { id, companyId } });
  revalidatePath("/mina-sidor/kunder");
  return { ok: true };
}

export async function sparaForetagsinformation(data: {
  namn: string;
  orgNummer: string;
  adress: string;
  postnummer: string;
  stad: string;
  telefon: string;
  epost: string;
  hemsida: string;
  betalningsvillkor: number;
  drojsmalsranta: string;
  fakturaText: string;
  momsregistrerad: boolean;
  momsNummer: string;
  bankgiro: string;
  plusgiro: string;
  swish: string;
  iban: string;
  bic: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  await prisma.company.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  });

  revalidatePath("/mina-sidor/foretag");
  return { ok: true };
}

export async function sparaLogo(logoUrl: string, logoKey: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false };

  await prisma.company.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, logoUrl, logoKey },
    update: { logoUrl, logoKey },
  });

  revalidatePath("/mina-sidor/installningar");
  return { ok: true };
}

export async function raderaKonto() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false };
  await prisma.user.delete({ where: { id: session.user.id } });
  return { ok: true };
}
