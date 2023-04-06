import axios from "axios";

const PROTOCOL = "http:";
const DOMAIN = serverIpAddress;
const PORT = ":3001";

const client = axios.create({
  baseURL: `${PROTOCOL}//${DOMAIN}${PORT}`,
});

async function http_get(route) {
  try {
    const response = await client.get(route);
    console.log(response.status);
    console.log(response.data);
    return new RequestResult(response.status, response.data);
  } catch (error) {
    console.error(error);
    return new RequestResult(error.response.status, error.response.data);
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
    return new RequestResult(response.status, response.data);
  } catch (error) {
    console.error(error);
    return new RequestResult(error.response.status, error.response.data);
  }
}

async function http_delete(route) {
  try {
    const response = await client.delete(route);
    console.log(response.status);
    return new RequestResult(response.status, response.data);
  } catch (error) {
    console.error(error);
    return new RequestResult(error.response.status, error.response.data);
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
    return new RequestResult(response.status, response.data);
  } catch (error) {
    console.error(error);
    return new RequestResult(error.response.status, error.response.data);
  }
}

export { http_post, http_get, http_delete, http_put };
