-- DropForeignKey
ALTER TABLE "public"."Candidate" DROP CONSTRAINT "Candidate_invited_by_fkey";

-- DropIndex
DROP INDEX "public"."Candidate_email_key";

-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "invited_by" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
