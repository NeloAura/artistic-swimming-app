import { Image,Box, Center, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import qrcode from "qrcode";








export function QRCodeGenerator({ ssid, password , ipAddress , secretCode }) {
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
 
  

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