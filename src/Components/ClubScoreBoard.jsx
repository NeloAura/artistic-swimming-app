import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { socket } from '../socket_io';
import { useState, useEffect } from 'react';

const ClubScoreBoard = () => {
  const [clubScores, setClubScores] = useState([]);

  useEffect(() => {
    fetchClubScores();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchClubScores = async () => {
    try {
      const scores = await new Promise((resolve, reject) => {
        socket.emit('fetch-club-scores');
        socket.on('club-scores-data', (data) => {
          resolve(data);
        });
        socket.on('connect_error', (error) => {
          reject(error);
          socket.disconnect();
        });
      });
      setClubScores(scores);
    } catch (error) {
      console.error('Error fetching club scores:', error);
    }
  };

  return (
    <div id='clubScoreContainer'>
      <Table variant='simple'>
        <caption>Club Scores</caption>
        <Thead>
          <Tr>
            <Th>Club Name</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clubScores.length > 0 ? (
            clubScores.map((club) => (
              <Tr key={club.name}>
                <Td>{club.name}</Td>
                <Td>{club.averageScore.toFixed(2)}</Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={2} textAlign='center'>
                No club scores available.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  );
};

export default ClubScoreBoard;
