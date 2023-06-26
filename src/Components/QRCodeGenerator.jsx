import { 
  Image,
  Box, 
  Center, 
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import qrcode from "qrcode";
import { socket } from "../socket_io";


export function QRCodeGenerator({ ssid, password, username, userPassword, button }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const initialFocusRef = useRef();

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
    const wifiQRCodeData = `WIFI:S:${ssid};T:WPA;P:${password};U:${username};S:${userPassword};;T:IP;P:${ipAddress};;T:SECRET;P:${secretCode};;`;
    qrcode.toDataURL(wifiQRCodeData).then((dataURL) => {
      setQRCodeDataURL(dataURL);
    });
  }, [ssid, password, username, userPassword, ipAddress, secretCode]);

  return (
    <Popover
      placement="bottom-start"
      initialFocusRef={initialFocusRef}
      closeOnBlur={false}
    >
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>QR Code</PopoverHeader>
        <PopoverBody>
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
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}