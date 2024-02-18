-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordTag" (
    "recordId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RecordTag_pkey" PRIMARY KEY ("recordId","tagId")
);

-- CreateTable
CREATE TABLE "_RecordToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RecordToTag_AB_unique" ON "_RecordToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_RecordToTag_B_index" ON "_RecordToTag"("B");

-- AddForeignKey
ALTER TABLE "RecordTag" ADD CONSTRAINT "RecordTag_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordTag" ADD CONSTRAINT "RecordTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecordToTag" ADD CONSTRAINT "_RecordToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecordToTag" ADD CONSTRAINT "_RecordToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
