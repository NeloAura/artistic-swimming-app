import { useEffect, useState } from 'react';
import { ChakraProvider,Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { socket } from "../socket_io";
import Navigation from './Navigation';
import { exportTableToCsv, exportTableToExcel } from '../exportUtils';


// Function to calculate the average score for a participant
const calculateAverageScore = (scores) => {
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return total / scores.length;
};

const fetchParticipantScores = () => {
  return new Promise((resolve, reject) => {
    socket.emit('participant-score-information');
    socket.on('participant-score-information', (data) => {
      resolve(data);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const ParticipantScoreBoard = () => {
  const [participantScores, setParticipantScores] = useState([]);


  useEffect(() => {
    const fetchParticipantScore = async () => {
      try {
        const participantScoresData = await fetchParticipantScores();
        setParticipantScores(participantScoresData);
      } catch (error) {
        console.error('Error setting group scores:', error);
      }
    };

    fetchParticipantScore();
  }, []);


  const highestAverageScoreParticipant = participantScores.reduce(
    (maxParticipant, participant) => {
      const averageScore = calculateAverageScore(participant.scores);
      if (averageScore > calculateAverageScore(maxParticipant.scores)) {
        return participant;
      }
      return maxParticipant;
    },
    participantScores[0]
  );

  const handleExportCsv = () => {
    exportTableToCsv(participantScores, 'participant_scores.csv');
  };

  const handleExportExcel = () => {
    exportTableToExcel(participantScores, 'participant_scores.xlsx');
  };

  return (
    <ChakraProvider resetCSS>
      <nav><Navigation/></nav>
      <Table variant="simple" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>Participant Name</Th>
            <Th>Division</Th>
            <Th>Age Category</Th>
            <Th>Events</Th>
            <Th>Types</Th>
            <Th>Scores</Th>
            <Th>Average Score</Th> {/* New column for average score */}
          </Tr>
        </Thead>
        <Tbody>
        {participantScores.map((participant) => {
            const averageScore = calculateAverageScore(participant.scores);
            const isHighestScore = participant === highestAverageScoreParticipant; // Check if the participant has the highest average score
            return (
              <Tr key={participant.id} bg={isHighestScore ? 'green.400' : undefined}>
                <Td>{`${participant.firstName} ${participant.lastName}`}</Td>
                <Td>{participant.division}</Td>
                <Td>{participant.age_category}</Td>
                <Td>{participant.event}</Td>
                <Td>
                  {participant.scores.map((score) => (
                    <span key={score.id}>{score.type}, </span>
                  ))}
                </Td>
                <Td>
                  {participant.scores.map((score) => (
                    <span key={score.id}>{score.value}, </span>
                  ))}
                </Td>
                <Td>{averageScore}</Td> {/* Display the average score */}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Button onClick={handleExportCsv} mt={4} colorScheme="teal">Export as CSV</Button>
      <Button onClick={handleExportExcel} mt={4} ml={2} colorScheme="teal">Export as Excel</Button>
    </ChakraProvider>
  );
};

export default ParticipantScoreBoard;


