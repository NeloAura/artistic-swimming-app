import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableCaption, Thead, Tbody, Tr, Th, Td, Tfoot } from '@chakra-ui/react';
import { useUser } from 'your-user-auth-library'; // Replace with your user authentication library

const ParticipantsListView = () => {
  const [participants, setParticipants] = useState([]);

  // Fetch participants and their scores from the server
  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        const participantsData = await fetchParticipants();
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error setting participants:", error);
      }
    };

    fetchParticipantsData();
  }, []);

  const fetchParticipants = async () => {
    return new Promise((resolve, reject) => {
      socket.emit("fetchParticipants");
      socket.on("participantsData", (participants) => {
        resolve(participants);
      });
      socket.on("connect_error", (error) => {
        reject(error);
        socket.disconnect();
      });
    });
  };

  const isAdmin = () => {
    const user = useUser(); // Replace with your user authentication library's hook to get the logged-in user
    return user && user.role === 'admin';
  };

  const handleScoreEdit = (participantId) => {
    if (isAdmin()) {
      // Handle score edit logic here
    } else {
      console.log('You do not have permission to edit scores.');
    }
  };

  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>Participants and Scores</TableCaption>
        <Thead>
          <Tr>
            <Th>Participant</Th>
            <Th>Division</Th>
            <Th>Execution</Th>
            <Th>Difficulty</Th>
            <Th>Artistic Expression</Th>
            <Th>Artistic Impression</Th>
            {isAdmin() && <Th>Edit Score</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {participants.map((participant) => (
            <Tr key={participant.id}>
              <Td>{participant.firstName} {participant.lastName}</Td>
              <Td>{participant.division}</Td>
              <Td>{participant.score.execution}</Td>
              <Td>{participant.score.difficulty}</Td>
              <Td>{participant.score.artisticExpression}</Td>
              <Td>{participant.score.artisticImpression}</Td>
              {isAdmin() && (
                <Td>
                  <button onClick={() => handleScoreEdit(participant.id)}>Edit</button>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ParticipantsListView;
