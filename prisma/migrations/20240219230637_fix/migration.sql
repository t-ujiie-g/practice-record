/*
  Warnings:

  - You are about to drop the column `duration` on the `PracticeDetail` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PracticeDetail" DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "title";
