import React, { useEffect } from "react";
import {
  ChakraProvider,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
// import { SunIcon } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket } from "../socket_io";


const fetchParticipants = () => {
    return new Promise((resolve, reject) => {
      socket.emit("fetchParticipants");
      socket.on("participantsData", (participants) => {
        resolve(participants);
      });
      socket.on("connect_error", (error) => {
        reject(error);
        socket.disconnect();
      });
    });
  };
  
  const fetchGroups = () => {
    return new Promise((resolve, reject) => {
      socket.emit("fetchGroups");
      socket.on("groupsData", (groups) => {
        resolve(groups);
      });
      socket.on("connect_error", (error) => {
        reject(error);
        socket.disconnect();
      });
    });
  };
  
  const GeneratedNumberCard = () => {
    const [participants, setParticipants] = React.useState([]);
    const [groups, setGroups] = React.useState([]);
  
    useEffect(() => {
      const fetchParticipantData = async () => {
        try {
          const participantsData = await fetchParticipants();
          setParticipants(participantsData);
        } catch (error) {
          console.error("Error setting participants:", error);
        }
      };
  
      const fetchGroupData = async () => {
        try {
          const groupsData = await fetchGroups();
          setGroups(groupsData);
        } catch (error) {
          console.error("Error setting groups:", error);
        }
      };
  
      fetchParticipantData();
      fetchGroupData();
    }, []);
  
    return (
      <ChakraProvider resetCSS>
        <nav>
          <NavigationComp />
        </nav>
       
          <GeneratedNumberCardTable participants={participants} groups={groups} />
        
      </ChakraProvider>
    );
  };
  
  const GeneratedNumberCardTable = ({ participants, groups }) => {
    return (
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Participant and Group Data</TableCaption>
          <Thead>
            <Tr>
              <Th>Participant</Th>
              <Th>Generated Number</Th>
              <Th>Group</Th>
              <Th isNumeric>Group Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {participants.map((participant) => {
              const group = groups.find((g) =>
                g.participants.some((p) => p.id === participant.id)
              );
              const groupNumber = group ? group.generatedNumber : "";
              return (
                <Tr key={participant.id}>
                  <Td>{`${participant.firstName} ${participant.lastName}`}</Td>
                  <Td>{participant.generatedNumber}</Td>
                  <Td>{group ? group.groupName : ""}</Td>
                  <Td isNumeric>{groupNumber}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };
  
  export default GeneratedNumberCard;
