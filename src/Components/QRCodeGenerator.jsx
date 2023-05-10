import { Image,Box, Center, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import qrcode from "qrcode";
import { socket } from "../socket_io";







export function QRCodeGenerator({ ssid, password  }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [secretCode, setSecretCode] = useState("");
  

  useEffect(() => {
    socket.emit("ipAddress-r")
    socket.on("ipAddress", (ipAddress) => {
      setIpAddress(ipAddress);
      console.log(`ip: ${ipAddress}`)
    });
  }, []);

  useEffect(() => {
    socket.emit("secretCode-r")
    socket.on("secretCode", (secretCode) => {
      setSecretCode(secretCode);
    });
  }, []);

  useEffect(() => {
    const wifiQRCodeData = `WIFI:S:${ssid};T:WPA;P:${password};;T:IP;P:${ipAddress};;T:SECRET;P:${secretCode};;`;
    qrcode.toDataURL(wifiQRCodeData).then((dataURL) => {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      setQRCodeDataURL(dataURL);
    });
  }, [ssid, password , ipAddress , secretCode]);

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