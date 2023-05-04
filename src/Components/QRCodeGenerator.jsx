// Frontend code
import { Image, Box, Center, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export function QRCodeGenerator({ ssid, password }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const socket = io("http://localhost:3001");

  useEffect(() => {
    socket.emit("generateQRCode", { ssid, password});

    socket.on("QRCodeData", (dataURL) => {
      setQRCodeDataURL(dataURL);
    });

    return () => {
      socket.off("QRCodeData");
    };
  }, [ssid, password, socket]);

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
