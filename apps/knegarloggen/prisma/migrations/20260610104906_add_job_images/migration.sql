-- CreateTable
CREATE TABLE "job_image" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_image_jobId_idx" ON "job_image"("jobId");

-- AddForeignKey
ALTER TABLE "job_image" ADD CONSTRAINT "job_image_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
