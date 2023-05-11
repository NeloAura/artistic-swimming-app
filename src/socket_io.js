import io from "socket.io-client";
// import os from "os";

const PROTOCOL = "http:";
const DOMAIN = "localhost";
const PORT = ":3001";

const URL = `${PROTOCOL}//${DOMAIN}${PORT}`;
// process.env.NODE_ENV === 'production' ? undefined :
const socket = io.connect(URL);


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
