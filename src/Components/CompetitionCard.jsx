import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  CardFooter,
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
  Box,
  Stack,
  Select,
  FormLabel,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { SunIcon, DeleteIcon  } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket, emit } from "../socket_io";
import { useNavigate } from "react-router-dom";

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

async function deleteCompetition(CompetitionID) {
  try {
    const result = emit("delete-competition", CompetitionID);
    console.log("Competition deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Delete failed");
  }
}

async function updateCompetition(CompetitionID, name) {
  try {
    const result = emit("update-competition", {
      id: CompetitionID,
      name,
    });
    console.log("Update successful:", CompetitionID);
    return result;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Update failed");
  }
}
async function createEvent(CompetitionID, name, type, time) {
  try {
    const result = emit("register-event", {
      id: CompetitionID,
      name,
      type,
      time,
    });
    console.log("Update successful:", CompetitionID);
    return result;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Update failed");
  }
}

const DeletePopover = ({
  button,
  initialFocusRef,
  CompetitionID,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(CompetitionID);
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
          Are you sure you want to delete? You would also be deleting all events
          in the competition and can't undo this action afterwards.
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

function CompetitionForm({
  initialName,
  isOpen,
  onOpen,
  onClose,
  onUpdate,
  CompetitionID,
}) {
  const firstField = React.useRef();
  const [formValues, setFormValues] = React.useState({
    name: initialName,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: initialName,
      });
    }
  }, [isOpen, initialName]);

  const handleSubmit = async () => {
    try {
      const { name } = formValues;
      const result = await onUpdate(CompetitionID, name);
      onClose();
      console.log("Update successful:", CompetitionID);
      return result;
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [field]: value,
    }));
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
            Update Competition
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor={`name_${CompetitionID}`}>Name</FormLabel>
                  <Input
                    ref={firstField}
                    id={`name_${CompetitionID}`}
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Please enter Competition name"
                  />
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

function EventForm({ isOpen, onOpen, onClose, CompetitionID, onCreate }) {
  const firstField = React.useRef();
  const [formValues, setFormValues] = React.useState({
    name: "",
    type: "",
    time: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, type, time } = formValues;
      const result = await onCreate(CompetitionID, name, type, time);
      onClose();
      console.log("Event creation successful:", result);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [field]: value,
    }));
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Create Event
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
          <DrawerHeader borderBottomWidth="1px">Create Event</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor={`name_${CompetitionID}`}>Name</FormLabel>
                  <Input
                    ref={firstField}
                    id={`name_${CompetitionID}`}
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Please enter Event name"
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor={`type_${CompetitionID}`}>Type</FormLabel>
                  <Select
                    id={`type_${CompetitionID}`}
                    value={formValues.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    placeholder="Please select Event type"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Duo">Duo</option>
                    <option value="Trio">Trio</option>
                    <option value="Mixed">Mixed</option>
                  </Select>
                </Box>
                <Box>
                  <FormLabel htmlFor={`time_${CompetitionID}`}>Time</FormLabel>
                  <Input
                    type="Time"
                    id={`time_${CompetitionID}`}
                    value={formValues.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </Box>
              </Stack>
              <Button mt={4} colorScheme="blue" type="submit">
                Create
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

const CompetitionCard = () => {
  const [competitions, setCompetitions] = React.useState([]);

  useEffect(() => {
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

  const handleDeleteCompetition = async (CompetitionID) => {
    try {
      await deleteCompetition(CompetitionID);
      const updatedCompetitions = competitions.filter(
        (competition) => competition.id !== CompetitionID
      );
      setCompetitions(updatedCompetitions);
    } catch (error) {
      console.error("Error deleting competition:", error);
    }
  };

  const handleUpdateCompetition = async (CompetitionID, name) => {
    try {
      await updateCompetition(CompetitionID, name);
      setCompetitions((prevCompetitions) =>
        prevCompetitions.map((Competition) => {
          if (Competition.id === CompetitionID) {
            return {
              ...Competition,
              name,
            };
          }
          return Competition;
        })
      );
    } catch (error) {
      console.error("Error updating Competition:", error);
    }
  };

  const handleCreateEvent = async (CompetitionID, name, type, time) => {
    try {
      return await createEvent(CompetitionID, name, type, time);
    } catch (error) {
      console.error("Error updating Event:", error);
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
        display="flex"
      >
        {competitions.map((competition) => (
          <CompetitionCardItem
            key={competition.id}
            competition={competition}
            onDelete={handleDeleteCompetition}
            onUpdate={handleUpdateCompetition}
            onCreate={handleCreateEvent}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

// Competition card item component
const CompetitionCardItem = ({ competition, onDelete, onUpdate, onCreate }) => {
  const navigate = useNavigate();
  const [isCompetitionFormOpen, setCompetitionFormOpen] = useState(false);
  const [isEventFormOpen, setEventFormOpen] = useState(false);

  const handleOpenCompetitionForm = () => {
    setCompetitionFormOpen(true);
  };

  const handleCloseCompetitionForm = () => {
    setCompetitionFormOpen(false);
  };

  const handleOpenEventForm = () => {
    setEventFormOpen(true);
  };

  const handleCloseEventForm = () => {
    setEventFormOpen(false);
  };

  const handleOpenEvents = () => {
    navigate(`/events/${competition.id}`);
  };

  return (
    <Card ml="10px" minWidth="300px" >
      <CardHeader onClick={handleOpenEvents}>
        <SunIcon boxSize={8} color="blue.300" />
      </CardHeader>
      <CardBody onClick={handleOpenEvents}>
        <Badge colorScheme="purple">Competition</Badge>
        <br />
        <Text as="b">{competition.name}</Text>
        <br />
        <Badge variant="solid" colorScheme="green">
          {competition.id}
        </Badge>
      </CardBody>
      <CardFooter alignItems="center" justifyContent="center">
        <ButtonGroup>
          <EventForm
            isOpen={isEventFormOpen}
            onOpen={handleOpenEventForm}
            onClose={handleCloseEventForm}
            CompetitionID={competition.id}
            onCreate={onCreate}
          />
          <CompetitionForm
            isOpen={isCompetitionFormOpen}
            onOpen={handleOpenCompetitionForm}
            onClose={handleCloseCompetitionForm}
            initialName={competition.name}
            CompetitionID={competition.id}
            onUpdate={onUpdate}
          />
          <DeletePopover
            button={
              <Button flex="1" variant="ghost" leftIcon={<DeleteIcon />} />
            }
            CompetitionID={competition.id}
            onDelete={onDelete}
          />
         
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default CompetitionCard;
