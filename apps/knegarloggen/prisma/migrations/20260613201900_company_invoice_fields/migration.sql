/*
  Warnings:

  - You are about to drop the column `adress` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `epost` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `fastighetsbeteckning` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `kundNamn` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `personnummer` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `telefon` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job" DROP COLUMN "adress",
DROP COLUMN "epost",
DROP COLUMN "fastighetsbeteckning",
DROP COLUMN "kundNamn",
DROP COLUMN "personnummer",
DROP COLUMN "telefon",
ADD COLUMN     "customerId" TEXT;

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

-- CreateIndex
CREATE INDEX "customer_companyId_idx" ON "customer"("companyId");

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
