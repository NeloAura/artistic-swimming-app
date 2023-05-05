// import libraries
import http from 'http';
import bcrypt from 'bcryptjs';
import express from 'express';
import {Server} from 'socket.io';
import wifi from 'node-wifi';
import os from 'os';
import{ PrismaClient } from '@prisma/client';



// constants
const app = express();
const httpServer = http.createServer(app);
const PORT = 3001;
const prisma = new PrismaClient();
const io = new Server(httpServer);

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

async function createDefaultUser() {
  const adminUser = await prisma.user.findUnique({ where: { iduser: 1 } });
  if (!adminUser) {
    const passwordHash = await bcrypt.hash('BandaBouSplash01!', 10);
    await prisma.user.create({
      data: {
        Name: 'BBS Admin',
        Username: 'admin',
        Password: passwordHash,
        Role: 'admin'
      }
      
    });
    
  }
   
}

io.on("connection", (socket) => {
  console.log("A client has connected");

  socket.on('secretCode', (secretCode) => {
    console.log(`Received secret code: ${secretCode}`);
    // Do something with the secret code
  });
  socket.on('authenticate', async ({ username, password }) => {
    try {
      // Find the user by their username
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        throw 'User not found';
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw 'Password is incorrect';
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

      // Send the token to the client
      socket.emit('authenticated', { token });

    } catch (error) {
      console.error(error);
      socket.emit('authenticationFailed', { message: 'Authentication failed' });
    }
  });
  socket.on('register-user', async ({ name, username, password, role }) => {
    try {
      // Check if the username already exists
      const existingUser = await prisma.user.findUnique({ where: { username } });
  
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
          passwordHash,
          role: role || 'judge', // set the role to "judge" if it's not provided
        },
      });
  
      // Generate a JWT token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);
  
      // Send the token to the client
      socket.emit('registered', { token });
  
    } catch (error) {
      console.error(error);
      socket.emit('registrationFailed', { message: 'Registration failed' });
    }
  });
  
});


// wifi setup
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
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
        }, 20000);
      }
    });
  }
});




