import React, { useEffect, useState } from 'react';
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { socket } from '../socket_io';
import Navigation from './Navigation';
import { saveAs } from 'file-saver';

const fetchAllGroupScores = () => {
  return new Promise((resolve, reject) => {
    socket.emit('group-score-information');
    socket.on('group-scores', (data) => {
      resolve(data);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const GroupScoreBoard = () => {
  const [groupScores, setGroupScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresData = await fetchAllGroupScores();
        setGroupScores(scoresData);
      } catch (error) {
        console.error('Error fetching group scores:', error);
      }
    };

    fetchScores();
  }, []);

  const calculateAverageScore = (scores) => {
    const total = scores.reduce((sum, score) => sum + score.value, 0);
    return total / scores.length;
  };

  const handleExportCSV = () => {
    const csvData = groupScores.map((group) => ({
      'Group Name': group.groupName,
      'Score Type': group.scores.map((score) => score.type).join(', '),
      'Score Value': group.scores.map((score) => score.value).join(', '),
      'Average Score': calculateAverageScore(group.scores),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','), // CSV header row
      ...csvData.map((row) => Object.values(row).join(',')), // CSV data rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'group_scores.csv');
  };

  return (
    <ChakraProvider>
      <nav>
        <Navigation />
      </nav>

      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Group Name</Th>
            <Th>Score Type</Th>
            <Th>Score Value</Th>
            <Th>Average Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groupScores.map((group) => (
            <Tr key={group.id}>
              <Td>{group.groupName}</Td>
              <Td>
                {group.scores.map((score) => (
                  <div key={score.id}>{score.type}</div>
                ))}
              </Td>
              <Td>
                {group.scores.map((score) => (
                  <div key={score.id}>{score.value}</div>
                ))}
              </Td>
              <Td style={{ backgroundColor: group.highestAverage ? 'yellow' : 'transparent' }}>
                {calculateAverageScore(group.scores)}
              </Td>
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

export default GroupScoreBoard;
