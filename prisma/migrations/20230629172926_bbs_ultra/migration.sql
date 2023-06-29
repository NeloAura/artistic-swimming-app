/*
  Warnings:

  - You are about to drop the column `artisticExpression` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `artisticImpression` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `execution` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Score` table. All the data in the column will be lost.
  - Added the required column `type` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_ParticipantToScore" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ParticipantToScore_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ParticipantToScore_B_fkey" FOREIGN KEY ("B") REFERENCES "Score" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ParticipantToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ParticipantToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ParticipantToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GroupsToScore" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GroupsToScore_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GroupsToScore_B_fkey" FOREIGN KEY ("B") REFERENCES "Score" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventlinkId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    CONSTRAINT "Score_eventlinkId_fkey" FOREIGN KEY ("eventlinkId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Score" ("eventlinkId", "id") SELECT "eventlinkId", "id" FROM "Score";
DROP TABLE "Score";
ALTER TABLE "new_Score" RENAME TO "Score";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToScore_AB_unique" ON "_ParticipantToScore"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToScore_B_index" ON "_ParticipantToScore"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToUser_AB_unique" ON "_ParticipantToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToUser_B_index" ON "_ParticipantToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupsToScore_AB_unique" ON "_GroupsToScore"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupsToScore_B_index" ON "_GroupsToScore"("B");
