// import libraries
import http from "http";
import CryptoJS from "crypto-js";
import express from "express";
import { Server } from "socket.io";
import wifi from "node-wifi";
import cors from "cors";
import os from "os";
import { PrismaClient } from "@prisma/client";

// constants
const app = express();
const httpServer = http.createServer(app);
const PORT = 3001;
const prisma = new PrismaClient();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
// const key = env("SECRET_KEY");
const key = "BBS";
// functions

function getIpAddress() {
  return new Promise((resolve, reject) => {
    const ifaces = os.networkInterfaces();
    let ipAddress;

    Object.keys(ifaces).forEach((ifname) => {
      ifaces[ifname].forEach((iface) => {
        if (iface.family === "IPv4" && !iface.internal) {
          ipAddress = iface.address;
        }
      });
    });

    if (ipAddress) {
      resolve(ipAddress);
    } else {
      reject(new Error("Unable to retrieve IP address"));
    }
  });
}

function generateSecretCode(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

function generateRandomNumber(range) {
  return Math.floor(Math.random() * range) + 1;
}

function calculateAverageScore(scores) {
  if (scores.length === 0) {
    return 0;
  }

  const totalScore = scores.reduce((sum, score) => sum + score.value, 0);
  return totalScore / scores.length;
}

async function createDefaultUser() {
  const adminUser = await prisma.user.findUnique({ where: { id: 1 } });
  if (!adminUser) {
    const passwordHash = CryptoJS.AES.encrypt(
      "BandaBouSplash01!",
      key
    ).toString();
    await prisma.user.create({
      data: {
        name: "BBS Admin",
        username: "admin",
        password: passwordHash,
        role: "admin",
      },
    });
  }
  console.log("Default User Created");
}

async function createTypes() {
  const judgeTypes = [
    "execution",
    "difficulty",
    "artisticExpression",
    "artisticImpressions",
  ];

  await Promise.all(
    judgeTypes.map(async (type) => {
      const existingType = await prisma.type.findUnique({
        where: { name: type },
      });

      if (!existingType) {
        await prisma.type.create({
          data: {
            name: type,
          },
        });
      }
    })
  );

  console.log("Judge Types Created");
}

const getJudgeTypes = async (judgeId, eventId) => {
  try {
    // Assuming you have a database or ORM to query data
    const judge = await prisma.judge.findUnique({
      where: {
        id: judgeId,
      },
      include: {
        events: {
          where: {
            id: eventId,
          },
          select: {
            types: true,
          },
        },
      },
    });

    // Extract the judge types from the retrieved data
    const judgeTypes = judge.events[0].types;

    return judgeTypes;
  } catch (error) {
    throw new Error("Failed to fetch judge types");
  }
};

const secretCode = generateSecretCode();
const eventTypes = ['Solo', 'Duet', 'MaleSolo', 'Teams', 'MixDuet'];


io.on("connection", async (socket) => {
  //Tools
  const ipAddress = await getIpAddress();
  

  //Specials
  socket.emit("ipAddress", ipAddress);
  socket.emit("secretCode", secretCode);
  //random
  socket.on("assign-random-numbers", async () => {
    try {
      // Fetch all participants and groups from the database
      const participants = await prisma.participant.findMany();
      const groups = await prisma.groups.findMany();

      // Assign unique random numbers to participants
      participants.forEach((participant) => {
        participant.generatedNumber = generateRandomNumber(100);
      });

      // Assign unique random numbers to groups
      groups.forEach((group) => {
        group.generatedNumber = generateRandomNumber(100);
      });

      // Update the participants and groups in the database with the generated numbers
      await prisma.$transaction([
        ...participants.map((participant) =>
          prisma.participant.update({
            where: { id: participant.id },
            data: { generatedNumber: participant.generatedNumber },
          })
        ),
        ...groups.map((group) =>
          prisma.groups.update({
            where: { id: group.id },
            data: { generatedNumber: group.generatedNumber },
          })
        ),
      ]);

      
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("assign-event", async ({ id, name, type }) => {
    try {
      // Find the judge by name
      const judge = await prisma.user.findUnique({
        where: { name: name },
      });

      if (!judge) {
        throw new Error("Judge not found");
      }

      // Find the event by EventID
      const event = await prisma.event.findUnique({
        where: { id: id },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // Find the type by name
      const eventType = await prisma.type.findUnique({
        where: { name: type },
      });

      if (!eventType) {
        throw new Error("Event type not found");
      }

      // Link the judge to the event and type using the relationships
      await prisma.event.update({
        where: { id: id },
        data: {
          users: {
            connect: { id: judge.id },
          },
          types: {
            connect: { id: eventType.id },
          },
        },
      });

      
    } catch (error) {
      console.error("Assign event failed:", error);
    }
  });
  //score
  socket.on(
    "add-score",
    async ({ username, eventId, type, participantId, scoreData }) => {
      try {
        // Find the judge by their username
        const judge = await prisma.user.findUnique({
          where: { username: username },
        });
  
        // Find the event by its ID
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });
  
        // Find the participant by their ID
        const participant = await prisma.participant.findUnique({
          where: { id: participantId },
        });
  
        // Check if the judge has a relation with the event
        const judgeEventRelation = await prisma.user.findFirst({
          where: {
            id: judge.id,
            competitions: { some: { events: { some: { id: event.id } } } },
          },
        });
  
        if (!judgeEventRelation) {
          throw new Error("Judge does not have a relation with the event.");
        }
  
        // Create the score and link it to the judge
        const newScore = await prisma.score.create({
          data: {
            eventlink: { connect: { id: event.id } },
            type: type,
            value: scoreData,
            users: { connect: { id: judge.id } },
            participants: { connect: { id: participant.id } },
          },
        });
  
        // Perform any other necessary operations or emit events
  
        // Return the new score or relevant information to the client
        
        socket.emit("score-added", { score: newScore });
      } catch (error) {
        // Handle any errors that occurred during the process
        console.log(error);
        socket.emit("score-error", { error: error.message });
      }
    }
  );
  
  socket.on(
    "add-score-group",
    async ({ judgeUsername, eventId, type, groupId, scoreData }) => {
      try {
        // Find the judge by their username
        
        const judge = await prisma.user.findUnique({
          where: { username: judgeUsername },
        });

        // Find the event by its ID
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        // Find the group by its ID
        const group = await prisma.groups.findUnique({
          where: { id: groupId },
          include: { participants: true }, // Include the participants related to the group
        });

        // Check if the judge has a relation with the event
        const judgeEventRelation = await prisma.user.findFirst({
          where: {
            id: judge.id,
            competitions: { some: { events: { some: { id: event.id } } } },
          },
        });

        if (!judgeEventRelation) {
          throw new Error("Judge does not have a relation with the event.");
        }

        // Fetch the eventType that has a relation with the event model
       

        // Loop through the participants of the group and add scores for each participant
        for (const participant of group.participants) {
          const newScore = await prisma.score.create({
            data: {
              eventlink: { connect: { id: event.id } },
              type: type,
              value: scoreData,
              users: { connect: { id: judge.id } },
              groups: { connect: { id: group.id } },
              participants: { connect: { id: participant.id } },
            },
          });

          // Perform any other necessary operations or emit events

          // Return the new score or relevant information to the client
          
          socket.emit("score-added-group", { score: newScore });
        }
      } catch (error) {
        // Handle any errors that occurred during the process
        console.log(error);
        socket.emit("score-error-group", { error: error.message });
      }
    }
  );
  socket.on("group-score-information", async () => {
    try {
      const groups = await prisma.groups.findMany({
        include: {
          scores: true,
        },
      });

      // Emit the group scores through a socket event
      socket.emit("group-scores", groups);
      
      return groups;
    } catch (error) {
      console.error("Error fetching group scores:", error);
      throw error;
    }
  });
  socket.on("participant-score-information", async () => {
    try {
      // Fetch all participants with their scores
      const participants = await prisma.participant.findMany({
        include: {
          scores: true,
        },
      });

      // Emit the participants' scores back to the client
      socket.emit("participant-score-information", participants);
      // console.log(JSON.stringify(participants));
    } catch (error) {
      console.error("Error fetching participants' scores:", error);
      socket.emit(
        "participantsScoresError",
        "Error fetching participants' scores"
      );
    }
  });
  socket.on("fetch-club-scores", async () => {
    try {
      const clubScores = await prisma.club.findMany({
        include: {
          participants: {
            include: {
              scores: true,
            },
          },
        },
      });

      socket.emit("club-scores", clubScores);
      
    } catch (error) {
      console.error("Error fetching club scores:", error);
      socket.emit("error", "An error occurred while fetching club scores");
    }
  });
  socket.on("update-score-value", async ( participants ) => {
    try {
      if (typeof participants === 'string') {
        const parsedParticipants = JSON.parse(participants);
  
        for (const participant of parsedParticipants) {
          const { scores } = participant;
  
          for (const score of scores) {
            const { id: scoreId, value: newValue } = score;
  
            try {
              const updatedScore = await prisma.score.update({
                where: { id: scoreId },
                data: { value: newValue },
              });
              
            } catch (error) {
              console.error("Error updating score value:", error);
            }
          }
        }
      } else {
        console.error("Invalid participants data:", participants);
      }
    } catch (error) {
      console.error("Error updating score values:", error);
    }
  });
  socket.on("get-judges-participants-scores", async () => {
    const participants = await prisma.participant.findMany({
      include: {
        scores: {
          include: { users: true },
        },
      },
    });
  
    // Create an array to store the judgesScores for all participants
    const allJudgesScores = [];
  
    // Iterate over each participant
    participants.forEach((participant) => {
      // Extract the scores, types, and corresponding judges from the participant object
      const judgesScores = participant.scores.map((score) => ({
        judge: score.users,
        score: score.value,
        type: score.type,
      }));
  
      // Add the judgesScores for the current participant to the allJudgesScores array
      allJudgesScores.push({
        participantId: participant.id,
        judgesScores,
      });
    });
  
    // Emit the allJudgesScores to the client
    socket.emit("judges-participants-scores", allJudgesScores);
    
  });

  socket.on('fetchParticipantsScores', async () => {
    try {
      // Fetch participants' scores for each event type
      const scoresByEventType = await Promise.all(
        eventTypes.map(async (eventType) => {
          const scores = await prisma.score.findMany({
            where: {
              eventlink: {
                type: eventType,
              },
            },
            include: {
              participants: true,
            },
          });
          return { eventType, scores };
        })
      );

      // Emit the scores to the client
      socket.emit('participantsScores', scoresByEventType);
      
    } catch (error) {
      console.error('Error fetching participants scores:', error);
      // Handle error
    }
  });

  socket.on('fetchParticipantsCScores', async (clubName) => {
    try {

      const parsedClubID = parseInt(clubName, 10);
  
      // Fetch participants' scores for each event type based on club ID
      const scoresByEventType = await Promise.all(
        eventTypes.map(async (eventType) => {
          const scores = await prisma.score.findMany({
            where: {
              eventlink: {
                type: eventType,
              },
              participants: {
                some:{clublinkId: parsedClubID},
              },
            },
            include: {
              participants: true,
            },
          });
          return { eventType, scores };
        })
      );
  
      // Emit the scores to the client
      socket.emit('participantsCScores', scoresByEventType);
    } catch (error) {
      console.error('Error fetching participants scores:', error);
      // Handle error
    }
  });
  
  
  

  
  
  
  
  
  
  //Special-Requests
  socket.on("ipAddress-r", () => {
    socket.emit("ipAddress", ipAddress);
  });
  socket.on("secretCode-r", () => {
    socket.emit("secretCode", secretCode);
  });
  socket.on(
    "fetch-participants",
    async ({ id, cid, division, ageCategory, eventType }) => {
      try {
        const event = await prisma.event.findUnique({
          where: { id: id },
          include: { participants: true },
        });

        if (!event) {
          throw new Error("Event not found");
        }

        const competition = await prisma.competition.findUnique({
          where: { id: cid },
        });

        if (!competition) {
          throw new Error("Competition not found");
        }

        const participants = await prisma.participant.findMany({
          where: {
            AND: [
              { competition: { contains: competition.name } },
              { division: { contains: division } },
              { age_category: { contains: ageCategory } },
              { event: { contains: eventType } },
              {
                NOT: {
                  groups: {
                    some: {
                      events: {
                        some: {
                          id: id,
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        });

        const participantIdsToConnect = participants.map((participant) => ({
          id: participant.id,
        }));

        await prisma.event.update({
          where: { id: id },
          data: { participants: { connect: participantIdsToConnect } },
        });

        
        socket.emit("eventParticipantsData", participants);
        
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    }
  );

  socket.on(
    "fetch-judge-participants",
    async ({ judge, eventId, serverSecretCode }) => {
      try {
        if (serverSecretCode !== secretCode) {
          throw new Error("Try scanning the new QR-Code");
        }

        const judgeData = await prisma.user.findUnique({
          where: { username: judge },
          include: {
            events: {
              where: { id: eventId },
              include: {
                participants: {
                  where: {
                    NOT: {
                      groups: {
                        some: {
                          events: { some: { id: eventId } },
                        },
                      },
                    },
                    scores: {
                      none: {
                        eventlinkId: eventId,
                      },
                    },
                  },
                },
                types: true,
              },
            },
          },
        });

        if (!judgeData) {
          throw new Error("Judge not found");
        }

        const event = judgeData.events[0];
        const participants = event.participants;
        const eventType = event.types;

        

        // Emit the participants and eventType to the judge
        socket.emit("participantsAndTypeData", {
          participants,
          eventType,
        });
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      }
    }
  );

  socket.on(
    "fetch-judge-groups",
    async ({ eventId, judge, serverSecretCode }) => {
      try {
        if (serverSecretCode !== secretCode) {
          throw new Error("Try scanning the new QR-Code");
        }

        const judgeData = await prisma.user.findUnique({
          where: { username: judge },
          include: {
            events: {
              where: { id: eventId },
              include: {
                groups: {
                  where: {
                    scores: {
                      none: {
                        eventlinkId: eventId,
                      },
                    },
                  },
                },
                types: true,
              },
            },
          },
        });

        if (!judgeData) {
          throw new Error("Judge not found");
        }

        const event = judgeData.events[0];
        const groups = event.groups;
        const eventType = event.types;

        

        // Emit the groups and eventType to the judge
        socket.emit("groupsAndTypeData", {
          groups,
          eventType,
        });
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    }
  );

  //Authentication
  socket.on("authenticate", async ({ username, password }) => {
    try {
      // Find the user by their username
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        throw "User not found";
      }

      // Check if the password is correct
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        key
      ).toString(CryptoJS.enc.Utf8);

      const isPasswordValid = password === decryptedPassword;

      if (!isPasswordValid) {
        throw "Password is incorrect";
      }

      return socket.emit("status", "200");
    } catch (error) {
      console.error(error);
      return socket.emit("status", "401");
    }
  });
  socket.on("authenticate-j", async ({ username, password, secret }) => {
    try {
      // Find the user by their username
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        throw "User not found";
      }

      // Check if the password is correct
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        key
      ).toString(CryptoJS.enc.Utf8);

      const isPasswordValid = password === decryptedPassword;

      if (!isPasswordValid) {
        throw "Password is incorrect";
      }

      if ((secret = !secretCode)) {
        throw "Try scanning the new QR-Code";
      }

      return socket.emit("status", "200");
    } catch (error) {
      console.error(error);
      return socket.emit("status", "401");
    }
  });

  //Register
  socket.on("register-user", async ({ name, username, password, role }) => {
    try {
      // Check if the username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username: username },
      });

      if (existingUser) {
        throw "Username is already taken";
      }

      // Hash the password
      const passwordHash = CryptoJS.AES.encrypt(password, key).toString();

      // Create the new user
      const existingCompetitions = await prisma.competition.findMany(); // Fetch all existing competitions

      const competitionIds = existingCompetitions.map(
        (competition) => competition.id
      ); // Extract the IDs

      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          password: passwordHash,
          role: role || "judge", // set the role to "judge" if it's not provided
          competitions: {
            connect: competitionIds.map(id => ({ id })), // Connect the user to all existing competitions
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(
    "register-participant",
    async ({
      lastName,
      firstName,
      birthYear,
      country,
      clublinkId,
      division,
      age_category,
      competition,
      event,
    }) => {
      try {
        // Check if the participant already exists
        const participant = await prisma.participant.findFirst({
          where: {
            lastName,
            firstName,
            birthYear: new Date(birthYear), // Convert birthYear to DateTime type
          },
        });

        if (participant) {
          console.log("Participant already exists!");
          return; // Exit the function if participant already exists
        }

        const club = await prisma.club.findFirst({
          where: {
            name: clublinkId,
          },
        });

        if (!club) {
          console.log("Club not found!");
          return; // Exit the function if club is not found
        }

        const newParticipant = await prisma.participant.create({
          data: {
            lastName,
            firstName,
            birthYear: new Date(birthYear), // Convert birthYear to DateTime type
            country,
            clublink: {
              connect: {
                id: club.id,
              },
            },
            division,
            age_category,
            competition,
            event,
          },
        });

        // Find the corresponding event based on the provided criteria
        const matchingEvent = await prisma.event.findFirst({
          where: {
            division,
            age_categorie: age_category,
            type: event,
          },
        });

        if (matchingEvent) {
          // Link the participant to the event
          await prisma.event.update({
            where: {
              id: matchingEvent.id,
            },
            data: {
              participants: {
                connect: {
                  id: newParticipant.id,
                },
              },
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  );

  socket.on("register-club", async ({ name, cellPhone, email }) => {
    try {
      // Check if the username already exists
      const existingClub = await prisma.club.findUnique({
        where: { name: name },
      });

      if (existingClub) {
        throw "Club Already exists";
      }

      // Hash the password

      // Create the new user
      const newClub = await prisma.club.create({
        data: {
          name,
          cellPhone,
          email,
          // set the role to "judge" if it's not provided
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("register-competition", async ({ name }) => {
    try {
      // Check if the competition already exists
      const existingCompetition = await prisma.competition.findUnique({
        where: { name },
      });

      if (existingCompetition) {
        throw new Error("Competition already exists");
      }

      // Create the new competition
      const newCompetition = await prisma.competition.create({
        data: {
          name,
        },
      });

      // Assign all existing judges to the competition
      const judges = await prisma.user.findMany({
        where: {
          role: "judge",
        },
      });

      const judgeIds = judges.map((judge) => judge.id);

      await prisma.competition.update({
        where: {
          id: newCompetition.id,
        },
        data: {
          users: {
            connect: judgeIds.map((judgeId) => ({ id: judgeId })),
          },
        },
      });

      // Define the divisions, age categories, and types
      const divisions = ["AWD", "Novice-A", "Novice-B", "AgeGroup"];
      const ageCategories = {
        "AWD": ["noagelimit"],
        "Novice-A": ["6&Under", "7&8", "9&10", "11&12", "13&O"],
        "Novice-B": ["6&Under", "7&8", "9&10", "11&12", "13&O"],
        "AgeGroup": [
          "10&Under",
          "12&Under",
          "Youth",
          "Junior",
          "Senior",
          "Masters25-29",
          "Masters30-39,",
          "Masters40-49",
          "Masters50-59",
        ],
      };
      const types = {
        "AWD": ["Solo", "Duet", "MixDuet", "Team"],
        "Novice-A": ["Solo", "Duet", "MixDuet", "Team"],
        "Novice-B": ["Solo", "Duet", "MixDuet", "Team"],
        "AgeGroup": ["Solo", "MaleSolo", "MixDuet", "Duet", "Team"],
      };

      // Create template events for each combination of division, age category, and type
      const templateEvents = [];
      divisions.forEach((division) => {
        const divisionAgeCategories = ageCategories[division];
        divisionAgeCategories.forEach((ageCategory) => {
          const divisionTypes = types[division];
          divisionTypes.forEach((type) => {
            const eventName = `${division}-${ageCategory}`;
            const templateEvent = {
              name: eventName,
              division: division,
              age_categorie: ageCategory,
              type: type,
              competitionId: newCompetition.id,
              startTime: "...",
              endTime: "...",
            };
            templateEvents.push(templateEvent);
          });
        });
      });

      // Create template events in the database
      await Promise.all(
        templateEvents.map((event) => prisma.event.create({ data: event }))
      );

      console.log("Competition created with template events");
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(
    "register-event",
    async ({ id, name, division, age_categorie, type, startTime, endTime }) => {
      try {
        // Check if the event already exists
        const existingEvent = await prisma.event.findUnique({
          where: { id: id },
        });

        if (existingEvent) {
          throw "Event already exists";
        }

        // Create the new event and associate it with the provided CompetitionID
        const newEvent = await prisma.event.create({
          data: {
            name: name,
            division: division,
            age_categorie: age_categorie,
            type: type,
            startTime: startTime,
            endTime: endTime,
            competition: {
              connect: { id: id },
            },
          },
        });

       
      } catch (error) {
        console.error(error);
      }
    }
  );
  socket.on(
    "register-group",
    async ({ groupName, selectedParticipants, EventID }) => {
      try {
        // Create the group
        const group = await prisma.groups.create({
          data: {
            groupName,
          },
        });

        // Loop through selected participants and insert them into the group
        for (const participantId of selectedParticipants) {
          await prisma.groups.update({
            where: { id: group.id },
            data: {
              participants: {
                connect: { id: participantId },
              },
            },
          });
        }

        // Link the group with the event using the eventId
        await prisma.event.update({
          where: { id: EventID },
          data: {
            groups: {
              connect: { id: group.id },
            },
          },
        });

        console.log("Group created and participants inserted successfully");
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  );

  //fetching
  socket.on("fetchJudges", async () => {
    try {
      const judges = await prisma.user.findMany({
        where: {
          role: "judge",
        },
      });
      socket.emit("judgesData", judges);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  });
  socket.on("fetchClubs", async () => {
    try {
      const clubs = await prisma.club.findMany();

      socket.emit("clubsData", clubs);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  });
  socket.on("fetchTypes", async () => {
    try {
      const types = await prisma.type.findMany();

      socket.emit("typesData", types);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  });
  socket.on("fetchGroups", async () => {
    try {
      const groups = await prisma.groups.findMany();

      socket.emit("groupsData", groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  });
  socket.on("fetchGroup", async ({ id, serverSecretCode }) => {
    try {
      if ((serverSecretCode = !secretCode)) {
        throw "Try scanning the new QR-Code";
      }

      const group = await prisma.groups.findUnique({
        where: {
          id: id,
        },
      });

      if (!group) {
        // Group not found
        socket.emit("groupNotFound");
        return;
      }

      socket.emit("groupData", group);
    } catch (error) {
      console.error("Error fetching group:", error);
    }
  });
  socket.on("fetch-groups", async ({ id }) => {
    try {
      // Retrieve the groups associated with the event
      const groups = await prisma.event.findUnique({ where: { id } }).groups();

      socket.emit("eventGroupsData", groups);
      
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  });
  socket.on("fetchCompetitions", async () => {
    try {
      const competitions = await prisma.competition.findMany();

      socket.emit("competitionsData", competitions);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  });
  socket.on("fetchParticipants", async () => {
    try {
      const participants = await prisma.participant.findMany();
      const participantsData = await Promise.all(
        participants.map(async (participant) => {
          const club = await prisma.club.findUnique({
            where: {
              id: participant.clublinkId,
            },
          });

          const modifiedParticipant = {
            ...participant,
            birthYear: new Date(participant.birthYear)
              .toISOString()
              .split("T")[0],
            clublinkId: club ? club.name : null,
          };

          return modifiedParticipant;
        })
      );

      socket.emit("participantsData", participantsData);
    } catch (error) {
      console.error("Error fetching judges:", error);
    }
  });

  socket.on("fetchParticipant", async ({ id, serverSecretCode }) => {
    try {
      if ((serverSecretCode = !secretCode)) {
        throw "Try scanning the new QR-Code";
      }

      const participant = await prisma.participant.findUnique({
        where: {
          id: id,
        },
      });

      if (!participant) {
        // Participant not found
        socket.emit("participantNotFound");
        return;
      }

      const club = await prisma.club.findUnique({
        where: {
          id: participant.clublinkId,
        },
      });

      const modifiedParticipant = {
        ...participant,
        birthYear: new Date(participant.birthYear).toISOString().split("T")[0],
        clublinkId: club ? club.name : null,
      };

      socket.emit("participantData", modifiedParticipant);
    } catch (error) {
      console.error("Error fetching participant:", error);
    }
  });

  socket.on("fetchEvents", async ({ competitionId }) => {
    try {
      const participants = await prisma.participant.findMany();
  
      const events = [];
      const fetchedEventIds = new Set(); // Track fetched event IDs
  
      for (const participant of participants) {
        const eventTypes = participant.event.split(",");
  
        for (const eventType of eventTypes) {
          const participantEvents = await prisma.event.findMany({
            where: {
              competitionId: competitionId,
              division: participant.division,
              age_categorie: participant.age_category,
              type: eventType.trim(),
            },
          });
  
          // Filter out duplicate events based on event ID
          const uniqueParticipantEvents = participantEvents.filter(
            (event) => !fetchedEventIds.has(event.id)
          );
  
          events.push(...uniqueParticipantEvents);
          uniqueParticipantEvents.forEach((event) => fetchedEventIds.add(event.id));
        }
      }
  
      socket.emit("eventsData", events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  });
  
  
  
  socket.on("fetchAllEvents", async () => {
    try {
      const events = await prisma.event.findMany();

      socket.emit("events", events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  });

  socket.on("fetch-judge-events", async ({ judge, serverSecretCode }) => {
    try {
      if (serverSecretCode !== secretCode) {
        throw "Try scanning the new QR-Code";
      }

      // Find the judge by ID
      const judgeInfo = await prisma.user.findUnique({
        where: { username: judge },
        include: {
          events: {
            include: {
              participants: {
                include: {
                  scores: true,
                },
              },
              groups: {
                include: {
                  scores: true,
                },
              },
            },
          },
        },
      });

      if (!judgeInfo) {
        throw new Error("Judge not found");
      }

      const events = judgeInfo.events.map((event) => {
        const participantsWithScores = event.participants.filter(
          (participant) => participant.scores.length > 0
        );
        const groupsWithScores = event.groups.filter(
          (group) => group.scores.length > 0
        );

        return {
          ...event,
          participants: participantsWithScores,
          groups: groupsWithScores,
        };
      });

      

      // Emit the events to the judge
      socket.emit("judgeEvents", {
        events,
      });
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  });
  socket.on("fetchJudgeTypes", async ({ judgeId, eventId }) => {
    try {
      // Fetch the judge's types for the event from your data source
      const judgeTypes = await getJudgeTypes(judgeId, eventId);

      // Emit the judge types to the client
      socket.emit("judgeTypesData", judgeTypes);
    } catch (error) {
      console.error("Error fetching judge types:", error);
      // Emit an error event to the client if an error occurs
      socket.emit("judgeTypesError", "Error fetching judge types");
    }
  });

  //Deleting
  socket.on("delete-participant", async (participantID) => {
    try {
      const participant = await prisma.participant.delete({
        where: {
          id: participantID,
        },
      });
      socket.emit("participant-deleted", "Deleted");
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  });
  socket.on("delete-group", async (groupID) => {
    try {
      const group = await prisma.groups.delete({
        where: {
          id: groupID,
        },
      });
      socket.emit("group-deleted", "Deleted");
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  });
  socket.on("delete-judge", async (judgeID) => {
    try {
      const judges = await prisma.user.delete({
        where: {
          id: judgeID,
        },
      });
      socket.emit("judge-deleted", "Deleted");
    } catch (error) {
      console.error("Error deleting judge:", error);
    }
  });
  socket.on("delete-club", async (clubID) => {
    try {
      const club = await prisma.club.delete({
        where: {
          id: clubID,
        },
      });
      socket.emit("club-deleted", "Deleted");
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  });
  socket.on("delete-competition", async (competitionID) => {
    try {
      const competition = await prisma.competition.delete({
        where: {
          id: competitionID,
        },
      });
      socket.emit("competition-deleted", "Deleted");
    } catch (error) {
      console.error("Error deleting competition:", error);
    }
  });

  //updating
  socket.on("update-user", async ({ id, name, username, password, role }) => {
    try {
      // Find the user by ID
      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Update the user properties
      user.name = name;
      user.username = username;
      const passwordHash = CryptoJS.AES.encrypt(
        "BandaBouSplash01!",
        key
      ).toString();
      user.role = role || "judge"; // set the role to "judge" if it's not provided

      // Save the updated user
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: user,
      });

      // Emit a success event back to the client
      socket.emit("update-user-success", updatedUser);
    } catch (error) {
      console.error(error);
      // Emit an error event back to the client
      socket.emit("update-user-error", error);
    }
  });
  socket.on("update-club", async ({ id, name, cellPhone, email }) => {
    try {
      // Find the club by ID
      const club = await prisma.club.findUnique({
        where: { id: id },
      });

      if (!club) {
        throw new Error("Club not found");
      }

      // Update the club properties
      club.name = name;
      club.cellPhone = cellPhone;
      club.email = email;

      // Save the updated club
      const updatedClub = await prisma.club.update({
        where: { id: id },
        data: club,
      });

      // Emit a success event back to the client
      socket.emit("update-club-success", updatedClub);
    } catch (error) {
      console.error(error);
      // Emit an error event back to the client
      socket.emit("update-club-error", error);
    }
  });
  socket.on("update-event", async ({ id, name, startTime, endTime }) => {
    try {
      // Find the event by ID
      const event = await prisma.event.findUnique({
        where: { id: id },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // Update the event properties
      event.name = name;
      event.startTime = startTime;
      event.endTime = endTime;

      // Save the updated event
      const updatedEvent = await prisma.event.update({
        where: { id: id },
        data: event,
      });

      // Emit a success event back to the client
      socket.emit("update-event-success", updatedEvent);
    } catch (error) {
      console.error(error);
      // Emit an error event back to the client
      socket.emit("update-event-error", error);
    }
  });
  socket.on("update-competition", async ({ id, name }) => {
    try {
      // Find the competition by ID
      const competition = await prisma.competition.findUnique({
        where: { id: id },
      });

      if (!competition) {
        throw new Error("Competition not found");
      }

      // Update the competition properties
      competition.name = name;

      // Save the updated competition
      const updatedCompetition = await prisma.competition.update({
        where: { id: id },
        data: competition,
      });

      // Emit a success event back to the client
      socket.emit("update-competition-success", updatedCompetition);
    } catch (error) {
      console.error(error);
      // Emit an error event back to the client
      socket.emit("update-competition-error", error);
    }
  });
  socket.on(
    "update-participant",
    async ({
      id,
      lastName,
      firstName,
      birthYear,
      country,
      clublinkId,
      division,
      age_category,
      competition,
      event,
    }) => {
      try {
        const participant = await prisma.participant.findUnique({
          where: {
            id: id,
          },
        });

        if (!participant) {
          console.log("Participant not found!");
          return; // Exit the function if participant is not found
        }

        const club = await prisma.club.findFirst({
          where: {
            name: clublinkId,
          },
        });

        if (!club) {
          console.log("Club not found!");
          return; // Exit the function if club is not found
        }

        // Update the participant properties
        participant.clublinkId = club.id;
        participant.lastName = lastName;
        participant.firstName = firstName;
        participant.birthYear = new Date(birthYear);
        participant.country = country;
        participant.division = division;
        participant.age_category = age_category;
        participant.competition = competition;
        participant.event = event;

        const updatedParticipant = await prisma.participant.update({
          where: {
            id: id,
          },
          data: participant,
        });

       
      } catch (error) {
        console.error(error);
      }
    }
  );
});

// wifi setup
wifi.init({
  iface: null, // network interface, choose a random wifi interface if set to null
});

// app uses
app.use(cors());

//app gets
app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

wifi.scan((error) => {
  if (error) {
    console.log(error);
  } else {
    wifi.connect({ ssid: "BBS", password: "BandaBouSplash01!" }, (error) => {
      if (error) {
        console.log(error);
      } else {

        console.log("Connected to Wi-Fi network");
        

        // Delay server startup for 20 seconds after Wi-Fi connection
        setTimeout(() => {
          httpServer.listen(PORT, async () => {
            const ipAddress = await getIpAddress();
            console.log(`Server listening at http://${ipAddress}:${PORT}`);

            await createDefaultUser();
            await createTypes();
          });
        }, 10000);
      }
    });
  }
});
