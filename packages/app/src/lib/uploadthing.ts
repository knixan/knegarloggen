import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { hasActiveSubscription } from "./subscription";

const f = createUploadthing();

// Uppladdning kostar lagring – kräver inloggning och aktiv prenumeration.
async function requireActiveUser(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) throw new UploadThingError("Inte inloggad");
  if (!(await hasActiveSubscription(session.user.id))) {
    throw new UploadThingError("Provperioden har gått ut");
  }
  return { userId: session.user.id };
}

// Registrerar filen med vem som laddade upp den. Server actions godkänner
// bara registrerade, egna filer (validateNewUploads), och städningen
// (api/cron/stada-uppladdningar) rör bara filer som finns i tabellen –
// apparna delar UploadThing-app.
async function registrera({
  metadata,
  file,
}: {
  metadata: { userId: string };
  file: { key: string; ufsUrl: string };
}) {
  await prisma.uppladdning.upsert({
    where: { key: file.key },
    create: { key: file.key, url: file.ufsUrl, userId: metadata.userId },
    update: {},
  });
  return { key: file.key };
}

export const ourFileRouter = {
  jobbBilder: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => requireActiveUser(req))
    .onUploadComplete(registrera),

  companyLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => requireActiveUser(req))
    .onUploadComplete(registrera),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
