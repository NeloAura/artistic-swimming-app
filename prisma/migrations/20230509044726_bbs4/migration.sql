/*
  Warnings:

  - You are about to drop the column `ArtisticExpression` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `ArtisticImpression` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `Difficulty` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `Execution` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `Total` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Username` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventlinkId" INTEGER NOT NULL,
    "execution" REAL,
    "difficulty" REAL,
    "artisticExpression" REAL,
    "artisticImpression" REAL,
    "total" REAL,
    CONSTRAINT "Score_eventlinkId_fkey" FOREIGN KEY ("eventlinkId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Score" ("eventlinkId", "id") SELECT "eventlinkId", "id" FROM "Score";
DROP TABLE "Score";
ALTER TABLE "new_Score" RENAME TO "Score";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "username" TEXT,
    "password" TEXT,
    "role" TEXT
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
