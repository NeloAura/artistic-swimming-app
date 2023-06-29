import React, { useEffect, useState } from 'react';
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { socket } from '../socket_io';
import Navigation from './Navigation';
import { saveAs } from 'file-saver';

const ClubScoreBoard = () => {
  const [clubScores, setClubScores] = useState([]);

  useEffect(() => {
    const fetchClubScores = async () => {
      socket.emit('fetch-club-scores');
      socket.on('club-scores', (data) => {
        setClubScores(data);
      });
      socket.on('error', (error) => {
        console.error('Error fetching club scores:', error);
      });
    };

    fetchClubScores();

    return () => {
      socket.off('club-scores');
      socket.off('error');
    };
  }, []);

  const calculateAverageScore = (participants) => {
    if (!participants || participants.length === 0) {
      return 0;
    }

    const scores = participants.flatMap((participant) => participant.scores);
    const total = scores.reduce((sum, score) => sum + score.value, 0);
    return total / scores.length;
  };

  const handleExportCSV = () => {
    const csvData = clubScores.map((club) => ({
      Club: club.name,
      'Average Score': calculateAverageScore(club.scores),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((data) => Object.values(data).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'club_scores.csv');
  };

  const getHighestAverageScore = () => {
    let highestAverage = 0;
    let clubWithHighestAverage = null;
    clubScores.forEach((club) => {
      const averageScore = calculateAverageScore(club.participants);
      if (averageScore > highestAverage) {
        highestAverage = averageScore;
        clubWithHighestAverage = club;
      }
    });
    return clubWithHighestAverage;
  };

  return (
    <ChakraProvider>
      <nav>
        <Navigation />
      </nav>

      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Club Name</Th>
            <Th>Average Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clubScores.map((club) => (
            <Tr
              key={club.id}
              style={{
                backgroundColor:
                  club === getHighestAverageScore() ? 'green' : 'transparent',
              }}
            >
              <Td>{club.name}</Td>
              <Td>{calculateAverageScore(club.participants)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button onClick={handleExportCSV} mt={4} colorScheme="teal">
        Export as CSV
      </Button>
    </ChakraProvider>
  );
};

export default ClubScoreBoard;
