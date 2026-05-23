/*
  Warnings:

  - You are about to drop the column `organizationId` on the `job` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "job" DROP CONSTRAINT "job_organizationId_fkey";

-- DropIndex
DROP INDEX "job_organizationId_betalt_idx";

-- DropIndex
DROP INDEX "job_organizationId_fakturerat_idx";

-- DropIndex
DROP INDEX "job_organizationId_idx";

-- AlterTable
ALTER TABLE "job" DROP COLUMN "organizationId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "company_ownerId_idx" ON "company"("ownerId");

-- CreateIndex
CREATE INDEX "job_companyId_idx" ON "job"("companyId");

-- CreateIndex
CREATE INDEX "job_companyId_fakturerat_idx" ON "job"("companyId", "fakturerat");

-- CreateIndex
CREATE INDEX "job_companyId_betalt_idx" ON "job"("companyId", "betalt");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job" ADD CONSTRAINT "job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
