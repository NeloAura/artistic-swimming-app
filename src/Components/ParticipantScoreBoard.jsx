import { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { socket } from "../socket_io";



// Function to calculate the average score for a participant
const calculateAverageScore = (scores) => {
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return total / scores.length;
};

const ParticipantScoreBoard = () => {
  const [participantScores, setParticipantScores] = useState([]);

  useEffect(() => {
    // Fetch participant score information from the server
    socket.on('participant-score-information', (data) => {
      setParticipantScores(data);
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.off('participant-score-information');
    };
  }, []);

  return (
    <Table variant='simple'>
      <Thead>
        <Tr>
          <Th>Participant</Th>
          <Th>Score</Th>
          <Th>Given By</Th>
          <Th>Average Score</Th>
          <Th>Division</Th>
          <Th>Age Category</Th>
          <Th>Type</Th>
        </Tr>
      </Thead>
      <Tbody>
        {participantScores.map((participant) => (
          <Tr key={participant.id}>
            <Td>{participant.firstName} {participant.lastName}</Td>
            <Td>{participant.score}</Td>
            <Td>{participant.givenBy}</Td>
            <Td>{calculateAverageScore(participant.scores).toFixed(2)}</Td>
            <Td>{participant.division}</Td>
            <Td>{participant.age_categorie}</Td>
            <Td>{participant.type}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ParticipantScoreBoard;


