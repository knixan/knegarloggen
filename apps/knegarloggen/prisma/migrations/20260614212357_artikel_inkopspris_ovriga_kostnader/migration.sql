/*
  Warnings:

  - You are about to drop the column `ovrigaArtiklar` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "article" ADD COLUMN     "inkopspris" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "job" DROP COLUMN "ovrigaArtiklar";

-- CreateTable
CREATE TABLE "ovrig_kostnad" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "beskrivning" TEXT NOT NULL,
    "pris" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ovrig_kostnad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ovrig_kostnad_jobId_idx" ON "ovrig_kostnad"("jobId");

-- AddForeignKey
ALTER TABLE "ovrig_kostnad" ADD CONSTRAINT "ovrig_kostnad_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
