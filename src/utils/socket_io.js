import io from "socket.io-client";
import os from "os";

const PROTOCOL = "http:";
const DOMAIN = getIpAddress();
const PORT = ":3001";

const socket = io(`${PROTOCOL}//${DOMAIN}${PORT}`);

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

function emit(eventName, data) {
  return new Promise((resolve, reject) => {
    socket.emit(eventName, data, (response) => {
      console.log(response.status);
      console.log(response.data);
      if (response.error) {
        console.error(response.error);
        reject({ status: response.status, data: response.error });
      } else {
        resolve({ status: response.status, data: response.data });
      }
    });
  });
}

function on(eventName, callback) {
  socket.on(eventName, (data) => {
    console.log(data);
    callback(data);
  });
}

export { emit, on };
