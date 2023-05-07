-- CreateTable
CREATE TABLE "Participant_has_Groups" (
    "Participant_idParticipant" INTEGER NOT NULL,
    "Groups_idGroups" INTEGER NOT NULL,

    PRIMARY KEY ("Participant_idParticipant", "Groups_idGroups"),
    CONSTRAINT "Participant_has_Groups_Participant_idParticipant_fkey" FOREIGN KEY ("Participant_idParticipant") REFERENCES "Participant" ("idParticipant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_has_Groups_Groups_idGroups_fkey" FOREIGN KEY ("Groups_idGroups") REFERENCES "Groups" ("idGroups") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Groups" (
    "idGroups" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "GroupName" TEXT,
    "GeneratedNumber" INTEGER
);

-- CreateTable
CREATE TABLE "Event_has_Groups" (
    "Event_idEvent" INTEGER NOT NULL,
    "Groups_idGroups" INTEGER NOT NULL,

    PRIMARY KEY ("Event_idEvent", "Groups_idGroups"),
    CONSTRAINT "Event_has_Groups_Event_idEvent_fkey" FOREIGN KEY ("Event_idEvent") REFERENCES "Event" ("idEvent") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_has_Groups_Groups_idGroups_fkey" FOREIGN KEY ("Groups_idGroups") REFERENCES "Groups" ("idGroups") ON DELETE RESTRICT ON UPDATE CASCADE
);
