import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

// Function to calculate the average score for a participant
const calculateAverageScore = (scores) => {
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return total / scores.length;
};

const ParticipantScoreTable = ({ participantScores }) => {
  return (
    <Table variant='simple'>
      <Thead>
        <Tr>
          <Th>Participant</Th>
          <Th>Score</Th>
          <Th>Given By</Th>
          <Th>Average Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {participantScores.map((participant) => (
          <Tr key={participant.id}>
            <Td>{participant.firstName} {participant.lastName}</Td>
            <Td>{participant.score.value}</Td>
            <Td>{participant.score.users[0].name}</Td>
            <Td>{calculateAverageScore(participant.scores).toFixed(2)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ParticipantScoreTable;