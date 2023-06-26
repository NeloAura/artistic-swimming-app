import React, { useEffect ,useState } from "react";
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
import { SunIcon, DeleteIcon } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket, emit } from "../socket_io";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const fetchEvent = async (competitionID) => {
  const parsedEventID = parseInt(competitionID, 10); // Convert competitionID to an integer

  return new Promise((resolve, reject) => {
    socket.emit("fetchEvents", parsedEventID); // Pass the converted competition ID to the server
    socket.on("eventsData", (events) => {
      resolve(events);
    });
    socket.on("connect_error", (error) => {
      reject(error);
      socket.disconnect();
    });
  });
};


async function deleteEvent(eventID) {
  try {
    const result = emit("delete-event", eventID);
    console.log("Event deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Delete failed");
  }
}

async function updateEvent(EventID, name, start_time, end_time) {
  try {
    const result = emit("update-event", {
      id: EventID,
      name:name,
      startTime:start_time,
      endTime:end_time,
    });
    console.log("Update successful:", EventID);
    return result;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Update failed");
  }
}

const DeletePopover = ({ button, initialFocusRef, EventID, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(EventID);
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
          Are you sure you want to delete? You would also be deleting all
          participants in the event and can't undo this action afterwards.
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

function EventForm({
  initialName,
  initialStartTime,
  initialEndTime,
  isOpen,
  onOpen,
  onClose,
  onUpdate,
  EventID,
}) {
  const firstField = React.useRef();
  const [formValues, setFormValues] = React.useState({
    name: initialName,
    start_time: initialStartTime,
    end_time: initialEndTime,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: initialName,
        start_time: initialStartTime,
        end_time: initialEndTime,
      });
    }
  }, [isOpen, initialName, initialStartTime, initialEndTime]);

  const handleSubmit = async () => {
    try {
      const { name, start_time, end_time } = formValues;
      const result = await onUpdate(EventID, name, start_time, end_time);
      onClose();
      console.log("Update successful:", EventID);
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
            Update Event
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor={`name_${EventID}`}>Name</FormLabel>
                  <Input
                    ref={firstField}
                    id={`name_${EventID}`}
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Please enter Event name"
                  />
                  <FormLabel htmlFor={`time_${EventID}`}>StartTime</FormLabel>
                  <Input
                    type="Time"
                    id={`starttime_${EventID}`}
                    value={formValues.start_time}
                    onChange={(e) => handleChange("start_time", e.target.value)}
                  />
                  <FormLabel htmlFor={`time_${EventID}`}>EndTime</FormLabel>
                  <Input
                    type="Time"
                    id={`endtime_${EventID}`}
                    value={formValues.end_time}
                    onChange={(e) => handleChange("end_time", e.target.value)}
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

const EventCard = () => {
  const [events, setEvents] = React.useState([]);
  const { competitionID } = useParams();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventsData = await fetchEvent(competitionID);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error setting events:", error);
      }
    };

    fetchEventData();
  }, [competitionID]); 

  const handleDeleteEvent = async (eventID) => {
    try {
      await deleteEvent(eventID);
      const updatedEvent = events.filter((event) => event.id !== eventID);
      setEvents(updatedEvent);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdateEvent = async (EventID, name, start_time, end_time) => {
    try {
      await updateEvent(EventID, name, start_time, end_time);
      setEvents((prevEvent) =>
        prevEvent.map((Event) => {
          if (Event.id === EventID) {
            return {
              ...Event,
              name,
              start_time,
              end_time,
            };
          }
          return Event;
        })
      );
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
      >
        {events.map((event) => (
          <EventCardItem
            key={event.id}
            event={event}
            competitionID={competitionID}
            onDelete={handleDeleteEvent}
            onUpdate={handleUpdateEvent}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

// Event card item component
const EventCardItem = ({ event,competitionID, onDelete, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleOpenEvents = () => {
    const combinedParams = `${event.id},${competitionID},${event.division},${event.age_categorie},${event.type}`;
    navigate(`/participant-on-event/${combinedParams}`);
  };

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
        <Badge colorScheme="purple">{event.type}</Badge>
        <br />
        <Text as="b">{event.name}</Text>
        <br />
        <Badge variant="solid" colorScheme="blue">
        {event.startTime}-{event.endTime}
        </Badge>
      </CardBody>
      <CardFooter alignItems="center" justifyContent="center">
        <ButtonGroup>
          <EventForm
            isOpen={isOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            initialName={event.name}
            initialStartTime={event.startTime}
            initialEndTime={event.endTime}
            EventID={event.id}
            onUpdate={onUpdate}
          />
          <DeletePopover
            button={<Button flex="1" variant="ghost" leftIcon={<DeleteIcon />} />}
            EventID={event.id}
            onDelete={onDelete}
          />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
