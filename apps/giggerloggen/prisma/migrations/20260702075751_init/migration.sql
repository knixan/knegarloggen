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
    "activeOrganizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "userId" TEXT NOT NULL,
    "namn" TEXT NOT NULL DEFAULT '',
    "orgNummer" TEXT NOT NULL DEFAULT '',
    "adress" TEXT NOT NULL DEFAULT '',
    "postnummer" TEXT NOT NULL DEFAULT '',
    "stad" TEXT NOT NULL DEFAULT '',
    "telefon" TEXT NOT NULL DEFAULT '',
    "epost" TEXT NOT NULL DEFAULT '',
    "hemsida" TEXT NOT NULL DEFAULT '',
    "nextFakturaNummer" INTEGER NOT NULL DEFAULT 1,
    "betalningsvillkor" INTEGER NOT NULL DEFAULT 30,
    "drojsmalsranta" TEXT NOT NULL DEFAULT '8%',
    "fakturaText" TEXT NOT NULL DEFAULT '',
    "momsregistrerad" BOOLEAN NOT NULL DEFAULT false,
    "momsNummer" TEXT NOT NULL DEFAULT '',
    "bankgiro" TEXT NOT NULL DEFAULT '',
    "plusgiro" TEXT NOT NULL DEFAULT '',
    "swish" TEXT NOT NULL DEFAULT '',
    "iban" TEXT NOT NULL DEFAULT '',
    "bic" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "logoKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "kundTyp" TEXT NOT NULL DEFAULT 'privatperson',
    "namn" TEXT NOT NULL,
    "adress" TEXT NOT NULL DEFAULT '',
    "postnummer" TEXT NOT NULL DEFAULT '',
    "stad" TEXT NOT NULL DEFAULT '',
    "telefon" TEXT NOT NULL DEFAULT '',
    "epost" TEXT NOT NULL DEFAULT '',
    "personnummer" TEXT NOT NULL DEFAULT '',
    "foretagsnamn" TEXT NOT NULL DEFAULT '',
    "kontaktperson" TEXT NOT NULL DEFAULT '',
    "orgNummer" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uppdrag" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "customerId" TEXT,
    "titel" TEXT NOT NULL,
    "beskrivning" TEXT NOT NULL DEFAULT '',
    "uppdragsTyp" TEXT NOT NULL DEFAULT 'konsulting',
    "status" TEXT NOT NULL DEFAULT 'pagaende',
    "prisTyp" TEXT NOT NULL DEFAULT 'timme',
    "timpris" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fastPris" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "milersattning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fakturaNummer" INTEGER,
    "anteckningar" TEXT NOT NULL DEFAULT '',
    "utfortArbete" TEXT NOT NULL DEFAULT '',
    "planeratArbete" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uppdrag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arbetspass" (
    "id" TEXT NOT NULL,
    "uppdragId" TEXT NOT NULL,
    "datum" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timmar" DOUBLE PRECISION NOT NULL,
    "beskrivning" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arbetspass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resa" (
    "id" TEXT NOT NULL,
    "uppdragId" TEXT NOT NULL,
    "datum" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stracka" DOUBLE PRECISION NOT NULL,
    "beskrivning" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ovrig_kostnad" (
    "id" TEXT NOT NULL,
    "uppdragId" TEXT NOT NULL,
    "beskrivning" TEXT NOT NULL,
    "pris" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ovrig_kostnad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'trialing',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "trialEnd" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "company_userId_key" ON "company"("userId");

-- CreateIndex
CREATE INDEX "customer_companyId_idx" ON "customer"("companyId");

-- CreateIndex
CREATE INDEX "uppdrag_companyId_idx" ON "uppdrag"("companyId");

-- CreateIndex
CREATE INDEX "uppdrag_customerId_idx" ON "uppdrag"("customerId");

-- CreateIndex
CREATE INDEX "arbetspass_uppdragId_idx" ON "arbetspass"("uppdragId");

-- CreateIndex
CREATE INDEX "resa_uppdragId_idx" ON "resa"("uppdragId");

-- CreateIndex
CREATE INDEX "ovrig_kostnad_uppdragId_idx" ON "ovrig_kostnad"("uppdragId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeCustomerId_key" ON "subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeSubscriptionId_key" ON "subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uppdrag" ADD CONSTRAINT "uppdrag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uppdrag" ADD CONSTRAINT "uppdrag_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arbetspass" ADD CONSTRAINT "arbetspass_uppdragId_fkey" FOREIGN KEY ("uppdragId") REFERENCES "uppdrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resa" ADD CONSTRAINT "resa_uppdragId_fkey" FOREIGN KEY ("uppdragId") REFERENCES "uppdrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ovrig_kostnad" ADD CONSTRAINT "ovrig_kostnad_uppdragId_fkey" FOREIGN KEY ("uppdragId") REFERENCES "uppdrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
