-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "code_snapshot" JSONB;

-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "detailedAnalysis" JSONB,
ADD COLUMN     "evaluationStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "score" INTEGER;
