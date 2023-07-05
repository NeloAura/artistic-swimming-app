import { useEffect, useState } from 'react';
import { ChakraProvider,Button, Table,TableContainer,TableCaption,Tfoot, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { socket } from "../socket_io";
import Navigation from './Navigation';
import { saveAs } from 'file-saver';



const fetchParticipantScores = () => {
  return new Promise((resolve, reject) => {
    socket.emit('fetchParticipantsScores');
    socket.on('participantsScores', (data) => {
      resolve(data);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const ParticipantEventScoreBoard = () => {
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




  const handleExportCsv = () => {
    const csvContent = participantScores
      .flatMap((item) =>
        item.scores.flatMap((score) =>
          score.participants.map((participant) => ({
            ...participant,
            eventType: item.eventType,
            scoreType: score.type,
            scoreValue: score.value
          }))
        )
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .map((participant) => {
        return [
          `${participant.firstName} ${participant.lastName}`,
          participant.division,
          participant.age_category,
          participant.country,
          participant.eventType,
          participant.scoreType,
          participant.scoreValue
        ].join(',');
      })
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'participant_event_scores.csv');
  };


  

  return (
  <ChakraProvider resetCSS>
    <nav><Navigation/></nav>
    <TableContainer>
      <Table variant='striped' colorScheme='teal'>
        <TableCaption>Event Participants</TableCaption>
        <Thead>
          <Tr>
            <Th>Participants</Th>
            <Th>Age Category</Th>
            <Th>Event</Th>
            <Th>Country</Th>
            <Th>Event Type</Th>
            <Th>Type</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {participantScores
            .flatMap((item) =>
              item.scores.flatMap((score) =>
                score.participants.map((participant) => ({
                  ...participant,
                  eventType: item.eventType,
                  scoreType: score.type,
                  scoreValue: score.value
                }))
              )
            )
            .sort((a, b) => a.lastName.localeCompare(b.lastName))
            .map((participant) => (
              <Tr key={participant.id}>
                <Td>{`${participant.firstName} ${participant.lastName}`}</Td>
                <Td>{participant.division}</Td>
                <Td>{participant.age_category}</Td>
                <Td>{participant.country}</Td>
                <Td>{participant.eventType}</Td>
                <Td>{participant.scoreType}</Td>
                <Td>{participant.scoreValue}</Td>
              </Tr>
            ))}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Participants</Th>
            <Th>Age Category</Th>
            <Th>Event</Th>
            <Th>Country</Th>
            <Th>Event Type</Th>
            <Th>Type</Th>
            <Th>Value</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>

    <Button onClick={handleExportCsv} mt={4} colorScheme="teal">Export as CSV</Button>
    
  </ChakraProvider>
);

};

export default ParticipantEventScoreBoard;


