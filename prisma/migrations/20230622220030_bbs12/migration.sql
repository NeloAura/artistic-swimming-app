/*
  Warnings:

  - Added the required column `time` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL
);
INSERT INTO "new_Event" ("event", "id") SELECT "event", "id" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_event_key" ON "Event"("event");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
