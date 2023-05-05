// Frontend code
import { Image, Box, Center, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import os from "os";
import io from 'socket.io-client';

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

async function generateSecretCode(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  // Create a socket connection to the server
const ip = await getIpAddress();
const socket = io(`http://${ip}:3000`);
// Emit the secret code to the server
socket.emit('secretCode', secretCode);

  return code;
}


export function QRCodeGenerator({ ssid, password }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const ipAddress = await getIpAddress();
        const secretCode = generateSecretCode();

        const wifiQRCodeData = `WIFI:S:${ssid};T:WPA;P:${password};;T:IP;P:${ipAddress};;T:SECRET;P:${secretCode};;`;

        const dataURL = await qrcode.toDataURL(wifiQRCodeData);

        setQRCodeDataURL(dataURL);
      } catch (error) {
        console.error("An error occurred while generating the QR code:", error);
      }
    };

    generateQRCode();
  }, [ssid, password]);

  return (
    <Center h="100vh">
      <Box textAlign="center">
        <Heading mb={4}>Connect to ASA</Heading>
        <Image
          src={qrCodeDataURL}
          alt="WiFi QR code"
          boxSize="300px"
          objectFit="contain"
          align="center"
        />
      </Box>
    </Center>
  );
}

