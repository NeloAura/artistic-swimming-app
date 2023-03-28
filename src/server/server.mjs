//import here
import http from 'http';
import express from 'express';
import cors from 'cors';
// import {exec} from 'child_process'
import hotspot from 'node-hotspot'


//constants here
const Api = express();
const HTTP = http.Server(Api);

//execution here

Api.use(cors());

Api.get('/test', (req, res) => res.status(200).send('success!'));

HTTP.listen(3001, () => {
  console.log('listening on *:3001');
  
});


const options = {
  ssid: 'Aura', // Replace with your desired network name
  password: 'notinpan10', // Replace with your desired password
  maxClients: 8, // Maximum number of clients allowed to connect,
  force: true,
  disableInternet: false // Set to true to disable internet access for connected devices
};


hotspot.enable(options)
  .then(() => console.log('Hotspot started successfully!'))
  .catch(error => console.error('Failed to start hotspot:', error));


  // hotspot.disable()
  // .then(() => console.log('Hotspot stopped successfully!'))
  // .catch(error => console.error('Failed to stop hotspot:', error));
   