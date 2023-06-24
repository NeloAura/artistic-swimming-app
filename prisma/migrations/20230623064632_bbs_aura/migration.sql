/*
  Warnings:

  - You are about to drop the column `event` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `age_group` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `competitionId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "_TypeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TypeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TypeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "competitionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    CONSTRAINT "Event_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("id", "time", "type") SELECT "id", "time", "type" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
CREATE TABLE "new_Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clublinkId" INTEGER NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "birthYear" DATETIME,
    "division" TEXT,
    "age_category" TEXT,
    "competition" TEXT,
    "event_types" TEXT,
    "country" TEXT,
    "generatedNumber" INTEGER,
    CONSTRAINT "Participant_clublinkId_fkey" FOREIGN KEY ("clublinkId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("age_category", "birthYear", "clublinkId", "country", "division", "firstName", "generatedNumber", "id", "lastName") SELECT "age_category", "birthYear", "clublinkId", "country", "division", "firstName", "generatedNumber", "id", "lastName" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_id_key" ON "Participant"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Type_id_key" ON "Type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_TypeToUser_AB_unique" ON "_TypeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TypeToUser_B_index" ON "_TypeToUser"("B");
