/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "company_ownerId_idx";

-- AlterTable
ALTER TABLE "company" ADD COLUMN     "adress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "bankgiro" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "drojsmalsranta" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "epost" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "fSkatt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fakturatext" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "forfallodagar" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "logoKey" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "logoUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "momsNummer" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "nastaFakturanummer" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "orgNummer" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ort" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "plusgiro" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "postnummer" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "swish" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "telefon" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "company_ownerId_key" ON "company"("ownerId");
