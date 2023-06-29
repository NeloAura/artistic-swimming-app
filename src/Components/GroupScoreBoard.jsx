import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { socket } from '../socket_io';
import { useState, useEffect } from 'react';

// Function to calculate the average score for a group
const calculateAverageScore = (scores) => {
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return total / scores.length;
};

const GroupScoreBoard = () => {
  const [groupScores, setGroupScores] = useState([]);

  useEffect(() => {
    fetchGroupScores();

    return () => {
      socket.disconnect();
    };
  }, [groupScores]);

  const fetchGroupScores = async () => {
    try {
      const scores = await new Promise((resolve, reject) => {
        socket.emit('getClubScores');
        socket.on('clubScoresData', (data) => {
          resolve(data);
        });
        socket.on('connect_error', (error) => {
          reject(error);
          socket.disconnect();
        });
      });
      setGroupScores(scores);
    } catch (error) {
      console.error('Error fetching group scores:', error);
    }
  };

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
        {groupScores.length > 0 ? (
          groupScores.map((group) => (
            <Tr key={group.id}>
              <Td>{group.groupName}</Td>
              <Td>{group.score.value}</Td>
              <Td>{group.score.users[0].name}</Td>
              <Td>{calculateAverageScore(group.scores).toFixed(2)}</Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={4} textAlign='center'>
              No group scores available.
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default GroupScoreBoard;

