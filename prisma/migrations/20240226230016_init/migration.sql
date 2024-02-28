-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "startMinute" TEXT,
    "endTime" TEXT,
    "endMinute" TEXT,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeDetail" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "PracticeDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeTag" (
    "practiceDetailId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "PracticeTag_pkey" PRIMARY KEY ("practiceDetailId","tagId")
);

-- CreateIndex
CREATE INDEX "idx_practice_detail_record_id" ON "PracticeDetail"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "PracticeDetail" ADD CONSTRAINT "PracticeDetail_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeTag" ADD CONSTRAINT "PracticeTag_practiceDetailId_fkey" FOREIGN KEY ("practiceDetailId") REFERENCES "PracticeDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeTag" ADD CONSTRAINT "PracticeTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
