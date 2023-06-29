import { useEffect } from 'react';
import io from 'socket.io-client';

const ParticipantScoreInformation = () => {
  useEffect(() => {
    const socket = io(); // Initialize the socket connection

    socket.on('participant-score-information', (data) => {
      // Process the received data, e.g., update the state with participantScores
      console.log(data);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection when component unmounts
    };
  }, []);

  return null; // This component doesn't render anything, it just handles the socket event
};

export default ParticipantScoreInformation;