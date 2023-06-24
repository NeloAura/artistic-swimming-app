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

const secretCode = generateSecretCode();

io.on("connection", async (socket) => {
 
  //Tools
  const ipAddress = await getIpAddress();
  console.log("A client has connected");
  
  //Specials
  socket.emit("ipAddress", ipAddress);
  socket.emit("secretCode", secretCode);

  //Special-Requests
  socket.on("ipAddress-r", () => {
    socket.emit("ipAddress", ipAddress);
    });
    socket.on("secretCode-r", () => {
      socket.emit("secretCode", secretCode);
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
  socket.on("register-competition", async ({ name}) => {
    try {
      // Check if the username already exists
      const existingCompetition = await prisma.competition.findUnique({
        where: { name: name },
      });

      if (existingCompetition) {
        throw "Competition Already exists";
      }

      // Hash the password
      

      // Create the new user
      const newCompetition = await prisma.competition.create({
        data: {
          name,
          
           // set the role to "judge" if it's not provided
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("register-event", async ({ id, name, type, time }) => {
    try {
      // Check if the event already exists
      const existingEvent = await prisma.event.findUnique({
        where: { name: name },
      });
  
      if (existingEvent) {
        throw "Event already exists";
      }
  
      // Create the new event and associate it with the provided CompetitionID
      const newEvent = await prisma.event.create({
        data: {
          name,
          type,
          time,
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
