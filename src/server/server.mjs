// import libraries
import http from 'http';
import express from 'express';
import cors from 'cors';
// import { io } from 'socket.io-client';
import { Server } from 'socket.io';
import wifi from 'node-wifi';
import os from 'os';
import networkAddress from 'network-address'

// constants
const app = express();
const server = http.createServer(app);
const io = new Server(http);
const serverIPAddress = networkAddress.ipv4(os.networkInterfaces());

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
         server.listen(9001, () => {
          console.log('Server listening on *:9001');
        });

      }
    });
  }
});

// middleware
app.use(cors());

// routes
app.get('/test', (req, res) => res.status(200).send('success!'));



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
   