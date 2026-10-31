-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activeOrganizationId" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgNummer" TEXT NOT NULL DEFAULT '',
    "adress" TEXT NOT NULL DEFAULT '',
    "postnummer" TEXT NOT NULL DEFAULT '',
    "ort" TEXT NOT NULL DEFAULT '',
    "telefon" TEXT NOT NULL DEFAULT '',
    "epost" TEXT NOT NULL DEFAULT '',
    "fSkatt" BOOLEAN NOT NULL DEFAULT false,
    "momsNummer" TEXT NOT NULL DEFAULT '',
    "bankgiro" TEXT NOT NULL DEFAULT '',
    "plusgiro" TEXT NOT NULL DEFAULT '',
    "swish" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT NOT NULL DEFAULT '',
    "logoKey" TEXT NOT NULL DEFAULT '',
    "nastaFakturanummer" INTEGER NOT NULL DEFAULT 1,
    "forfallodagar" INTEGER NOT NULL DEFAULT 30,
    "drojsmalsranta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fakturatext" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "typ" TEXT NOT NULL DEFAULT 'privat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "namn" TEXT NOT NULL,
    "adress" TEXT NOT NULL DEFAULT '',
    "postnummer" TEXT NOT NULL DEFAULT '',
    "ort" TEXT NOT NULL DEFAULT '',
    "telefon" TEXT NOT NULL DEFAULT '',
    "epost" TEXT NOT NULL DEFAULT '',
    "personnummer" TEXT NOT NULL DEFAULT '',
    "foretagsnamn" TEXT NOT NULL DEFAULT '',
    "kontaktperson" TEXT NOT NULL DEFAULT '',
    "orgNummer" TEXT NOT NULL DEFAULT '',
    "fastighetsbeteckning" TEXT NOT NULL DEFAULT '',
    "lagenhetsnummer" TEXT NOT NULL DEFAULT '',
    "bostadsrattsforening" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "customerId" TEXT,
    "skatteavdrag" BOOLEAN NOT NULL DEFAULT false,
    "pagaende" BOOLEAN NOT NULL DEFAULT false,
    "utfort" BOOLEAN NOT NULL DEFAULT false,
    "fakturerat" BOOLEAN NOT NULL DEFAULT false,
    "betalt" BOOLEAN NOT NULL DEFAULT false,
    "fakturanummer" INTEGER,
    "timpris" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "milersattning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fastPris" DOUBLE PRECISION,
    "anteckningar" TEXT NOT NULL DEFAULT '',
    "utfortArbete" TEXT NOT NULL DEFAULT '',
    "planeratArbete" TEXT NOT NULL DEFAULT '',
    "skapad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "namn" TEXT NOT NULL,
    "artikelnr" TEXT NOT NULL DEFAULT '',
    "aterforsaljare" TEXT NOT NULL DEFAULT '',
    "inkopspris" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pris" DOUBLE PRECISION NOT NULL,
    "antal" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "datum" DATE NOT NULL,
    "stracka" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_session" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "datum" DATE NOT NULL,
    "timmar" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "work_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_image" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'trialing',
    "trialEnd" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ovrig_kostnad" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "beskrivning" TEXT NOT NULL,
    "pris" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ovrig_kostnad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "company_ownerId_key" ON "company"("ownerId");

-- CreateIndex
CREATE INDEX "customer_companyId_idx" ON "customer"("companyId");

-- CreateIndex
CREATE INDEX "job_companyId_idx" ON "job"("companyId");

-- CreateIndex
CREATE INDEX "job_customerId_idx" ON "job"("customerId");

-- CreateIndex
CREATE INDEX "job_companyId_fakturerat_idx" ON "job"("companyId", "fakturerat");

-- CreateIndex
CREATE INDEX "job_companyId_betalt_idx" ON "job"("companyId", "betalt");

-- CreateIndex
CREATE INDEX "article_jobId_idx" ON "article"("jobId");

-- CreateIndex
CREATE INDEX "trip_jobId_idx" ON "trip"("jobId");

-- CreateIndex
CREATE INDEX "work_session_jobId_idx" ON "work_session"("jobId");

-- CreateIndex
CREATE INDEX "job_image_jobId_idx" ON "job_image"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeCustomerId_key" ON "subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeSubscriptionId_key" ON "subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "ovrig_kostnad_jobId_idx" ON "ovrig_kostnad"("jobId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip" ADD CONSTRAINT "trip_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_session" ADD CONSTRAINT "work_session_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_image" ADD CONSTRAINT "job_image_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ovrig_kostnad" ADD CONSTRAINT "ovrig_kostnad_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

