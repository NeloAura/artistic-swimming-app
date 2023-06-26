/*
  Warnings:

  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.
  - Added the required column `age_categorie` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `division` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "competitionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "age_categorie" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    CONSTRAINT "Event_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("competitionId", "id", "name", "type") SELECT "competitionId", "id", "name", "type" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
