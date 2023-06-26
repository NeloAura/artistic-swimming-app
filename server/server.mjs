// import libraries
import http from "http";
import bcrypt from "bcryptjs";
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
    console.log(code);
  }

  return code;
}

async function createDefaultUser() {
  const adminUser = await prisma.user.findUnique({ where: { id: 1 } });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash("BandaBouSplash01!", 10);
    await prisma.user.create({
      data: {
        name: "BBS Admin",
        username: "admin",
        password: passwordHash,
        role: "admin",
      },
    });
  }
}

async function createTypes() {
  const judgeTypes = ["execution", "difficulty", "artisticExpression", "artisticImpressions"];

  await Promise.all(judgeTypes.map(async (type) => {
    const existingType = await prisma.type.findUnique({ where: { name: type } });
    
    if (!existingType) {
      await prisma.type.create({
        data: {
          name: type,
        },
      });
    }
  }));

  console.log("Judge types created");
}


const secretCode = generateSecretCode();

io.on("connection", async (socket) => {
 
  //Tools
  const ipAddress = await getIpAddress();
  console.log("A client has connected");
  
  //Specials
  socket.emit("ipAddress", ipAddress);
  socket.emit("secretCode", secretCode);

  const MAX_NUMBER = 100; // Maximum number for random generation

  socket.on('assign-random-numbers', async () => {
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
  
      console.log('Random numbers assigned successfully');
    } catch (error) {
      console.error(error);
    }
  });
  
  // Function to generate a random number within a given range
  function generateRandomNumber(range) {
    return Math.floor(Math.random() * range) + 1;
  }
  
  

  //Special-Requests
  socket.on("ipAddress-r", () => {
    socket.emit("ipAddress", ipAddress);
    });
  socket.on("secretCode-r", () => {
      socket.emit("secretCode", secretCode);
    });
  socket.on("fetch-participants", async ({ eventId, competitionId, division, age_categorie, type }) => {
      try {
        // Fetch the event
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });
    
        if (!event) {
          throw new Error("Event not found");
        }
    
        // Fetch participants matching the conditions
        const participants = await prisma.participant.findMany({
          where: {
            competitionId,
            division,
            age_category: age_categorie,
            type,
            NOT: {
              groups: {
                some: {},
              },
            },
          },
        });
    
        console.log("Fetched participants:", participants);
      } catch (error) {
        console.error(error);
      }
    });
    


  //Authentication
  socket.on("authenticate", async ({ username, password }) => {
    try {
      // Find the user by their username
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        throw "User not found";
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

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
      const isPasswordValid = await bcrypt.compare(password, user.password);

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
      const passwordHash = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          password: passwordHash,
          role: role || "judge", // set the role to "judge" if it's not provided
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("register-participant", async ({ lastName, firstName, birthYear, country, clublinkId, division, age_category, competition , event }) => {
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
          event
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("register-club", async ({ name, cellPhone, email}) => {
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
  
      // Define the divisions, age categories, and types
      const divisions = ["AWD", "Novice-A", "Novice-B", "Age Group"];
      const ageCategories = {
         AWD: ["noagelimit"],
        "Novice-A": ["6&Under", "7&8", "9&10", "11&12", "13&O"],
        "Novice-B": ["6&Under", "7&8", "9&10", "11&12", "13&O"],
        "Age Group": ["10&Under", "12&Under", "Youth", "Junior", "Senior"],
      };
      const types = {
        AWD: ["Solo", "Duet", "Mix duet", "Team"],
        "Novice-A": ["Solo", "Duet", "Mix duet", "Team"],
        "Novice-B": ["Solo", "Duet", "Mix duet", "Team"],
        "Age Group": ["Solo", "Male Solo", "Mix duet", "Duet", "Team"],
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
              division:division,
              age_categorie: ageCategory,
              type:type,
              competitionId: newCompetition.id,
              startTime:"...",
              endTime:"..."
            };
            templateEvents.push(templateEvent);
          });
        });
      });
  
      // Create template events in the database
      await Promise.all(templateEvents.map((event) => prisma.event.create({ data: event })));
  
      console.log("Competition created with template events");
    } catch (error) {
      console.error(error);
    }
  });
  
  
  
  socket.on("register-event", async ({ id,  name, division , age_categorie, type, startTime , endTime}) => {
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
          name:name,
          division:division,
          age_categorie:age_categorie,
          type:type,
          startTime:startTime , 
          endTime:endTime,
          competition: {
            connect: { id: id },
          },
        },
      });
  
      console.log("Event created:", newEvent);
    } catch (error) {
      console.error(error);
    }
  });
  

  //fetching
  socket.on('fetchJudges', async () => {
    try {
      const judges = await prisma.user.findMany({
        where: {
          role: 'judge',
        },
      });
      socket.emit('judgesData', judges);
    } catch (error) {
      console.error('Error fetching judges:', error);
    }
  });
  socket.on('fetchClubs', async () => {
    try {
      const clubs = await prisma.club.findMany();
      
      socket.emit('clubsData', clubs);
    } catch (error) {
      console.error('Error fetching judges:', error);
    }
  });
  socket.on('fetchGroups', async () => {
    try {
      const groups = await prisma.groups.findMany();
      
      socket.emit('groupsData', groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  });
  socket.on('fetchCompetitions', async () => {
    try {
      const competitions = await prisma.competition.findMany();
      
      socket.emit('competitionsData', competitions);
    } catch (error) {
      console.error('Error fetching judges:', error);
    }
  });
  socket.on('fetchParticipants', async () => {
    try {
      const participants = await prisma.participant.findMany();
      const participantsData = await Promise.all(
        participants.map(async participant => {
          const club = await prisma.club.findUnique({
            where: {
              id: participant.clublinkId
            }
          });
  
          const modifiedParticipant = {
            ...participant,
            birthYear: new Date(participant.birthYear).toISOString().split('T')[0],
            clublinkId: club ? club.name : null
          };
  
          return modifiedParticipant;
        })
      );
  
      socket.emit('participantsData', participantsData);
    } catch (error) {
      console.error('Error fetching judges:', error);
    }
  });
  socket.on('fetchEvents', async (id) => {
    try {
      const events = await prisma.event.findMany({
        where: { competitionId: id },
      });
      
      socket.emit('eventsData', events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  });
  

  //Deleting
  socket.on('delete-participant', async ( participantID ) => {
    try {
      const participant = await prisma.participant.delete({
        where: {
          id: participantID,
        },
      });
      socket.emit('participant-deleted', "Deleted");
    } catch (error) {
      console.error('Error deleting participant:', error);
    }
  });
  socket.on('delete-judge', async ( judgeID ) => {
    try {
      const judges = await prisma.user.delete({
        where: {
          id: judgeID,
        },
      });
      socket.emit('judge-deleted', "Deleted");
    } catch (error) {
      console.error('Error deleting judge:', error);
    }
  });
  socket.on('delete-club', async (clubID ) => {
    try {
      const club = await prisma.club.delete({
        where: {
          id: clubID,
        },
      });
      socket.emit('club-deleted', "Deleted");
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  });
  socket.on('delete-competition', async (competitionID ) => {
    try {
      const competition = await prisma.competition.delete({
        where: {
          id: competitionID,
        },
      });
      socket.emit('competition-deleted', "Deleted");
    } catch (error) {
      console.error('Error deleting competition:', error);
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
      user.password = await bcrypt.hash(password, 10);
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
      club.email =email;
      
  
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
  socket.on("update-event", async ({ id, name, startTime,endTime}) => {
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
      event.endTime =endTime;
      
  
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
  socket.on("update-competition", async ({ id , name}) => {
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
  socket.on("update-participant", async ({ id, lastName, firstName, birthYear, country, clublinkId, division, age_category, competition , event }) => {
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
  
      console.log("Participant updated:", updatedParticipant);
    } catch (error) {
      console.error(error);
    }
  });
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

wifi.scan((error, networks) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Available networks:", networks);

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
          });
        }, 10000);
      }
    });
  }
});
