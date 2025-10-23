-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "dependencies" JSONB,
ADD COLUMN     "files_json" JSONB,
ADD COLUMN     "test_files_json" JSONB;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "challengeId" TEXT;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
