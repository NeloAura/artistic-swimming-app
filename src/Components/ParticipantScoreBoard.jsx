import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

// Function to calculate the average score for a participant
const calculateAverageScore = (scores) => {
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return total / scores.length;
};

const ParticipantScoreBoard = ({ participantScores }) => {
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

export default ParticipantScoreBoard;


// // ...

// import { useEffect, useState } from 'react';
// import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
// import io from 'socket.io-client';

// const socket = io('<YOUR_SOCKET_SERVER_URL>');

// // Function to calculate the average score for a participant
// const calculateAverageScore = (scores) => {
//   const total = scores.reduce((sum, score) => sum + score.value, 0);
//   return total / scores.length;
// };

// const ParticipantScoreTable = () => {
//   const [participantScores, setParticipantScores] = useState([]);

//   useEffect(() => {
//     // Fetch participant score information from the server
//     socket.on('participant-score-information', (data) => {
//       setParticipantScores(data);
//     });

//     // Clean up socket connection on component unmount
//     return () => {
//       socket.off('participant-score-information');
//     };
//   }, []);

//   return (
//     <Table variant='simple'>
//       <Thead>
//         <Tr>
//           <Th>Participant</Th>
//           <Th>Score</Th>
//           <Th>Given By</Th>
//           <Th>Average Score</Th>
//           <Th>Division</Th>
//           <Th>Age Category</Th>
//           <Th>Type</Th>
//         </Tr>
//       </Thead>
//       <Tbody>
//         {participantScores.map((participant) => (
//           <Tr key={participant.id}>
//             <Td>{participant.firstName} {participant.lastName}</Td>
//             <Td>{participant.score}</Td>
//             <Td>{participant.givenBy}</Td>
//             <Td>{calculateAverageScore(participant.scores).toFixed(2)}</Td>
//             <Td>{participant.division}</Td>
//             <Td>{participant.age_categorie}</Td>
//             <Td>{participant.type}</Td>
//           </Tr>
//         ))}
//       </Tbody>
//     </Table>
//   );
// };

// export default ParticipantScoreTable;


// // import { useEffect } from 'react';
// // import ParticipantScoreTable from './ParticipantScoreTable';
// // import io from 'socket.io-client';

// // const socket = io('<YOUR_SOCKET_SERVER_URL>');

// // const MainComponent = () => {
// //   useEffect(() => {
// //     // Fetch participant score information when the component mounts
// //     socket.emit('participant-score-information');

// //     // Clean up socket connection on component unmount
// //     return () => {
// //       socket.off('participant-score-information');
// //     };
// //   }, []);

// //   return (
// //     <div>
// //       {/* Other components or content */}
// //       <ParticipantScoreTable />
// //     </div>
// //   );
// // };

// // export default MainComponent;


// // ...