import { useEffect } from 'react';
import io from 'socket.io-client';

const GroupScoreInformation = () => {
  useEffect(() => {
    const socket = io(); // Initialize the socket connection

    socket.on('group-score-information', (data) => {
      // Process the received data, e.g., update the state with groupScores
      console.log(data);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection when component unmounts
    };
  }, []);

  return null; // This component doesn't render anything, it just handles the socket event
};

export default GroupScoreInformation;
