"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { stripe } from "./stripe";
import { uppdragSchema, kundSchema, foretagSchema } from "./uppdrag-schema";
import type {
  UppdragFormValues,
  KundInput,
  ForetagInput,
} from "./uppdrag-schema";

const utapi = new UTApi();

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

/** Kunden måste tillhöra det egna företaget – annars kan man koppla in
 *  (och sedan läsa) en annan användares kund via uppdraget/fakturan. */
async function kundTillhorForetag(
  customerId: string | null | undefined,
  companyId: string,
) {
  if (!customerId) return true;
  const kund = await prisma.customer.findFirst({
    where: { id: customerId, companyId },
    select: { id: true },
  });
  return Boolean(kund);
}

/** Bara filer från vår UploadThing-app, med url som matchar nyckeln. */
function isUploadThingUrl(url: string, key: string) {
  if (!key || key.length > 200) return false;
  try {
    const u = new URL(url);
    const hostOk = u.hostname === "utfs.io" || u.hostname.endsWith(".ufs.sh");
    return u.protocol === "https:" && hostOk && u.pathname === `/f/${key}`;
  } catch {
    return false;
  }
}

/** Nycklar som redan används får inte återanvändas – annars kan man
 *  "låna" en annan användares fil och sedan radera den. */
async function nyckelAnvands(key: string) {
  const logo = await prisma.company.findFirst({
    where: { logoKey: key },
    select: { id: true },
  });
  return Boolean(logo);
}

export async function skapaUppdrag(data: UppdragFormValues) {
  const companyId = await getCompanyId();
  const parsed = uppdragSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ogiltiga uppgifter" };
  if (!(await kundTillhorForetag(parsed.data.customerId, companyId))) {
    return { ok: false, error: "Kunden hittades inte" };
  }

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
  if (!(await kundTillhorForetag(parsed.data.customerId, companyId))) {
    return { ok: false, error: "Kunden hittades inte" };
  }

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
  await prisma.uppdrag.updateMany({
    where: { id, companyId },
    data: { status },
  });
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
  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id: uppdragId, companyId },
  });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };

  await prisma.arbetspass.create({
    data: { uppdragId, datum: new Date(datum), timmar, beskrivning },
  });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaArbetspass(
  arbetspassId: string,
  uppdragId: string,
) {
  const companyId = await getCompanyId();
  await prisma.arbetspass.deleteMany({
    where: { id: arbetspassId, uppdragId, uppdrag: { companyId } },
  });
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
  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id: uppdragId, companyId },
  });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };

  await prisma.resa.create({
    data: { uppdragId, datum: new Date(datum), stracka, beskrivning },
  });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaResa(resaId: string, uppdragId: string) {
  const companyId = await getCompanyId();
  await prisma.resa.deleteMany({
    where: { id: resaId, uppdragId, uppdrag: { companyId } },
  });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function laggTillOvrigKostnad(
  uppdragId: string,
  beskrivning: string,
  pris: number,
) {
  const companyId = await getCompanyId();
  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id: uppdragId, companyId },
  });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };

  await prisma.ovrigKostnad.create({ data: { uppdragId, beskrivning, pris } });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaOvrigKostnad(kostnadId: string, uppdragId: string) {
  const companyId = await getCompanyId();
  await prisma.ovrigKostnad.deleteMany({
    where: { id: kostnadId, uppdragId, uppdrag: { companyId } },
  });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function skapaKund(data: KundInput) {
  const companyId = await getCompanyId();
  const parsed = kundSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ogiltiga uppgifter" };

  const kund = await prisma.customer.create({
    data: { ...parsed.data, companyId },
  });
  revalidatePath("/mina-sidor/kunder");
  return { ok: true, id: kund.id };
}

export async function uppdateraKund(id: string, data: KundInput) {
  const companyId = await getCompanyId();
  const parsed = kundSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ogiltiga uppgifter" };

  await prisma.customer.updateMany({
    where: { id, companyId },
    data: parsed.data,
  });
  revalidatePath("/mina-sidor/kunder");
  return { ok: true };
}

export async function raderaKund(id: string) {
  const companyId = await getCompanyId();
  await prisma.customer.deleteMany({ where: { id, companyId } });
  revalidatePath("/mina-sidor/kunder");
  return { ok: true };
}

export async function sparaForetagsinformation(data: ForetagInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false, error: "Inte inloggad" };

  const parsed = foretagSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Ogiltiga uppgifter" };

  await prisma.company.upsert({
    where: { userId: session.user.id },
    create: { ...parsed.data, userId: session.user.id },
    update: parsed.data,
  });

  revalidatePath("/mina-sidor/foretag");
  return { ok: true };
}

export async function sparaLogo(logoUrl: string, logoKey: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false };

  const existing = await prisma.company.findUnique({
    where: { userId: session.user.id },
    select: { logoKey: true },
  });

  if (logoKey !== existing?.logoKey) {
    if (!isUploadThingUrl(logoUrl, logoKey) || (await nyckelAnvands(logoKey))) {
      return { ok: false };
    }
  }

  await prisma.company.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, logoUrl, logoKey },
    update: { logoUrl, logoKey },
  });

  if (existing?.logoKey && existing.logoKey !== logoKey) {
    try {
      await utapi.deleteFiles(existing.logoKey);
    } catch (err) {
      console.error("Kunde inte radera gammal logotyp:", err);
    }
  }

  revalidatePath("/mina-sidor/installningar");
  return { ok: true };
}

export async function raderaKonto() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false };

  const [company, subscription] = await Promise.all([
    prisma.company.findUnique({
      where: { userId: session.user.id },
      select: { logoKey: true },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { stripeSubscriptionId: true },
    }),
  ]);

  if (subscription?.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch (err) {
      console.error("Kunde inte avbryta Stripe-prenumeration:", err);
    }
  }

  await prisma.user.delete({ where: { id: session.user.id } });

  if (company?.logoKey) {
    try {
      await utapi.deleteFiles(company.logoKey);
    } catch (err) {
      console.error("Kunde inte radera filer vid kontoborttagning:", err);
    }
  }

  return { ok: true };
}
