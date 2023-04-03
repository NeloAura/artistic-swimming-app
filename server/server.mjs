// import libraries
import http from 'http';
import express from 'express';
import cors from 'cors';
// import { io } from 'socket.io-client';
import { Server } from 'socket.io';
import wifi from 'node-wifi';
import os from 'os';
import networkAddress from 'network-address'
import bodyParser from 'body-parser'

// constants
const app = express();
const server = http.createServer(app);
const io = new Server(http);
const serverIPAddress = networkAddress.ipv4(os.networkInterfaces());
const PORT = 3000;

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

       

        // Socket server event handling
        io.on('connection', (socket) => {
          console.log('A client connected');

          // Send a test message to the connected client
          socket.emit('serverIPAddress', serverIPAddress);

          // Handle incoming messages from the client
          socket.on('message', (data) => {
            console.log('Received message from client:', data);
          });
        });
          
         // Start the socket server
         server.listen(PORT, () => {
          const ipAddress = Object.values(os.networkInterfaces())
            .flat()
            .filter(({ family, internal }) => family === 'IPv4' && !internal)
            .map(({ address }) => address)[0];
          
          console.log(`Server listening at http://${ipAddress}:${PORT}`);
        });

      }
    });
  }
});

// middleware
app.use(cors());

// routes
app.get('/test', (req, res) => res.status(200).send('success!'));
app.use('/users', require('../Controller/users.controller'));


// const options = {
//   ssid: 'Aura', // Replace with your desired network name
//   password: 'notinpan10', // Replace with your desired password
//   maxClients: 8, // Maximum number of clients allowed to connect,
//   force: true,
//   disableInternet: false // Set to true to disable internet access for connected devices
// };


// hotspot.enable(options)
//   .then(() => console.log('Hotspot started successfully!'))
//   .catch(error => console.error('Failed to start hotspot:', error));


  // hotspot.disable()
  // .then(() => console.log('Hotspot stopped successfully!'))
  // .catch(error => console.error('Failed to stop hotspot:', error));
   