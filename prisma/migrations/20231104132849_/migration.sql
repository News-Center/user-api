-- CreateTable
CREATE TABLE "_PhaseToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PhaseToUser_AB_unique" ON "_PhaseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PhaseToUser_B_index" ON "_PhaseToUser"("B");

-- AddForeignKey
ALTER TABLE "_PhaseToUser" ADD CONSTRAINT "_PhaseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Phase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PhaseToUser" ADD CONSTRAINT "_PhaseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
