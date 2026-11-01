import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { prisma } from "../../../../lib/prisma";
import { env } from "../../../../lib/env";

// Raderar filer som laddats upp men aldrig kopplats till ett jobb eller en
// logga (t.ex. formulär som avbrutits). Körs av Vercel Cron (vercel.json),
// som skickar "Authorization: Bearer <CRON_SECRET>".
//
// Rör BARA filer i den här appens tabell Uppladdning – apparna delar
// UploadThing-app, så en städning av "allt som inte används här" skulle
// radera de andra apparnas filer.

const ALDER_MS = 24 * 60 * 60 * 1000;
const BATCH = 500;

export async function GET(request: NextRequest) {
  if (
    !env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Ej behörig" }, { status: 401 });
  }

  const gamla = await prisma.uppladdning.findMany({
    where: { createdAt: { lt: new Date(Date.now() - ALDER_MS) } },
    select: { key: true },
    take: BATCH,
  });
  const keys = gamla.map((u) => u.key);
  if (keys.length === 0) return NextResponse.json({ raderade: 0 });

  const [bilder, loggor] = await Promise.all([
    prisma.jobImage.findMany({
      where: { key: { in: keys } },
      select: { key: true },
    }),
    prisma.company.findMany({
      where: { logoKey: { in: keys } },
      select: { logoKey: true },
    }),
  ]);
  const anvands = new Set([
    ...bilder.map((b) => b.key),
    ...loggor.map((c) => c.logoKey),
  ]);
  const oanvanda = keys.filter((k) => !anvands.has(k));

  // Filer som är kopplade behöver inte stå kvar i tabellen – annars fastnar
  // städningen på samma äldsta rader varje gång.
  if (anvands.size > 0) {
    await prisma.uppladdning.deleteMany({
      where: { key: { in: [...anvands] } },
    });
  }
  if (oanvanda.length === 0) return NextResponse.json({ raderade: 0 });

  try {
    await new UTApi().deleteFiles(oanvanda);
  } catch (err) {
    console.error("Städning av uppladdningar misslyckades:", err);
    return NextResponse.json({ error: "Kunde inte radera" }, { status: 500 });
  }
  await prisma.uppladdning.deleteMany({ where: { key: { in: oanvanda } } });

  return NextResponse.json({ raderade: oanvanda.length });
}
