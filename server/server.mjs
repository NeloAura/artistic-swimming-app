// import libraries
import http from 'http';
import express from 'express';
import socketio from "socket.io";
import qrcode from 'qrcode'
import cors from 'cors';
import wifi from 'node-wifi';
import os from 'os';
import bodyParser from 'body-parser'



// constants
const app = express();
const server = http.createServer(app);
const PORT = 3001;
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const io = socketio(server);

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
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

async function createDefaultUser() {
  const adminUser = await prisma.user.findUnique({ where: { username: 'admin' } });
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

io.on("connection", (socket) => {
  console.log("A client has connected");

  socket.on("generateQRCode", ({ ssid, password }) => {
    
    const wifiQRCodeData = `WIFI:S:${ssid};T:WPA;P:${password};;T:IP;P:${getIpAddress()};;T:SECRET;P:${generateSecretCode()};;`;
    qrcode.toDataURL(wifiQRCodeData).then((dataURL) => {
      socket.emit("QRCodeData", dataURL);
    });
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
          server.listen(PORT, async () => {
            const ipAddress = await getIpAddress();
            console.log(`Server listening at http://${ipAddress}:${PORT}`);
            await createDefaultUser();
          
          });
        }, 20000);
      }
    });
  }
});



// middleware
app.use(cors());
app.use(bodyParser.json());

// routes
app.get('/test', (req, res) => res.status(200).send('success!'));
// app.use('/users', require('../Controller/users.controller'));
