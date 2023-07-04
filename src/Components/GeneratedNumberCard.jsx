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
  Box,
  Button
} from "@chakra-ui/react";
// import { SunIcon } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket } from "../socket_io";
import { saveAs } from "file-saver";


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
    if (!participants || !groups) {
      return null; // or render a loading state
    }
  
    const getColorFromGeneratedNumber = (generatedNumber) => {
      if (generatedNumber > 50) {
        return "green.200";
      } else if (generatedNumber > 25) {
        return "yellow.200";
      } else {
        return "red.200";
      }
    };

    const handleExportCSV = () => {
      // Prepare CSV data
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Participant,Generated Number\n';
      participants.forEach((participant) => {
        csvContent += `${participant.firstName} ${participant.lastName},${participant.generatedNumber}\n`;
      });
      csvContent += '\nGroup,Generated Number\n';
      groups.forEach((group) => {
        csvContent += `${group.groupName},${group.generatedNumber}\n`;
      });
  
      // Create a Blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'generatedNumbers.csv');
    };
  
  
    return (
      <TableContainer>
        <Table variant="simple">
          <TableCaption color="gray.500">----------------</TableCaption>
          <Thead>
            <Tr>
              <Th>Participant</Th>
              <Th isNumeric>Generated Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {participants.map((participant) => (
              <Tr key={`participant-${participant.id}`}>
                <Td>{`${participant.firstName} ${participant.lastName}`}</Td>
                <Td isNumeric>
                  <Box
                    bg={getColorFromGeneratedNumber(participant.generatedNumber)}
                    p={2}
                    borderRadius="md"
                  >
                    {participant.generatedNumber}
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Table variant="simple">
          
          <Thead>
            <Tr>
              <Th>Group</Th>
              <Th isNumeric>Group Number</Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.map((group) => (
              <Tr key={`group-${group.id}`}>
                <Td>{group.groupName}</Td>
                <Td isNumeric>
                  <Box
                    bg={getColorFromGeneratedNumber(group.generatedNumber)}
                    p={2}
                    borderRadius="md"
                  >
                    {group.generatedNumber}
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button colorScheme="blue" onClick={handleExportCSV} mt="4" mb="4">
        Export CSV
      </Button>
      </TableContainer>
    );
  };
  
  
  
  export default GeneratedNumberCard;
