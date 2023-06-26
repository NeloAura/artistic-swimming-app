import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  CardFooter,
  Checkbox,
  Badge,
  Button,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverFooter,
  Stack,
  Box,
  FormLabel,
  Input,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { SunIcon, DeleteIcon } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket, emit } from "../socket_io";
import { useParams } from 'react-router-dom';

const ParticipantCard = () => {
  const [participants, setParticipants] = React.useState([]);
  const { combinedParams } = useParams();
  const [eventId, competitionID, division, ageCategory, eventType] = combinedParams.split(',');

  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        const participantsData = await fetchParticipants(eventId, competitionID, division, ageCategory, eventType);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error setting participants:", error);
      }
    };

    fetchParticipantsData();
  }, []);

  const fetchParticipants = async (eventId, competitionID, division, ageCategory, eventType) => {
    const parsedEventID = parseInt(eventId, 10);
    const parsedComptitionID = parseInt(competitionID, 10);
    return new Promise((resolve, reject) => {
      socket.emit("fetch-participants",{id:parsedEventID, parsedComptitionID, division, ageCategory, eventType});
      socket.on("participantsData", (participants) => {
        resolve(participants);
      });
      socket.on("connect_error", (error) => {
        reject(error);
        socket.disconnect();
      });
    });
  };

  return (
    <ChakraProvider resetCSS>
      <nav>
        <NavigationComp />
      </nav>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {participants.map((participant) => (
          <ParticipantCardItem
            key={participant.id}
            participant={participant}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

const ParticipantCardItem = ({ participant}) => {


  return (
    <Card>
      <CardHeader>
        <SunIcon boxSize={8} color="blue.300" />
      </CardHeader>
      <CardBody>
        <Badge colorScheme="purple">Participant</Badge>
        <br />
        <Text as="b">{participant.firstName}</Text>
        <br />
        <Badge variant="solid" colorScheme="blue">
          {participant.generatedNumber}
        </Badge>
      </CardBody>
     <CardFooter></CardFooter>
    </Card>
  );
};

export default ParticipantCard;
