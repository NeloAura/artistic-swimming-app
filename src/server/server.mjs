import http from 'http';
import express from 'express';
import cors from 'cors';
import hotspot from  'node-hotspot'

const Api = express();
const HTTP = http.Server(Api);
// const hotspot = new hotspot();
 
const opts = {
    ssid: 'Artistic Swimming ', 
    password: 'notinpan10', 
    force: true, // (optional)  if hosting a network already turn it off and run ours.
    //adaptor: 'Ethernet'  (optional / false) name of adaptor to have ICS (Internet Connection Sharing) share internet from, passing false disables ICS all together - if non givin node-hotspot will attempt to find currently connected adaptor automatically
};
 
Api.use(cors());

Api.get('/test', (req, res) => res.status(200).send('success!'));

HTTP.listen(9001, () => {
    console.log('listening on *:9001');
});

hotspot.enable(opts)
    .then(function() {
        console.log('Hotspot Enabled')
    })
    .catch(function(e) {
        Console.log('Something went wrong; Perms?', e)
    });

    hotspot.stats(opts)
    .then(function(status) {
        console.log('Hotspot status: ' + status) //status contains clients object and state
    });    