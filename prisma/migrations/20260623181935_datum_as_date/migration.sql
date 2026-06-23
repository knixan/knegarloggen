-- AlterTable
ALTER TABLE "trip" ALTER COLUMN "datum" TYPE DATE USING datum::date;

-- AlterTable
ALTER TABLE "work_session" ALTER COLUMN "datum" TYPE DATE USING datum::date;
