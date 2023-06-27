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
  Box,
  Button,
  Flex,
  useDisclosure,
  FormLabel,
  Input,
  Stack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  PopoverFooter,
} from "@chakra-ui/react";
import { SunIcon , DeleteIcon } from "@chakra-ui/icons";
import NavigationComp from "./Navigation";
import { socket } from "../socket_io";
import { useParams } from 'react-router-dom';

const ParticipantOnEventCard = () => {
  const [participants, setParticipants] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);

  const { combinedParams } = useParams();
  const [eventId, competitionID, division, ageCategory, eventType] = combinedParams.split(',');

  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        const participantsData = await fetchParticipants(eventId, competitionID, division, ageCategory, eventType);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error setting participants:", error);
      }
    };

    

    fetchParticipantsData();
  }, [eventId, competitionID, division, ageCategory, eventType]);
  
  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const groupsData = await fetchGroups(eventId);
        setGroups(groupsData);
      } catch (error) {
        console.error("Error setting groups:", error);
      }
    };

    

    fetchGroupsData();
  }, [eventId]);

  const fetchParticipants = async (eventId, competitionID, division, ageCategory, eventType) => {
    const parsedEventID = parseInt(eventId, 10);
    const parsedCompetitionID = parseInt(competitionID, 10);
    return new Promise((resolve, reject) => {
      socket.emit("fetch-participants",{id:parsedEventID, cid:parsedCompetitionID, division, ageCategory, eventType});
      socket.on("eventParticipantsData", (participants) => {
        resolve(participants);
      });
      socket.on("connect_error", (error) => {
        reject(error);
        socket.disconnect();
      });
    });
  };
  const fetchGroups = async (eventId) => {
    const parsedEventID = parseInt(eventId, 10);
    return new Promise((resolve, reject) => {
      socket.emit("fetch-groups",{id:parsedEventID});
      socket.on("eventGroupsData", (groups) => {
        resolve(groups);
      });
      socket.on("connect_error", (error) => {
        reject(error);
        socket.disconnect();
      });
    });
  };

  async function deleteGroup(GroupID) {
    try {
      const result = socket.emit("delete-group", GroupID);
      console.log("Group deleted successfully:", result);
      return result;
    } catch (error) {
      console.error("Delete failed:", error);
      throw new Error("Delete failed");
    }
  }

  
  

  const handleCheckboxChange = (participantId) => {
    if (selectedParticipantIds.includes(participantId)) {
      setSelectedParticipantIds(selectedParticipantIds.filter(id => id !== participantId));
    } else {
      setSelectedParticipantIds([...selectedParticipantIds, participantId]);
    }
  };

  const handleDeleteGroup = async (GroupID) => {
    try {
      const groupToDelete = groups.find(
        (group) => group.id === GroupID
      );
      console.log(GroupID);
      if (!groupToDelete) {
        console.error("Group not found");
        return;
      }

      await deleteGroup(GroupID);
      const updatedGroups = groups.filter(
        (group) => group.id !== GroupID
      );
      setGroups(updatedGroups);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <ChakraProvider resetCSS>
      <nav>
        <NavigationComp />
      </nav>
      <GroupForm
        eventType={eventType}
        selectedParticipants={selectedParticipantIds}
        eventId={eventId}
      />
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {participants.map((participant) => (
          <ParticipantCardItem
            key={participant.id}
            participant={participant}
            eventType={eventType}
            isChecked={selectedParticipantIds.includes(participant.id)}
            onCheckboxChange={handleCheckboxChange}
          />
        ))}
        {groups.map((group) => (
          <GroupCardItem
            key={group.id}
            group={group}
            onDelete={handleDeleteGroup}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

const DeletePopover = ({
  button,
  initialFocusRef,
  GroupID,
  onDelete,
}) => {
  const handleDelete = async () => {
    try {
      await onDelete(GroupID);
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

function GroupForm({eventType ,selectedParticipants ,eventId}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const EventID = parseInt(eventId, 10);
  async function registergroup(groupName) {
    try {
      const result = socket.emit("register-group", {
        groupName,selectedParticipants,EventID
      });
      console.log(" Competition Registration successful:", result);
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed");
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const groupName  = document.getElementById("groupName").value;

    try {
      const result = await registergroup(groupName).then(onClose());

      console.log("Registration successful:", result);
      return result;
    } catch (error) {
      console.error("Failed to register :", error);
    }
  };
  return (
    <>
      {eventType !== "Solo" && eventType !== "Male Solo" && (
      <Box bg="purple.400" width="100%" py={4} textAlign="center">
        <Button variant="solid" colorScheme="blue" onClick={onOpen}>
          Group Participants
        </Button>
      </Box>
    )}
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
            Create a new Group
          </DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="groupName">Name</FormLabel>
                  <Input
                    ref={firstField}
                    id="groupName"
                    placeholder="Please enter Group Name"
                  />
                </Box>
              </Stack>
              <Button mt={4} colorScheme="blue" type="submit">
                Submit
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

const ParticipantCardItem = ({ participant, eventType, isChecked, onCheckboxChange }) => {
  const handleCheckboxToggle = () => {
    onCheckboxChange(participant.id);
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
          {participant.generatedNumber}
        </Badge>
      </CardBody>
      <CardFooter bg="blue.200" alignItems="center" justifyContent="center">
        {eventType !== "Solo" && eventType !== "Male Solo" ? (
          <Flex alignItems="center">
            <Checkbox colorScheme="red" isChecked={isChecked} onChange={handleCheckboxToggle} />
          </Flex>
        ) : null}
      </CardFooter>
    </Card>
  );
};
const GroupCardItem = ({ group , onDelete}) => {

  return (
    <Card>
      <CardHeader>
        <SunIcon boxSize={8} color="blue.300" />
      </CardHeader>
      <CardBody>
        <Badge colorScheme="purple">Group</Badge>
        <br />
        <Text as="b">{group.groupName}</Text>
        <br />
        <Badge variant="solid" colorScheme="blue">
          {group.generatedNumber}
        </Badge>
      </CardBody>
      <CardFooter bg="purple.200" alignItems="center" justifyContent="center">
      <ButtonGroup>
          <DeletePopover
            button={
              <Button flex="1" variant="ghost" leftIcon={<DeleteIcon />} />
            }
            GroupID={group.id}
            onDelete={onDelete}
          />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default ParticipantOnEventCard;
