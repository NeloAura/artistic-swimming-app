//import here
import http from 'http';
import express from 'express';
import cors from 'cors';
import {exec} from 'child_process'
import hotspot from  'node-hotspot'

//constants here
const Api = express();
const HTTP = http.Server(Api);
// const command = '"C:\\Program Files (x86)\\Treexy\\Omnify Hotspot\\OmnifyHotspot.exe"';
// const args = ['start', 'Artistic Swimming', 'notinpan10'];

// const hotspot = new hotspot();
// const opts = {
//     ssid: 'Artistic Swimming ', 
//     password: 'notinpan10', 
//     force: true, // (optional)  if hosting a network already turn it off and run ours.
//     //adaptor: 'Ethernet'  (optional / false) name of adaptor to have ICS (Internet Connection Sharing) share internet from, passing false disables ICS all together - if non givin node-hotspot will attempt to find currently connected adaptor automatically
// };
 
//execution here

Api.use(cors());

Api.get('/test', (req, res) => res.status(200).send('success!'));





exec('netsh wlan set hostednetwork mode=allow ssid=Artistic key=notinpan10', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }

  // The command executed successfully, so we can now start the hosted network
  exec('netsh wlan start hostednetwork', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});


// hotspot.enable(opts)
//     .then(function() {
//         console.log('Hotspot Enabled')
//     })
//     .catch(function(e) {
//         Console.log('Something went wrong; Perms?', e)
//     });

//     hotspot.stats(opts)
//     .then(function(status) {
//         console.log('Hotspot status: ' + status) //status contains clients object and state
//     });    