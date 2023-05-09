// import libraries
import http from 'http';
import bcrypt from 'bcryptjs';
import express from 'express';
import {Server} from 'socket.io';
import wifi from 'node-wifi';
import cors from 'cors';
import os from 'os';
import{ PrismaClient } from '@prisma/client';




// constants
const app = express();
const httpServer = http.createServer(app);
const PORT = 3001;
const prisma = new PrismaClient();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// functions

function getIpAddress() {
  return new Promise((resolve, reject) => {
    const ifaces = os.networkInterfaces();
    let ipAddress;

    Object.keys(ifaces).forEach(ifname => {
      ifaces[ifname].forEach(iface => {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address;
        }
      });
    });

    if (ipAddress) {
      resolve(ipAddress);
    } else {
      reject(new Error('Unable to retrieve IP address'));
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
    const passwordHash = await bcrypt.hash('BandaBouSplash01!', 10);
    await prisma.user.create({
      data: {
        name: 'BBS Admin',
        username: 'admin',
        password: passwordHash,
        role: 'admin'
      }
      
    });
    
  }
   
}

const secretCode = generateSecretCode();

io.on("connection", async (socket) => {
  const ipAddress = await getIpAddress();
  console.log("A client has connected");
  socket.emit("ipAddress", ipAddress);
  socket.emit("secretCode", secretCode);
  socket.on('authenticate', async ({ username, password }) => {
    try {
      // Find the user by their username
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        throw 'User not found';
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw 'Password is incorrect';
      }
      
      return socket.emit('status',"200");

    } catch (error) {
      console.error(error);
      return socket.emit('status','401')
    }
  });
  socket.on('register-user', async ({ name, username, password, role }) => {
    try {
      // Check if the username already exists
      const existingUser = await prisma.user.findUnique({ where: { username: username } })
      

  
      if (existingUser) {
        throw 'Username is already taken';
      }
  
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          password: passwordHash,
          role: role || 'judge', // set the role to "judge" if it's not provided
        },
      });

      
  
  
    } catch (error) {
      console.error(error);
      
    }
  });
  
});


// wifi setup
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});

// app uses
app.use(cors());

//app gets
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

wifi.scan((error, networks) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Available networks:', networks);

    wifi.connect({ ssid: 'BBS', password: 'BandaBouSplash01!' }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Connected to Wi-Fi network');

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



