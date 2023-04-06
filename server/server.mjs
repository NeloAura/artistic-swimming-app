// import libraries
import http from 'http';
import express from 'express';
import cors from 'cors';
import wifi from 'node-wifi';
import os from 'os';
import bodyParser from 'body-parser'
import dgram from 'dgram';


// constants
const app = express();
const server = http.createServer(app);
const PORT = 3001;
const UDPPORT = 3010;
const routerIp = '192.168.1.255';
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

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

async function sendMessage(message, client, port, address) {
  const ip = await getIpAddress();
  const data = `${message}${ip}`;
  client.send(data, port, address, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Message sent to ${address}:${port}`);
    }
  });
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
            // Create a UDP server to broadcast the IP address
            const udpServer = dgram.createSocket('udp4');
            udpServer.bind(UDPPORT);
            
            udpServer.on('listening', () => {
              const address = udpServer.address();
              console.log(`UDP server is listening on ${address.address}:${address.port}`);
            });
            
            
            // Listen for UDP messages
            udpServer.on('message', (message, rinfo) => {
              const msg = message.toString();
              
              // If the message is a request for the IP address, send the IP address back
              if (msg === 'request-ip-address') {
                // const ip = getIpAddress();
                // udpServer.send(`server-ip-address:${ip}`, rinfo.port, rinfo.address);
                sendMessage(`server-ip-address:`, udpServer, rinfo.port, rinfo.address)
              }
            });
            
            // Broadcast the IP address every 10 seconds
            setInterval(() => {
              const ip = getIpAddress();
              udpServer.send('request-ip-address', 0, 18, UDPPORT, routerIp);
            }, 10000);
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
