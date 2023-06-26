PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('b77765b3-f4d8-4057-bfce-109dca30717f','92a7963d3ed6286b96f1689110f0c34cb50950989b1434d23bc4a305e33e6397',1687502779341,'20230322041914_init',NULL,NULL,1687502779291,1);
INSERT INTO _prisma_migrations VALUES('d324e9c4-acf8-4bde-ab97-eff269aa75c1','b7b94c4a118a23fcdb1d89d533e92ab7b093d882f7c70c73b7755fd3b54971f1',1687502779352,'20230406050918_bbs',NULL,NULL,1687502779344,1);
INSERT INTO _prisma_migrations VALUES('ec951ee3-82cb-4ae2-9653-f74976032cb7','f00f1256825b6fce8d9573be0ce7c8717c13c84f6ef9a2671a86e100028fb6df',1687502779374,'20230406052646_bbs_2',NULL,NULL,1687502779354,1);
INSERT INTO _prisma_migrations VALUES('4c5960d9-bced-4426-8bec-c77edef423f4','e735b946ec0c15b0151ab1c254a8d8567b249caf14822fc98e48b408b775251f',1687502779393,'20230507201300_bbs_3',NULL,NULL,1687502779377,1);
INSERT INTO _prisma_migrations VALUES('75c0c311-5c8f-4eef-9add-46d212b4d1d9','a89f081db5a9dfeca6f2925ba96c841fd2afce2950787e7c89b5676d511a3480',1687502779545,'20230509043215_bbs3',NULL,NULL,1687502779395,1);
INSERT INTO _prisma_migrations VALUES('1c3056bd-e51c-431a-b90d-d3be2f1b82df','ac017491dcaca09658034190add3f1b529d26d76e7c62a2d787e29832ea9ee4e',1687502779575,'20230509044726_bbs4',NULL,NULL,1687502779547,1);
INSERT INTO _prisma_migrations VALUES('371b8ac8-a9f2-493a-af92-e7de627d10a5','2d4f358c2e185c6a818603f51222ed0d739e65c9b61f8299430097fd7fb5443e',1687502779591,'20230511015158_bbs5',NULL,NULL,1687502779578,1);
INSERT INTO _prisma_migrations VALUES('e3a46f8d-7119-4abd-b865-d1e1902fbc42','917f94baedbc586905dc5fe7e1027ebb02b10d1ca3ab4bbe0b32effb53e4342a',1687502779603,'20230511033144_bbs6',NULL,NULL,1687502779593,1);
INSERT INTO _prisma_migrations VALUES('8f5a5bb5-1bb8-4998-ad45-a15ca73a2b2c','a668ed48f336a68bc617fa9a9828c464b75c99597ad64c9f5aade922cf95bfaf',1687502779614,'20230511122555_bbs7',NULL,NULL,1687502779606,1);
INSERT INTO _prisma_migrations VALUES('2f9baa3a-35f3-43fa-82c2-1612899af200','f0dd079085fe331a331c3bb994e04475ae9d0c552ed0288af48c7a39db81838a',1687502779624,'20230617154028_bbs8',NULL,NULL,1687502779616,1);
INSERT INTO _prisma_migrations VALUES('1ad61e30-fe04-4d75-9788-367d519c7465','ae3acde4dcdd6aed0f7662ec3c587928fd6a292cb6dfc3788c72c50053246ac3',1687502779635,'20230619110719_bbs9',NULL,NULL,1687502779627,1);
INSERT INTO _prisma_migrations VALUES('41db23ee-46e8-4e75-81e6-565270ad5eff','02287f1e88d52092adbc9adc89b9c4dc455f38b205f4f689e63a23e72f88541c',1687502779649,'20230619195018_bbs10',NULL,NULL,1687502779638,1);
INSERT INTO _prisma_migrations VALUES('dc6796f2-2e69-4880-a397-10871d746160','29e41b1a49e0ed0c0c71cf7b9da2d2baf07a3bba4c760a3088349e358c605edf',1687502779671,'20230619204331_bbs11',NULL,NULL,1687502779652,1);
INSERT INTO _prisma_migrations VALUES('9f7c7baf-fb97-4c76-8ae9-7697189f1f16','43e1e8d1923c51342708169cb42208541a2651ffdd9486938a81adbe6b5f370f',1687502779693,'20230620192532_bbs12',NULL,NULL,1687502779674,1);
INSERT INTO _prisma_migrations VALUES('8e88a606-5131-443a-a236-07d79560270e','1b8d04af7b74ff442b92dbeebfffc7109865c690bd5d73632c66197ddc65b433',1687502779719,'20230622220030_bbs12',NULL,NULL,1687502779696,1);
INSERT INTO _prisma_migrations VALUES('5981a3cf-d351-4ed4-8057-c6036fc73994','fea8f596598e8a51fa96d827ebc5dd0205dacf68a0c5655c52b254839c6d348c',1687502792581,'20230623064632_bbs_aura',NULL,NULL,1687502792530,1);
INSERT INTO _prisma_migrations VALUES('8c068dae-a72c-4ec8-b125-de4c8b6fa3f4','67ef1bb08dbc200b422a4bd2eead3539b5bbb3eec4010bdf95f1664a99b2bf8c',1687504717310,'20230623071837_bbs_aura1',NULL,NULL,1687504717285,1);
CREATE TABLE IF NOT EXISTS "_CompetitionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompetitionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "_EventToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "_EventToGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "Groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "_ScoreToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ScoreToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Score" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ScoreToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "_GroupsToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GroupsToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GroupsToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Groups" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupName" TEXT,
    "generatedNumber" INTEGER
);
CREATE TABLE IF NOT EXISTS "_CompetitionToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompetitionToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Club" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "cellPhone" TEXT,
    "email" TEXT
);
INSERT INTO Club VALUES(1,'The Sharks','17863222032','sharks54@gmail.com');
INSERT INTO Club VALUES(2,'The Tigers','5167547','Tiger54@gmail.com');
CREATE TABLE IF NOT EXISTS "Competition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO Competition VALUES(1,'Competition 2023');
CREATE TABLE IF NOT EXISTS "Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventlinkId" INTEGER NOT NULL,
    "execution" REAL,
    "difficulty" REAL,
    "artisticExpression" REAL,
    "artisticImpression" REAL,
    "total" REAL,
    CONSTRAINT "Score_eventlinkId_fkey" FOREIGN KEY ("eventlinkId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "username" TEXT,
    "password" TEXT,
    "role" TEXT
);
INSERT INTO User VALUES(1,'BBS Admin','admin','$2a$10$EG/1.VA/FkGvU1Bnm1jzIeA27p6yGkXl2f2qZWEAq6okgcjnpeEli','admin');
CREATE TABLE IF NOT EXISTS "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
CREATE TABLE IF NOT EXISTS "_TypeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TypeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TypeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "competitionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    CONSTRAINT "Event_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Event VALUES(1,1,'Novice-B','Solo','06:30');
CREATE TABLE IF NOT EXISTS "Participant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clublinkId" INTEGER NOT NULL,
    "lastName" TEXT,
    "firstName" TEXT,
    "birthYear" DATETIME,
    "division" TEXT,
    "age_category" TEXT,
    "competition" TEXT,
    "event" TEXT,
    "country" TEXT,
    "generatedNumber" INTEGER,
    CONSTRAINT "Participant_clublinkId_fkey" FOREIGN KEY ("clublinkId") REFERENCES "Club" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Participant VALUES(3,1,'Haddocks','Jeanello',911433600000,'awd','AWD-NoAgeLimit','Competition 2023','solo,duet,mixDuet','Curacao',NULL);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Score',0);
INSERT INTO sqlite_sequence VALUES('User',1);
INSERT INTO sqlite_sequence VALUES('Event',1);
INSERT INTO sqlite_sequence VALUES('Club',2);
INSERT INTO sqlite_sequence VALUES('Competition',1);
INSERT INTO sqlite_sequence VALUES('Participant',3);
CREATE UNIQUE INDEX "_CompetitionToParticipant_AB_unique" ON "_CompetitionToParticipant"("A", "B");
CREATE INDEX "_CompetitionToParticipant_B_index" ON "_CompetitionToParticipant"("B");
CREATE UNIQUE INDEX "Competition_name_key" ON "Competition"("name");
CREATE UNIQUE INDEX "_CompetitionToUser_AB_unique" ON "_CompetitionToUser"("A", "B");
CREATE INDEX "_CompetitionToUser_B_index" ON "_CompetitionToUser"("B");
CREATE UNIQUE INDEX "_EventToParticipant_AB_unique" ON "_EventToParticipant"("A", "B");
CREATE INDEX "_EventToParticipant_B_index" ON "_EventToParticipant"("B");
CREATE UNIQUE INDEX "_EventToGroups_AB_unique" ON "_EventToGroups"("A", "B");
CREATE INDEX "_EventToGroups_B_index" ON "_EventToGroups"("B");
CREATE UNIQUE INDEX "_ScoreToUser_AB_unique" ON "_ScoreToUser"("A", "B");
CREATE INDEX "_ScoreToUser_B_index" ON "_ScoreToUser"("B");
CREATE UNIQUE INDEX "_GroupsToParticipant_AB_unique" ON "_GroupsToParticipant"("A", "B");
CREATE INDEX "_GroupsToParticipant_B_index" ON "_GroupsToParticipant"("B");
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "Configuration_name_key" ON "Configuration"("name");
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");
CREATE UNIQUE INDEX "Type_id_key" ON "Type"("id");
CREATE UNIQUE INDEX "_TypeToUser_AB_unique" ON "_TypeToUser"("A", "B");
CREATE INDEX "_TypeToUser_B_index" ON "_TypeToUser"("B");
CREATE UNIQUE INDEX "Participant_id_key" ON "Participant"("id");
COMMIT;
