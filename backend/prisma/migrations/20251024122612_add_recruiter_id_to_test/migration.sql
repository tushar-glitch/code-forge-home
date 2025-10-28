-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "recruiterId" TEXT;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
