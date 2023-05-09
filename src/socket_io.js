import io from "socket.io-client";
// import os from "os";

const PROTOCOL = "http:";
const DOMAIN = "localhost";
const PORT = ":3001";

const URL = `${PROTOCOL}//${DOMAIN}${PORT}`;
// process.env.NODE_ENV === 'production' ? undefined :
const socket = io.connect(URL);

// function getIpAddress() {
//   return new Promise((resolve, reject) => {
//     const ifaces = os.networkInterfaces();
//     let ipAddress;

//     Object.keys(ifaces).forEach(ifname => {
//       ifaces[ifname].forEach(iface => {
//         if (iface.family === 'IPv4' && !iface.internal) {
//           ipAddress = iface.address;
//         }
//       });
//     });

//     if (ipAddress) {
//       resolve(ipAddress);
//     } else {
//       reject(new Error('Unable to retrieve IP address'));
//     }
//   });
// }

function emit(eventName, data) {
    socket.emit(eventName, data);
}

function on(eventName, callback) {
  socket.on(eventName, (data) => {
    console.log(data);
    callback(data);
  });
}

export { emit, on , socket};
