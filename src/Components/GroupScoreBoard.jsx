import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

// Function to calculate the average score for a group
const calculateAverageScore = (scores) => {
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return total / scores.length;
};

const GroupScoreTable = ({ groupScores }) => {
  return (
    <Table variant='simple'>
      <Thead>
        <Tr>
          <Th>Group</Th>
          <Th>Score</Th>
          <Th>Given By</Th>
          <Th>Average Score</Th>
        </Tr>
      </Thead>
      <Tbody>
        {groupScores.map((group) => (
          <Tr key={group.id}>
            <Td>{group.groupName}</Td>
            <Td>{group.score.value}</Td>
            <Td>{group.score.users[0].name}</Td>
            <Td>{calculateAverageScore(group.scores).toFixed(2)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default GroupScoreTable;


