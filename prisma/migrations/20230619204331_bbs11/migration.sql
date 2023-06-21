/*
  Warnings:

  - You are about to drop the column `Country` on the `Participant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clublinkId" INTEGER NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "birthYear" DATETIME,
    "division" TEXT,
    "age_category" TEXT,
    "age_group" TEXT,
    "country" TEXT,
    "generatedNumber" INTEGER,
    CONSTRAINT "Participant_clublinkId_fkey" FOREIGN KEY ("clublinkId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("age_category", "age_group", "birthYear", "clublinkId", "division", "firstName", "generatedNumber", "id", "lastName") SELECT "age_category", "age_group", "birthYear", "clublinkId", "division", "firstName", "generatedNumber", "id", "lastName" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_id_key" ON "Participant"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
