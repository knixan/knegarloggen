/*
  Warnings:

  - You are about to drop the column `avstand` on the `trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article" ADD COLUMN     "aterforsaljare" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "ovrigaArtiklar" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pagaende" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "utfortArbete" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "trip" DROP COLUMN "avstand";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
