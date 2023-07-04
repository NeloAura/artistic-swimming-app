import React, { useEffect, useState } from 'react';
import { ChakraProvider, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { socket } from '../socket_io';
import Navigation from './Navigation';
import { saveAs } from 'file-saver';

const fetchAllJudgeScores = () => {
  return new Promise((resolve, reject) => {
    socket.emit('get-judges-participants-scores');
    socket.on('judges-participants-scores', (data) => {
      resolve(data);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const fetchParticipants = async () => {
  return new Promise((resolve, reject) => {
    socket.emit('fetchParticipants');
    socket.on('participantsData', (participants) => {
      resolve(participants);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const JudgeScoreBoard = () => {
  const [judgeScores, setJudgeScores] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresData = await fetchAllJudgeScores();
        setJudgeScores(scoresData);
      } catch (error) {
        console.error('Error fetching judge scores:', error);
      }
    };

    fetchScores();
  }, []);

  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        const participantsData = await fetchParticipants();
        setParticipants(participantsData);
      } catch (error) {
        console.error('Error setting participants:', error);
      }
    };

    fetchParticipantsData();
  }, []);

  const handleExportCSV = () => {
    const csvData = [];
  
    // Add header row
    csvData.push(['Participant Name', 'Judge Name', 'Score Type', 'Score']);
  
    // Add data rows
    judgeScores.forEach((item) => {
      const participant = participants.find((p) => p.id === item.participantId);
      const participantName = participant ? `${participant.firstName} ${participant.lastName}` : '';
  
      item.judgesScores.forEach((score) => {
        const judgeName = score.judge[0].name;
        const scoreType = score.type;
        const scoreValue = score.score;
  
        csvData.push([participantName, judgeName, scoreType, scoreValue]);
      });
    });
  
    // Create CSV content
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
  
    // Create a Blob object from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
    // Save the Blob object as a CSV file
    saveAs(blob, 'scores.csv');
  };
  

  return (
    <ChakraProvider>
      <nav>
        <Navigation />
      </nav>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Participant Name</Th>
            <Th>Judge Scores</Th>
          </Tr>
        </Thead>
        <Tbody>
          {judgeScores.map((item) => {
            const participant = participants.find((p) => p.id === item.participantId);
            const participantName = participant ? `${participant.firstName} ${participant.lastName}` : '';

            return (
              <Tr key={item.participantId}>
                <Td>{participantName}</Td>
                <Td>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Judge Name</Th>
                        <Th>Score Type</Th>
                        <Th>Score</Th>
                        
                      </Tr>
                    </Thead>
                    <Tbody>
                      {item.judgesScores.map((score) => (
                        <Tr key={score.judge[0].id}>
                          <Td>{score.judge[0].name}</Td>
                          <Td>{score.type}</Td>
                          <Td>{score.score}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Button onClick={handleExportCSV} mt={4} mb={4} colorScheme="blue">
        Export as CSV
      </Button>
    </ChakraProvider>
  );
};

export default JudgeScoreBoard;
