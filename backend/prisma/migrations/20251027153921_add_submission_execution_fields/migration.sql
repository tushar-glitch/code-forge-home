-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "exit_code" INTEGER,
ADD COLUMN "stdout" TEXT,
ADD COLUMN "stderr" TEXT,
ADD COLUMN "duration" INTEGER,
ADD COLUMN "status" TEXT DEFAULT 'pending';

