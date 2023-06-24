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

async function deleteClub(ClubID) {
  try {
    const result = await emit("delete-club", ClubID);
    console.log("Club deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw new Error("Delete failed");
  }
}

async function updateClub(ClubID, name, cellPhone, email) {
  try {
    const result = emit("update-club", {
      id: ClubID,
      name,
      cellPhone,
      email,
    });
    console.log("Update successful:", ClubID);
    return result;
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error("Update failed");
  }
}

const DeletePopover = ({ button, initialFocusRef, ClubID, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(ClubID);
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
          participants in the club and can't undo this action afterwards.
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

function ClubForm({
  initialName,
  initialCellPhone,
  initialEmail,
  isOpen,
  onOpen,
  onClose,
  onUpdate,
  ClubID,
}) {
  const firstField = React.useRef();
  const [formValues, setFormValues] = React.useState({
    name: initialName,
    cellPhone: initialCellPhone,
    email: initialEmail,
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormValues({
        name: initialName,
        cellPhone: initialCellPhone,
        email: initialEmail,
      });
    }
  }, [isOpen, initialName, initialCellPhone, initialEmail]);

  const handleSubmit = async () => {
    try {
      const { name, cellPhone, email } = formValues;
      const result = await onUpdate(ClubID, name, cellPhone, email);
      onClose();
      console.log("Update successful:", ClubID);
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
            Update Club
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor={`name_${ClubID}`}>Name</FormLabel>
                  <Input
                    ref={firstField}
                    id={`name_${ClubID}`}
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Please enter Club name"
                  />
                  <FormLabel htmlFor={`cellPhone_${ClubID}`}>
                    Phone
                  </FormLabel>
                  <Input
                    type="tel"
                    id={`cellPhone_${ClubID}`}
                    value={formValues.cellPhone}
                    onChange={(e) => handleChange("cellPhone", e.target.value)}
                    placeholder="phone number"
                  />
                  <FormLabel htmlFor={`email_${ClubID}`}>email</FormLabel>
                  <Input
                    id={`email_${ClubID}`}
                    value={formValues.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Please enter email"
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

const ClubCard = () => {
  const [clubs, setClubs] = React.useState([]);
  
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

  const handleDeleteClub = async (ClubID) => {
    try {
      await deleteClub(ClubID);
      const updatedClubs = clubs.filter((club) => club.id !== ClubID);
      setClubs(updatedClubs);
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  const handleUpdateClub = async (ClubID, name, cellPhone, email) => {
    try {
      await updateClub(ClubID, name, cellPhone, email);
      setClubs((prevClubs) =>
        prevClubs.map((Club) => {
          if (Club.id === ClubID) {
            return {
              ...Club,
              name,
              cellPhone,
              email,
            };
          }
          return Club;
        })
      );
    } catch (error) {
      console.error("Error updating Club:", error);
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
        {clubs.map((club) => (
          <ClubCardItem
            key={club.id}
            club={club}
            onDelete={handleDeleteClub}
            onUpdate={handleUpdateClub}
          />
        ))}
      </SimpleGrid>
    </ChakraProvider>
  );
};

// Club card item component
const ClubCardItem = ({ club, onDelete, onUpdate }) => {
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
        <Badge colorScheme="purple">Club</Badge>
        <br />
        <Text as="b">{club.name}</Text>
        <br />
        <Badge variant="solid" colorScheme="blue">
          TEAM
        </Badge>
      </CardBody>
      <CardFooter alignItems="center" justifyContent="center">
        <ButtonGroup>
          <ClubForm
            isOpen={isOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            initialName={club.name}
            initialCellPhone={club.cellPhone}
            initialEmail={club.email}
            ClubID={club.id}
            onUpdate={onUpdate}
          />
          <DeletePopover
            button={<Button flex="1" variant="ghost" leftIcon={<DeleteIcon />} />}
            ClubID={club.id}
            onDelete={onDelete}
          />
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;
