"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { stripe } from "./stripe";
import {
  uppdragSchema,
  kundSchema,
  foretagSchema,
  arbetspassSchema,
  resaSchema,
  ovrigKostnadSchema,
  UPPDRAG_STATUSAR,
} from "./uppdrag-schema";
import { hasActiveSubscription } from "./subscription";
import type {
  UppdragFormValues,
  KundInput,
  ForetagInput,
} from "./uppdrag-schema";

const utapi = new UTApi();

const SUBSCRIPTION_EXPIRED =
  "Provperioden har gått ut – aktivera en prenumeration för att fortsätta";

// Alla skrivande actions kräver aktiv prenumeration/provperiod. TrialGate
// döljer bara gränssnittet – det är den här kontrollen som skyddar.
// Undantag: raderaKonto (man ska alltid kunna ta bort sitt konto).

async function getCompanyId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/logga-in");
  if (!(await hasActiveSubscription(session.user.id))) {
    redirect("/mina-sidor/installningar");
  }

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
  const [logo, bild] = await Promise.all([
    prisma.company.findFirst({ where: { logoKey: key }, select: { id: true } }),
    prisma.uppdragImage.findFirst({ where: { key }, select: { id: true } }),
  ]);
  return Boolean(logo || bild);
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
      rutAvdrag: parsed.data.rutAvdrag,
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
      rutAvdrag: parsed.data.rutAvdrag,
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
  if (!(UPPDRAG_STATUSAR as readonly string[]).includes(status)) {
    return { ok: false, error: "Ogiltig status" };
  }
  await prisma.uppdrag.updateMany({
    where: { id, companyId },
    data: { status },
  });
  revalidatePath("/mina-sidor");
  return { ok: true };
}

export async function raderaUppdrag(id: string) {
  const companyId = await getCompanyId();

  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id, companyId },
    select: { images: { select: { key: true } } },
  });

  await prisma.uppdrag.deleteMany({ where: { id, companyId } });

  if (uppdrag && uppdrag.images.length > 0) {
    try {
      await utapi.deleteFiles(uppdrag.images.map((img) => img.key));
    } catch (err) {
      console.error(
        "Kunde inte radera bilder vid borttagning av uppdrag:",
        err,
      );
    }
  }

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

  const parsed = arbetspassSchema.safeParse({ datum, timmar, beskrivning });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter",
    };
  }

  await prisma.arbetspass.create({
    data: {
      uppdragId,
      ...parsed.data,
      datum: new Date(`${parsed.data.datum}T00:00:00Z`),
    },
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

  const parsed = resaSchema.safeParse({ datum, stracka, beskrivning });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter",
    };
  }

  await prisma.resa.create({
    data: {
      uppdragId,
      ...parsed.data,
      datum: new Date(`${parsed.data.datum}T00:00:00Z`),
    },
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

  const parsed = ovrigKostnadSchema.safeParse({ beskrivning, pris });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Ogiltiga uppgifter",
    };
  }

  await prisma.ovrigKostnad.create({ data: { uppdragId, ...parsed.data } });
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

export async function reserverFakturanummer(
  uppdragId: string,
): Promise<{ ok: true; nummer: number } | { ok: false; error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { ok: false, error: "Inte inloggad" };
  if (!(await hasActiveSubscription(session.user.id))) {
    return { ok: false, error: SUBSCRIPTION_EXPIRED };
  }

  try {
    const nummer = await prisma.$transaction(async (tx) => {
      const company = await tx.company.findUnique({
        where: { userId: session.user.id },
      });
      if (!company) throw new Error("Inget företag hittat");

      const uppdrag = await tx.uppdrag.findFirst({
        where: { id: uppdragId, companyId: company.id },
        select: { fakturaNummer: true },
      });
      if (!uppdrag) throw new Error("Uppdrag hittades inte");

      if (uppdrag.fakturaNummer) return uppdrag.fakturaNummer;

      // Atomärt: låser raden och returnerar gamla värdet i en enda SQL-sats,
      // vilket förhindrar race conditions vid parallella anrop.
      const result = await tx.$queryRaw<[{ nummer: number }]>`
        UPDATE company
        SET "nextFakturaNummer" = "nextFakturaNummer" + 1
        WHERE id = ${company.id}
        RETURNING "nextFakturaNummer" - 1 AS nummer
      `;
      const n = result[0]?.nummer;
      if (n == null) throw new Error("Kunde inte reservera fakturanummer");

      await tx.uppdrag.update({
        where: { id: uppdragId },
        data: { fakturaNummer: n },
      });
      return n;
    });
    return { ok: true, nummer };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Okänt fel",
    };
  }
}

export async function laggTillBild(
  uppdragId: string,
  url: string,
  key: string,
) {
  const companyId = await getCompanyId();
  const uppdrag = await prisma.uppdrag.findFirst({
    where: { id: uppdragId, companyId },
  });
  if (!uppdrag) return { ok: false, error: "Uppdrag hittades inte" };
  if (!isUploadThingUrl(url, key) || (await nyckelAnvands(key))) {
    return { ok: false, error: "Ogiltig bild" };
  }

  await prisma.uppdragImage.create({ data: { uppdragId, url, key } });
  revalidatePath(`/mina-sidor/uppdrag/${uppdragId}/redigera`);
  return { ok: true };
}

export async function raderaBild(bildId: string, uppdragId: string) {
  const companyId = await getCompanyId();

  const bild = await prisma.uppdragImage.findFirst({
    where: { id: bildId, uppdragId, uppdrag: { companyId } },
    select: { key: true },
  });
  if (!bild) return { ok: false, error: "Bild hittades inte" };

  await prisma.uppdragImage.deleteMany({
    where: { id: bildId, uppdragId, uppdrag: { companyId } },
  });

  try {
    await utapi.deleteFiles(bild.key);
  } catch (err) {
    console.error("Kunde inte radera bild:", err);
  }

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
  if (!(await hasActiveSubscription(session.user.id))) {
    return { ok: false, error: SUBSCRIPTION_EXPIRED };
  }

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
  if (!(await hasActiveSubscription(session.user.id))) {
    return { ok: false, error: SUBSCRIPTION_EXPIRED };
  }

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
      select: {
        logoKey: true,
        uppdrag: { select: { images: { select: { key: true } } } },
      },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { stripeSubscriptionId: true },
    }),
  ]);

  const keys: string[] = [];
  if (company?.logoKey) keys.push(company.logoKey);
  company?.uppdrag.forEach((u) =>
    u.images.forEach((img) => keys.push(img.key)),
  );

  // Avbryt prenumerationen först. Misslyckas det får kontot inte raderas –
  // då skulle Stripe fortsätta dra pengar utan att kunden kan logga in.
  if (subscription?.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    } catch (err) {
      console.error("Kunde inte avbryta Stripe-prenumeration:", err);
      return {
        ok: false,
        error:
          "Kunde inte avsluta prenumerationen. Försök igen eller kontakta support.",
      };
    }
  }

  await prisma.user.delete({ where: { id: session.user.id } });

  if (keys.length > 0) {
    try {
      await utapi.deleteFiles(keys);
    } catch (err) {
      console.error("Kunde inte radera filer vid kontoborttagning:", err);
    }
  }

  return { ok: true };
}
