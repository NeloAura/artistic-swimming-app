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
async function createEvent(CompetitionID,  name, division , age_category, type, start_time , end_time) {
  try {
    const result = emit("register-event", {
      id: CompetitionID,
      name:name,
      division: division,
      age_categorie: age_category,
      type :type,
      startTime:start_time,
      endTime:end_time

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
    start_time: "",
    end_time: "",
    division: "",
    age_category:"",

  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, type, start_time , end_time , division , age_category } = formValues;
      const result = await onCreate(CompetitionID, name, division , age_category, type, start_time , end_time );
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
                <br/>
                <Box>
                
                <FormLabel htmlFor={`division_${CompetitionID}`}>
                    Select Division
                  </FormLabel>
                  <Select
                    id={`division_${CompetitionID}`}
                    placeholder="Please Choose Division"
                    value={formValues.division}
                    onChange={(e) => handleChange("division", e.target.value)}
                  >
                    <option value="AWD">AWD</option>
                    <option value="Novice-A">Novice-A</option>
                    <option value="Novice-B">Novice-B</option>
                    <option value="Age Group">Age-Group</option>
                  </Select>
                  <FormLabel htmlFor={`age-categorie_${CompetitionID}`}>
                    Select AgeCategorie
                  </FormLabel>
                  <Select
                    id={`age-categorie_${CompetitionID}`}
                    placeholder="Please Choose AgeCategory"
                    value={formValues.age_category}
                    onChange={(e) =>
                      handleChange("age_category", e.target.value)
                    }
                  >
                    <option value="noagelimit">AWD-NoAgeLimit</option>
                    <option value="6&Under">Novice-6&Under</option>
                    <option value="7&8">Novice-7&8</option>
                    <option value="9&10">Novice-9&10</option>
                    <option value="11&12">Novice-11&12</option>
                    <option value="13&O">Novice-13&Over</option>
                    <option value="10&Under">AgeGroup-10&Under</option>
                    <option value="12&Under">AgeGroup-12&Under</option>
                    <option value="Youth">AgeGroup-Youth</option>
                    <option value="Junior">AgeGroup-Junior</option>
                    <option value="Senior">AgeGroup-Senior</option>
                  </Select>
                  <FormLabel htmlFor={`type_${CompetitionID}`}>Type</FormLabel>
                  <Select
                    id={`type_${CompetitionID}`}
                    value={formValues.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    placeholder="Please select Event type"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Duet">Duet</option>
                    <option value="Mix duet">Mixed duet</option>
                    <option value="Team">Team</option>
                    <option value="Male Solo">Male Solo</option>

                  </Select>
                  <br />
                  <FormLabel htmlFor={`start_time_${CompetitionID}`}>StartTime</FormLabel>
                  <Input
                    type="Time"
                    id={`start_time_${CompetitionID}`}
                    value={formValues.time}
                    onChange={(e) => handleChange("start_time", e.target.value)}
                  />
                  <FormLabel htmlFor={`end_time_${CompetitionID}`}>EndTime</FormLabel>
                  <Input
                    type="Time"
                    id={`end_time_${CompetitionID}`}
                    value={formValues.time}
                    onChange={(e) => handleChange("end_time", e.target.value)}
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

  const handleCreateEvent = async (CompetitionID, name, division , age_category, type, start_time , end_time) => {
    try {
      return await createEvent(CompetitionID,name, division , age_category, type, start_time , end_time);
    } catch (error) {
      console.error("Error updating Event:", error);
    }
  };

  return (
    <ChakraProvider resetCSS>
      <nav>
        <NavigationComp />
      </nav>
        {competitions.map((competition) => (
          <CompetitionCardItem
            key={competition.id}
            competition={competition}
            onDelete={handleDeleteCompetition}
            onUpdate={handleUpdateCompetition}
            onCreate={handleCreateEvent}
          />
        ))}
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
    <Card m="10px" minWidth="300px" bg="#F4F4F4" >
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
