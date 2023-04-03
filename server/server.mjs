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
const PORT = 3000;
const UDPPORT = 3001;

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

       
          
         // Start the socket server
         server.listen(PORT, () => {
          const ipAddress = Object.values(os.networkInterfaces())
            .flat()
            .filter(({ family, internal }) => family === 'IPv4' && !internal)
            .map(({ address }) => address)[0];
          
          console.log(`Server listening at http://${ipAddress}:${PORT}`);

     // Create a UDP server to broadcast the IP address
  const udpServer = dgram.createSocket('udp4');
  
  udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP server is listening on ${address.address}:${address.port}`);
  });
  
  // Listen for UDP messages
  udpServer.on('message', (message, rinfo) => {
    const msg = message.toString();
    
    // If the message is a request for the IP address, send the IP address back
    if (msg === 'request-ip-address') {
      const ip = getIpAddress();
      udpServer.send(`server-ip-address:${ip}`, rinfo.port, rinfo.address);
    }
  });
  
  // Broadcast the IP address every 10 seconds
  setInterval(() => {
    const ip = getIpAddress();
    udpServer.send(`server-ip-address:${ip}`, UDPPORT, '255.255.255.255');
  }, 10000);

        });

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


//functions
function getIpAddress() {
  const ifaces = os.networkInterfaces();
  let ipAddress;

  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address;
      }
    });
  });

  return ipAddress;
}


   