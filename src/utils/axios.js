import axios from "axios";
import os from "os";

const PROTOCOL = "http:";
const DOMAIN = getIpAddress();
const PORT = ":3001";

const client = axios.create({
  baseURL: `${PROTOCOL}//${DOMAIN}${PORT}`,
});


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


async function http_get(route) {
  try {
    const response = await client.get(route);
    console.log(response.status);
    console.log(response.data);
    return Promise.resolve({ status: response.status, data: response.data });
  } catch (error) {
    console.error(error);
    return Promise.reject({ status: error.response.status, data: error.response.data });
  }
}

async function http_post(route, data) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control_Allow_Origin": "*",
  };
  try {
    const response = await client.post(route, data, { headers });
    console.log(response.status);
    console.log(response.data);
    return Promise.resolve({ status: response.status, data: response.data });
  } catch (error) {
    console.error(error);
    return Promise.reject({ status: error.response.status, data: error.response.data });
  }
}

async function http_delete(route) {
  try {
    const response = await client.delete(route);
    console.log(response.status);
    return Promise.resolve({ status: response.status, data: response.data });
  } catch (error) {
    console.error(error);
    return Promise.reject({ status: error.response.status, data: error.response.data });
  }
}

async function http_put(route, data) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control_Allow_Origin": "*",
  };
  try {
    const response = await client.put(route, data, { headers });
    console.log(response.status);
    console.log(response.data);
    return Promise.resolve({ status: response.status, data: response.data });
  } catch (error) {
    console.error(error);
    return Promise.reject({ status: error.response.status, data: error.response.data });
  }
}

export { http_post, http_get, http_delete, http_put };
