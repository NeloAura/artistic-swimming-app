-- CreateTable
CREATE TABLE "Club" (
    "idClub" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT,
    "CellPhone" TEXT,
    "Email" TEXT
);

-- CreateTable
CREATE TABLE "Competition" (
    "idcompetition" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Competition_has_User" (
    "Competition_idcompetition" INTEGER NOT NULL,
    "User_iduser" INTEGER NOT NULL,

    PRIMARY KEY ("Competition_idcompetition", "User_iduser"),
    CONSTRAINT "Competition_has_User_Competition_idcompetition_fkey" FOREIGN KEY ("Competition_idcompetition") REFERENCES "Competition" ("idcompetition") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Competition_has_User_User_iduser_fkey" FOREIGN KEY ("User_iduser") REFERENCES "User" ("iduser") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "idEvent" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Event" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event_has_Participant" (
    "Event_idEvent" INTEGER NOT NULL,
    "Participant_idParticipant" INTEGER NOT NULL,

    PRIMARY KEY ("Event_idEvent", "Participant_idParticipant"),
    CONSTRAINT "Event_has_Participant_Event_idEvent_fkey" FOREIGN KEY ("Event_idEvent") REFERENCES "Event" ("idEvent") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_has_Participant_Participant_idParticipant_fkey" FOREIGN KEY ("Participant_idParticipant") REFERENCES "Participant" ("idParticipant") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant" (
    "idParticipant" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "LastName" TEXT,
    "FirstName" TEXT,
    "BirthYear" TEXT,
    "Division" TEXT,
    "Age_Category" TEXT,
    "Country" TEXT,
    "GeneratedNumber" INTEGER,
    "Club_idClub" INTEGER NOT NULL,
    CONSTRAINT "Participant_Club_idClub_fkey" FOREIGN KEY ("Club_idClub") REFERENCES "Club" ("idClub") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant_has_Competition" (
    "Participant_idParticipant" INTEGER NOT NULL,
    "Competition_idcompetition" INTEGER NOT NULL,

    PRIMARY KEY ("Participant_idParticipant", "Competition_idcompetition"),
    CONSTRAINT "Participant_has_Competition_Participant_idParticipant_fkey" FOREIGN KEY ("Participant_idParticipant") REFERENCES "Participant" ("idParticipant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_has_Competition_Competition_idcompetition_fkey" FOREIGN KEY ("Competition_idcompetition") REFERENCES "Competition" ("idcompetition") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Score" (
    "idScore" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Execution" REAL,
    "Difficulty" REAL,
    "ArtisticExpression" REAL,
    "Total" REAL,
    "Participant_idParticipant" INTEGER NOT NULL,
    "Club_idClub" INTEGER NOT NULL,
    CONSTRAINT "Score_Participant_idParticipant_Club_idClub_fkey" FOREIGN KEY ("Participant_idParticipant", "Club_idClub") REFERENCES "Participant" ("idParticipant", "Club_idClub") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "iduser" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "Username" TEXT,
    "Password" TEXT,
    "Role" TEXT
);

-- CreateTable
CREATE TABLE "User_has_Score" (
    "User_iduser" INTEGER NOT NULL,
    "Score_idScore" INTEGER NOT NULL,

    PRIMARY KEY ("User_iduser", "Score_idScore"),
    CONSTRAINT "User_has_Score_User_iduser_fkey" FOREIGN KEY ("User_iduser") REFERENCES "User" ("iduser") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_has_Score_Score_idScore_fkey" FOREIGN KEY ("Score_idScore") REFERENCES "Score" ("idScore") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CompetitionToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CompetitionToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Competition" ("idcompetition") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CompetitionToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant" ("idParticipant") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Competition_Name_key" ON "Competition"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_Event_key" ON "Event"("Event");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_idParticipant_Club_idClub_key" ON "Participant"("idParticipant", "Club_idClub");

-- CreateIndex
CREATE UNIQUE INDEX "_CompetitionToParticipant_AB_unique" ON "_CompetitionToParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_CompetitionToParticipant_B_index" ON "_CompetitionToParticipant"("B");
