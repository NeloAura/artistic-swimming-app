import { useEffect, useState } from 'react';
import { ChakraProvider,Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { socket } from "../socket_io";
import Navigation from './Navigation';
import { exportTableToCsv, exportTableToExcel } from '../exportUtils';






const ParticipantScoreTable = () => {
  const [participantScores, setParticipantScores] = useState([]);

  useEffect(() => {
    const fetchParticipantScores = async () => {
      socket.emit('participant-score-information');
      socket.on('participant-score-information', (data) => {
        setParticipantScores(data);
      });
      socket.on('error', (error) => {
        console.error('Error fetching participant scores:', error);
      });
    };

    fetchParticipantScores();

    return () => {
      socket.off('participant-scores');
      socket.off('error');
    };
  }, []);

  const handleScoreChange = (scoreId, newValue) => {
    // Update the score value in the state
    const updatedScores = participantScores.map((participant) => ({
      ...participant,
      scores: participant.scores.map((score) =>
        score.id === scoreId ? { ...score, value: newValue } : score
      ),
    }));
    setParticipantScores(updatedScores);

    // TODO: Update the score value in the database using the score ID and newValue
    // You can emit a socket event to send the updated score value to the server for database update
    socket.emit('update-score-value', { scoreId, newValue });
  };

  return (
    <ChakraProvider>
      {/* ... */}
      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Participant</Th>
            <Th>Score Type</Th>
            <Th>Score Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {participantScores.map((participant) =>
            participant.scores.map((score) => (
              <Tr key={score.id}>
                <Td>{participant.firstName} {participant.lastName}</Td>
                <Td>{score.type}</Td>
                <Td>
                  <input
                    type="number"
                    value={score.value}
                    onChange={(e) =>
                      handleScoreChange(score.id, parseFloat(e.target.value))
                    }
                  />
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {/* ... */}
    </ChakraProvider>
  );
};

export default ParticipantScoreTable;


