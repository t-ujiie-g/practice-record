/*
  Warnings:

  - You are about to drop the `RecordTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecordToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecordTag" DROP CONSTRAINT "RecordTag_recordId_fkey";

-- DropForeignKey
ALTER TABLE "RecordTag" DROP CONSTRAINT "RecordTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "_RecordToTag" DROP CONSTRAINT "_RecordToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecordToTag" DROP CONSTRAINT "_RecordToTag_B_fkey";

-- DropTable
DROP TABLE "RecordTag";

-- DropTable
DROP TABLE "_RecordToTag";

-- CreateTable
CREATE TABLE "PracticeDetail" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "duration" INTEGER,

    CONSTRAINT "PracticeDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeTag" (
    "practiceDetailId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "PracticeTag_pkey" PRIMARY KEY ("practiceDetailId","tagId")
);

-- CreateIndex
CREATE INDEX "idx_practice_detail_record_id" ON "PracticeDetail"("recordId");

-- AddForeignKey
ALTER TABLE "PracticeDetail" ADD CONSTRAINT "PracticeDetail_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeTag" ADD CONSTRAINT "PracticeTag_practiceDetailId_fkey" FOREIGN KEY ("practiceDetailId") REFERENCES "PracticeDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeTag" ADD CONSTRAINT "PracticeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
