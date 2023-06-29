import { useEffect, useState } from "react";
import {
  ChakraProvider,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast
} from "@chakra-ui/react";
import { socket } from "../socket_io";
import Navigation from "./Navigation";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';


const fetchEvent = async () => {
  return new Promise((resolve, reject) => {
    socket.emit("fetchAllEvents");
    socket.on("events", (events) => {
      resolve(events);
    });
    socket.on("connect_error", (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const ParticipantScoreTable = () => {
  const [participantScores, setParticipantScores] = useState([]);
  const [events, setEvents] = useState([]);
  const [updatedScores, setUpdatedScores] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();


  useEffect(() => {
    const fetchParticipantScores = async () => {
      socket.emit("participant-score-information");
      socket.on("participant-score-information", (data) => {
        setParticipantScores(data);
      });
      socket.on("error", (error) => {
        console.error("Error fetching participant scores:", error);
      });
    };

    fetchParticipantScores();

    return () => {
      socket.off("participant-scores");
      socket.off("error");
    };
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventsData = await fetchEvent();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error setting events:", error);
      }
    };

    fetchEventData();
  }, []);

  const handleScoreChange = (participantId, scoreId, newValue) => {
    const updatedParticipantScores = participantScores.map((participant) => {
      if (participant.id === participantId) {
        const updatedScores = participant.scores.map((score) =>
          score.id === scoreId ? { ...score, value: newValue } : score
        );
        return { ...participant, scores: updatedScores };
      }
      return participant;
    });

    setParticipantScores(updatedParticipantScores);
    setUpdatedScores(updatedParticipantScores);
  };

  const handleUpdateScores = () => {
    
    socket.emit('update-score-value', updatedScores)
     
        toast({
          title: 'Scores Updated',
          description: 'Participant scores have been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => {
          navigate('/dashboard') 
        }, 5000);
      
      }

  const handleExportCSV = () => {
    const csvData = participantScores.flatMap((participant) =>
      participant.scores.map((score) => ({
        Participant: `${participant.firstName} ${participant.lastName}`,
        "Event Info": `${participant.division} - ${
          participant.age_category
        } - ${events.find((event) => event.id === score.eventlinkId)?.type}`,
        "Score Type": score.type,
        "Score Value": score.value,
      }))
    );

    const csvContent = [
      Object.keys(csvData[0]).join(","), // CSV header row
      ...csvData.map((row) => Object.values(row).join(",")), // CSV data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "participant_scores.csv");
  };

  return (
    <ChakraProvider>
      <nav>
        <Navigation />
      </nav>

      <Table variant="striped" colorScheme="purple">
        <Thead>
          <Tr>
            <Th>Participant</Th>
            <Th>Event Info</Th>
            <Th>Score Type</Th>
            <Th>Score Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {participantScores.map((participant) =>
            participant.scores.map((score) => (
              <Tr key={score.id}>
                <Td>
                  {participant.firstName} {participant.lastName}
                </Td>
                <Td>
                  {participant.division} - {participant.age_category} -{" "}
                  {events.find((event) => event.id === score.eventlinkId)?.type}
                </Td>
                <Td>{score.type}</Td>
                <Td>
                  <input
                    type="number"
                    value={score.value}
                    onChange={(e) =>
                      handleScoreChange(
                        participant.id,
                        score.id,
                        parseFloat(e.target.value)
                      )
                    }
                    key={`${participant.id}-${score.id}`} // Add unique key prop
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <Button onClick={handleExportCSV} mt={4} colorScheme="teal">
        Export as CSV
      </Button>
      <Button onClick={handleUpdateScores} mt={4} colorScheme="teal">
        Update Scores
      </Button>
    </ChakraProvider>
  );
};

export default ParticipantScoreTable;
