-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('TEMPLATE', 'CUSTOM');

-- AlterTable
ALTER TABLE "CodeProject" ADD COLUMN     "git_url" TEXT,
ADD COLUMN     "template_language" TEXT,
ADD COLUMN     "type" "ProjectType" NOT NULL DEFAULT 'TEMPLATE';
