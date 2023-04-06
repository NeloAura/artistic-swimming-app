/*
  Warnings:

  - You are about to alter the column `BirthYear` on the `Participant` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "idParticipant" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "LastName" TEXT,
    "FirstName" TEXT,
    "BirthYear" DATETIME,
    "Division" TEXT,
    "Age_Category" TEXT,
    "Country" TEXT,
    "GeneratedNumber" INTEGER,
    "Club_idClub" INTEGER NOT NULL,
    CONSTRAINT "Participant_Club_idClub_fkey" FOREIGN KEY ("Club_idClub") REFERENCES "Club" ("idClub") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("Age_Category", "BirthYear", "Club_idClub", "Country", "Division", "FirstName", "GeneratedNumber", "LastName", "idParticipant") SELECT "Age_Category", "BirthYear", "Club_idClub", "Country", "Division", "FirstName", "GeneratedNumber", "LastName", "idParticipant" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_idParticipant_Club_idClub_key" ON "Participant"("idParticipant", "Club_idClub");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
