import React, { useEffect, useState } from "react";
import { ChakraProvider, Button, Select, Box} from "@chakra-ui/react";
import NavigationComp from "./Navigation";
import { socket } from "../socket_io";
import ParticipantClubEventScoreBoard from "./ParticipantClubEventScoreBoard";

const fetchClubs = async () => {
  return new Promise((resolve, reject) => {
    socket.emit("fetchClubs");
    socket.on("clubsData", (clubs) => {
      resolve(clubs);
    });
    socket.on("connect_error", (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

const ClubEventScores = () => {
  const [clubs, setClubs] = React.useState([]);
  const [selectedClub, setSelectedClub] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchClubsData = async () => {
      try {
        const clubsData = await fetchClubs();
        setClubs(clubsData);
      } catch (error) {
        console.error("Error setting clubs:", error);
      }
    };

    fetchClubsData();
  }, []);

  const handleClubChange = (event) => {
    setSelectedClub(event.target.value);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <ChakraProvider resetCSS>
    <nav>
      <NavigationComp />
    </nav>
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width="100%"
    >
      {submitted ? (
        <ParticipantClubEventScoreBoard clubName={selectedClub} />
      ) : (
        <>
          <Select
            placeholder="Select Club"
            value={selectedClub}
            onChange={handleClubChange}
            variant="filled"
            borderColor="purple"
            mb={4}
            width="100%"
            maxWidth="sm"
          >
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </Select>
          <Button onClick={handleSubmit} colorScheme="teal" width="100%" maxWidth="sm">
            Submit
          </Button>
        </>
      )}
    </Box>
  </ChakraProvider>
);
};

// Rest of the code...

export default ClubEventScores;
