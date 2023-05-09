/*
  Warnings:

  - You are about to drop the `Competition_has_User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event_has_Groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event_has_Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant_has_Competition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant_has_Groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_has_Score` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GeneratedNumber` on the `Groups` table. All the data in the column will be lost.
  - You are about to drop the column `GroupName` on the `Groups` table. All the data in the column will be lost.
  - You are about to drop the column `idGroups` on the `Groups` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Event` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `idEvent` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CellPhone` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `idClub` on the `Club` table. All the data in the column will be lost.
  - The primary key for the `Score` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Club_idClub` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `Participant_idParticipant` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `idScore` on the `Score` table. All the data in the column will be lost.
  - The primary key for the `Competition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Name` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `idcompetition` on the `Competition` table. All the data in the column will be lost.
  - The primary key for the `Participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Age_Category` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `BirthYear` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `Club_idClub` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `Division` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `FirstName` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `GeneratedNumber` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `idParticipant` on the `Participant` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `iduser` on the `User` table. All the data in the column will be lost.
  - Added the required column `id` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventlinkId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clublinkId` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Competition_has_User";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event_has_Groups";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event_has_Participant";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Participant_has_Competition";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Participant_has_Groups";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User_has_Score";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_CompetitionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompetitionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ScoreToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ScoreToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Score" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ScoreToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_GroupsToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GroupsToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GroupsToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT,
    "generatedNumber" INTEGER
);
DROP TABLE "Groups";
ALTER TABLE "new_Groups" RENAME TO "Groups";
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event" TEXT NOT NULL
);
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_event_key" ON "Event"("event");
CREATE TABLE "new__CompetitionToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompetitionToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CompetitionToParticipant" ("A", "B") SELECT "A", "B" FROM "_CompetitionToParticipant";
DROP TABLE "_CompetitionToParticipant";
ALTER TABLE "new__CompetitionToParticipant" RENAME TO "_CompetitionToParticipant";
CREATE UNIQUE INDEX "_CompetitionToParticipant_AB_unique" ON "_CompetitionToParticipant"("A", "B");
CREATE INDEX "_CompetitionToParticipant_B_index" ON "_CompetitionToParticipant"("B");
CREATE TABLE "new_Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "cellPhone" TEXT,
    "email" TEXT
);
DROP TABLE "Club";
ALTER TABLE "new_Club" RENAME TO "Club";
CREATE TABLE "new_Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventlinkId" INTEGER NOT NULL,
    "Execution" REAL,
    "Difficulty" REAL,
    "ArtisticExpression" REAL,
    "ArtisticImpression" REAL,
    "Total" REAL,
    CONSTRAINT "Score_eventlinkId_fkey" FOREIGN KEY ("eventlinkId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Score" ("ArtisticExpression", "ArtisticImpression", "Difficulty", "Execution", "Total") SELECT "ArtisticExpression", "ArtisticImpression", "Difficulty", "Execution", "Total" FROM "Score";
DROP TABLE "Score";
ALTER TABLE "new_Score" RENAME TO "Score";
CREATE TABLE "new_Competition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
DROP TABLE "Competition";
ALTER TABLE "new_Competition" RENAME TO "Competition";
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");
CREATE TABLE "new_Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clublinkId" INTEGER NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "birthYear" DATETIME,
    "division" TEXT,
    "age_category" TEXT,
    "Country" TEXT,
    "generatedNumber" INTEGER,
    CONSTRAINT "Participant_clublinkId_fkey" FOREIGN KEY ("clublinkId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("Country") SELECT "Country" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
CREATE UNIQUE INDEX "Participant_id_key" ON "Participant"("id");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Username" TEXT,
    "Password" TEXT,
    "Role" TEXT
);
INSERT INTO "new_User" ("Name", "Password", "Role", "Username") SELECT "Name", "Password", "Role", "Username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToUser_AB_unique" ON "_CompetitionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToUser_B_index" ON "_CompetitionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToParticipant_AB_unique" ON "_EventToParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToParticipant_B_index" ON "_EventToParticipant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToGroups_AB_unique" ON "_EventToGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToGroups_B_index" ON "_EventToGroups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ScoreToUser_AB_unique" ON "_ScoreToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ScoreToUser_B_index" ON "_ScoreToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupsToParticipant_AB_unique" ON "_GroupsToParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupsToParticipant_B_index" ON "_GroupsToParticipant"("B");
