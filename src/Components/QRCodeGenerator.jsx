// Frontend code
import { Image, Box, Center, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import os from "os";

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

function generateSecretCode(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}


export function QRCodeGenerator({ ssid, password }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");

  useEffect(() => {
    const wifiQRCodeData = `WIFI:S:${ssid};T:WPA;P:${password};;T:IP;P:${getIpAddress()};;T:SECRET;P:${generateSecretCode()};;`;
    qrcode.toDataURL(wifiQRCodeData).then((dataURL) => {
      
      setQRCodeDataURL(dataURL);
    });
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
