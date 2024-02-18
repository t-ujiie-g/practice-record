/*
  Warnings:

  - You are about to drop the column `description` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "startTime" TEXT;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "description";
