/*
  Warnings:

  - You are about to drop the column `project_id` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `Contest` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the `CodeProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Challenge" DROP CONSTRAINT "Challenge_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contest" DROP CONSTRAINT "Contest_project_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Test" DROP CONSTRAINT "Test_project_id_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "project_id",
ADD COLUMN     "dependencies" JSONB,
ADD COLUMN     "files_json" JSONB,
ADD COLUMN     "technology" TEXT,
ADD COLUMN     "test_files_json" JSONB;

-- DropTable
DROP TABLE "public"."CodeProject";

-- DropEnum
DROP TYPE "public"."ProjectType";
