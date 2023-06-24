import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  CardFooter,
  Checkbox,
  Badge,
  Button,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverFooter,
  Stack,
  Box,
  FormLabel,
  Input,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { SunIcon, DeleteIcon } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket, emit } from "../socket_io";

// Assuming you are using an asynchronous function
const fetchClubs = async () => {
  // Perform your data fetching logic here
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

const fetchCompetitions = async () => {
  return new Promise((resolve, reject) => {
    socket.emit("fetchCompetitions");
    socket.on("competitionsData", (competitions) => {
      resolve(competitions);
    });
    socket.on("connect_error", (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};

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

async function deleteParticipant(ParticipantID) {
  try {
    const result = emit("delete-participant", ParticipantID);
    console.log("Participant deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Delete failed");
  }
}

async function updateParticipant(
  ParticipantID,
  lastName,
  firstName,
  birthYear,
  country,
  clublinkId,
  division,
  age_category,
  competition,
  event
) {
  try {
    const result = emit("update-participant", {
      id: ParticipantID,
      lastName,
      firstName,
      birthYear,
      country,
      clublinkId,
      division,
      age_category,
      competition,
      event,
    });
    console.log("Update successful:", ParticipantID);
    return result;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Update failed");
  }
}

const DeletePopover = ({
  button,
  initialFocusRef,
  ParticipantID,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(ParticipantID);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent color="white" bg="blue.700" borderColor="twitter.300">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Alert !!
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          Are you sure you want to delete? You can't undo this action
          afterwards.
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <ButtonGroup size="md">
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

function ParticipantForm({
  initialLastName,
  initialFirstName,
  initialClubLinkID,
  initialBirthYear,
  initialDivision,
  initialAgeCategory,
  initialCountry,
  initialCompetition,
  initialEvent,
  isOpen,
  onOpen,
  onClose,
  onUpdate,
  ParticipantID,
}) {
  const firstField = React.useRef();
  const [formValues, setFormValues] = React.useState({
    lastname: initialLastName,
    firstname: initialFirstName,
    birthYear: initialBirthYear,
    country: initialCountry,
    clublinkId: initialClubLinkID,
    division: initialDivision,
    age_category: initialAgeCategory,
    competition: initialCompetition,
    event: initialEvent,
  });
  const [clubs, setClubs] = React.useState([]);
  const [competitions, setCompetitions] = React.useState([]);

  React.useEffect(() => {
    if (isOpen) {
      setFormValues({
        lastname: initialLastName,
        firstname: initialFirstName,
        birthYear: initialBirthYear,
        country: initialCountry,
        clublinkId: initialClubLinkID,
        division: initialDivision,
        age_category: initialAgeCategory,
        competition: initialCompetition,
        event: initialEvent.split(","),
      });
    }
  }, [
    isOpen,
    initialLastName,
    initialFirstName,
    initialBirthYear,
    initialCountry,
    initialClubLinkID,
    initialDivision,
    initialAgeCategory,
    initialCompetition,
    initialEvent,
  ]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchCompetitionsData = async () => {
      try {
        const competitionsData = await fetchCompetitions();
        setCompetitions(competitionsData);
      } catch (error) {
        console.error("Error setting competitions:", error);
      }
    };

    fetchCompetitionsData();
  }, []);

  const handleSubmit = async () => {
    try {
      const {
        lastname,
        firstname,
        birthYear,
        country,
        clublinkId,
        division,
        age_category,
        competition,
        event,
      } = formValues;

      const eventString = event.join(","); // Convert event array to string separated by commas

      const result = await onUpdate(
        ParticipantID,
        lastname,
        firstname,
        birthYear,
        country,
        clublinkId,
        division,
        age_category,
        competition,
        eventString // Pass the event string to the onUpdate function
      );

      onClose();
      console.log(
        "Update successful:",
        ParticipantID,
        lastname,
        firstname,
        birthYear,
        country,
        clublinkId,
        division,
        age_category,
        competition,
        eventString // Log the event string
      );

      return result;
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prevFormValues) => {
      if (field === "event") {
        // Checkbox field
        const prevFieldValues = Array.isArray(prevFormValues[field])
          ? prevFormValues[field]
          : [];

        if (prevFieldValues.includes(value)) {
          // Checkbox is unisChecked, remove value from the array
          const updatedValues = prevFieldValues.filter(
            (item) => item !== value
          );
          console.log(`Removed ${value} from ${field}:`, updatedValues);
          return {
            ...prevFormValues,
            [field]: updatedValues,
          };
        } else {
          // Checkbox is isChecked, add value to the array
          const updatedValues = [...prevFieldValues, value];
          console.log(`Added ${value} to ${field}:`, updatedValues);
          return {
            ...prevFormValues,
            [field]: updatedValues,
          };
        }
      } else {
        // Non-checkbox field, update value directly
        console.log(`Updated ${field} value:`, value);
        return {
          ...prevFormValues,
          [field]: value,
        };
      }
    });
  };

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        Edit
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Update Participant
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor={`lastname_${ParticipantID}`}>
                    Lastname
                  </FormLabel>
                  <Input
                    ref={firstField}
                    id={`lastname_${ParticipantID}`}
                    value={formValues.lastname}
                    onChange={(e) => handleChange("lastname", e.target.value)}
                    placeholder="Please enter lastname"
                  />
                  <FormLabel htmlFor={`firstname_${ParticipantID}`}>
                    Firstname
                  </FormLabel>
                  <Input
                    id={`firstname_${ParticipantID}`}
                    value={formValues.firstname}
                    onChange={(e) => handleChange("firstname", e.target.value)}
                    placeholder="Please enter firstname"
                  />
                  <br />
                  <br />
                  <FormLabel htmlFor={`BirthDate_${ParticipantID}`}>
                    {" "}
                    Birthyear
                  </FormLabel>
                  <Input
                    type="date"
                    id={`BirthDate_${ParticipantID}`}
                    value={formValues.birthYear}
                    onChange={(e) => handleChange("birthYear", e.target.value)}
                    placeholder="BirthDate"
                  />

                  <FormLabel htmlFor={`country_${ParticipantID}`}>
                    Country
                  </FormLabel>
                  <Select
                    id={`country_${ParticipantID}`}
                    value={formValues.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  >
                    <option value="Curacao">Curacao</option>
                    <option value="Bonaire">Bonaire</option>
                    <option value="Aruba">Aruba</option>
                    <option value="Venezuela">Venezuela</option>
                  </Select>
                </Box>
                <Box></Box>
                <Box>
                  <FormLabel htmlFor={`club_${ParticipantID}`}>
                    Select Club
                  </FormLabel>
                  <Select
                    id={`club_${ParticipantID}`}
                    value={formValues.clublinkId}
                    onChange={(e) => handleChange("clublinkId", e.target.value)}
                  >
                    {clubs.map((club) => (
                      <option key={club.id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </Select>
                  <br />
                  <FormLabel htmlFor={`division_${ParticipantID}`}>
                    Select Division
                  </FormLabel>
                  <Select
                    id={`division_${ParticipantID}`}
                    value={formValues.division}
                    onChange={(e) => handleChange("division", e.target.value)}
                  >
                    <option value="awd">AWD</option>
                    <option value="novice-a">Novice-A</option>
                    <option value="novice-b">Novice-B</option>
                    <option value="age-group">Age-Group</option>
                  </Select>
                  <br />
                  <FormLabel htmlFor={`age-categorie_${ParticipantID}`}>
                    Select AgeCategorie
                  </FormLabel>
                  <Select
                    id={`age-categorie_${ParticipantID}`}
                    value={formValues.age_category}
                    onChange={(e) =>
                      handleChange("age_category", e.target.value)
                    }
                  >
                    <option value="AWD-NoAgeLimit">AWD-NoAgeLimit</option>
                    <option value="Novice-6&Under">Novice-6&Under</option>
                    <option value="Novice-7&8">Novice-7&8</option>
                    <option value="Novice-9&10">Novice-9&10</option>
                    <option value="Novice-11&12">Novice-11&12</option>
                    <option value="Novice-13&Over">Novice-13&Over</option>
                    <option value="AgeGroup-10&Under">AgeGroup-10&Under</option>
                    <option value="AgeGroup-12&Under">AgeGroup-12&Under</option>
                    <option value="AgeGroup-Youth">AgeGroup-Youth</option>
                    <option value="AgeGroup-Senior">AgeGroup-Senior</option>
                  </Select>
                  <br />
                  <FormLabel htmlFor={`competition_${ParticipantID}`}>
                    Select Competition
                  </FormLabel>
                  <Select
                    id={`competition_${ParticipantID}`}
                    value={formValues.competition}
                    onChange={(e) =>
                      handleChange("competition", e.target.value)
                    }
                  >
                    {competitions.map((competition) => (
                      <option key={competition.id} value={competition.name}>
                        {competition.name}
                      </option>
                    ))}
                  </Select>
                  <br />

                  <FormLabel htmlFor={`competition_${ParticipantID}`}>
                    Select Events
                  </FormLabel>

                  <Stack spacing={[1, 5]} direction={["flex-row"]}>
                    <Checkbox
                      colorScheme="red"
                      value="solo"
                      id={`event1_${ParticipantID}`}
                      onChange={(e) => handleChange("event", e.target.value)}
                      isChecked={formValues.event.includes("solo")}
                    >
                      Solo
                    </Checkbox>
                    <Checkbox
                      colorScheme="pink"
                      value="duet"
                      id={`event2_${ParticipantID}`}
                      onChange={(e) => handleChange("event", e.target.value)}
                      isChecked={formValues.event.includes("duet")}
                    >
                      Duo
                    </Checkbox>
                    <Checkbox
                      colorScheme="blue"
                      value="mixDuet"
                      id={`event3_${ParticipantID}`}
                      onChange={(e) => handleChange("event", e.target.value)}
                      isChecked={formValues.event.includes("mixDuet")}
                    >
                      Mix Duet
                    </Checkbox>
                    <Checkbox
                      colorScheme='green'
                      value="team"
                      id="event4"
                      isChecked={formValues.event.includes("team")}
                      onChange={(e) => {
                        handleChange("event", e.target.value);
                      }}
                    >
                      Team
                    </Checkbox>
                  </Stack>
                </Box>
              </Stack>
              <Button mt={4} colorScheme="blue" type="submit">
                Update
              </Button>
            </form>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const ParticipantCard = () => {
  const [participants, setParticipants] = React.useState([]);

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

  const handleDeleteParticipant = async (ParticipantID) => {
    try {
      const participantToDelete = participants.find(
        (participant) => participant.id === ParticipantID
      );
      console.log(ParticipantID);
      if (!participantToDelete) {
        console.error("Participant not found");
        return;
      }

      await deleteParticipant(ParticipantID);
      const updatedParticipants = participants.filter(
        (participant) => participant.id !== ParticipantID
      );
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error("Error deleting participant:", error);
    }
  };

  const handleUpdateParticipant = async (
    ParticipantID,
    lastname,
    firstname,
    birthYear,
    country,
    clublinkid,
    division,
    age_category,
    competition,
    event
  ) => {
    try {
      await updateParticipant(
        ParticipantID,
        lastname,
        firstname,
        birthYear,
        country,
        clublinkid,
        division,
        age_category,
        competition,
        event
      );
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) => {
          if (participant.id === ParticipantID) {
            return {
              ...participant,
              lastname,
              firstname,
              birthYear,
              country,
              clublinkid,
              division,
              age_category,
              competition,
              event,
            };
          }
          return participant;
        })
      );
    } catch (error) {
      console.error("Error updating participant:", error);
    }
  };

  return (
    <ChakraProvider resetCSS>
      <nav>
        <NavigationComp />
      </nav>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {participants.map((participant) => (
          <ParticipantCardItem
            key={participant.id}
            participant={participant}
            onDelete={handleDeleteParticipant}
            onUpdate={handleUpdateParticipant}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

const ParticipantCardItem = ({ participant, onDelete, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <SunIcon boxSize={8} color="blue.300" />
      </CardHeader>
      <CardBody>
        <Badge colorScheme="purple">Participant</Badge>
        <br />
        <Text as="b">{participant.firstName}</Text>
        <br />
        <Badge variant="solid" colorScheme="blue">
          {participant.id}
        </Badge>
      </CardBody>
      <CardFooter alignItems="center" justifyContent="center">
        <ButtonGroup>
          <ParticipantForm
            isOpen={isOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            initialLastName={participant.lastName}
            initialFirstName={participant.firstName}
            initialBirthYear={participant.birthYear}
            initialCountry={participant.country}
            initialClubLinkID={participant.clublinkId}
            initialDivision={participant.division}
            initialCompetition={participant.competion}
            initialEvent={participant.event}
            initialAgeCategory={participant.age_category}
            ParticipantID={participant.id}
            onUpdate={onUpdate}
          />
          <DeletePopover
            button={
              <Button flex="1" variant="ghost" leftIcon={<DeleteIcon />} />
            }
            ParticipantID={participant.id}
            onDelete={onDelete}
          />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default ParticipantCard;
