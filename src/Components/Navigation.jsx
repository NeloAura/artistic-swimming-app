import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  useDisclosure,
  List,
  IconButton,
  Box,
  Avatar,
  AvatarBadge,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Stack,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  // Alert,
  // AlertIcon,
  // AlertDescription,
  // AlertTitle,
  // CloseButton
} from "@chakra-ui/react";
import {
  InfoOutlineIcon,
  AddIcon,
  HamburgerIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { emit } from "../socket_io";
import { socket } from "../socket_io";

//constants

//functions

// Register a new user with their username and password

async function register(name, username, password, role) {
  try {
    const result = await emit("register-user", {
      name,
      username,
      password,
      role,
    });
    console.log("Registration successful:", result);

    return result;
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("Registration failed");
  }
}
async function registerclub(name, cellPhone, email) {
  try {
    const result = await emit("register-club", {
      name,
      cellPhone,
      email,
    });
    console.log(" Club Registration successful:", result);
    return result;
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("Registration failed");
  }
}
async function registerParticipant(lastName, firstName, birthYear, country, clublinkId, division, age_category, age_group) {
  try {
    const result = await emit("register-participant", {
      lastName,
      firstName,
      birthYear,
      country,
      clublinkId,
      division,
      age_category,
      age_group,
    });
    console.log("Participant Registration successful:", result);
    return result;
  } catch (error) {
    console.error("Registration failed:", error);
    throw new Error("Registration failed");
  }
}


function WalkthroughPopover(button) {
  const initialFocusRef = React.useRef();
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="twiter.300">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Add
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          Click the desired button with descripton to add
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <ButtonGroup size="sm">
            {ParticipantDrawer()}
            {UserDrawer()}
            {ClubDrawer()}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
function UserDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
      const result = await register(name, username, password, role).then(
        onClose()
      );

      console.log("Registration successful:", result);
      return result;
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  return (
    <>
      <Button colorScheme="purple" onClick={onOpen}>
        User{" "}
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
            Create a new account
          </DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    ref={firstField}
                    id="name"
                    placeholder="Please enter name"
                  />
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input id="username" placeholder="Please enter username" />
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Please enter password"
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="role">Select Role</FormLabel>
                  <Select id="role" defaultValue="Stakamahachi">
                    <option value="admin">Admin</option>
                    <option value="judge">Jugde</option>
                  </Select>
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
function ParticipantDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  const [clubs, setClubs] = React.useState([]);

  // Assuming you are using an asynchronous function
  const fetchClubs = async () => {
    // Perform your data fetching logic here
    return new Promise((resolve, reject) => {
      socket.emit('fetchClubs');
      socket.on('clubsData', (clubs) => {
      resolve(clubs);
    });
    socket.on('connect_error', (error) => {
      reject(error);
      socket.disconnect();
    });
    });
  };

  React.useEffect(() => {
    const fetchClubsData = async () => {
      try {
        const clubsData = await fetchClubs();
        setClubs(clubsData);
      } catch (error) {
        console.error('Error setting clubs:', error);
      }
    };

    fetchClubsData();
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const lastName = document.getElementById('lastname').value;
    const firstName = document.getElementById('firstname').value;
    const birthYear = document.getElementById('BirthDate').value;
    const country = document.getElementById('country').value;
    const clublinkId = document.getElementById('club').value;
    const division = document.getElementById('division').value;
    const age_category = document.getElementById('age-categorie').value;
    const age_group = document.getElementById('age-group').value;

    try {
     const result = await registerParticipant(
        lastName,
        firstName,
        birthYear,
        country,
        clublinkId,
        division,
        age_category,
        age_group
      ).then(onClose());
      
      console.log("Registration successful:", result);
      return result;

    } catch (error) {
      console.error('Failed to register participant:', error);
    }
  };
  
  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Participant{" "}
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
            Create a new Participant
          </DrawerHeader>

          <DrawerBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="lastname">Participant Lastname</FormLabel>
                <Input
                  ref={firstField}
                  id="lastname"
                  placeholder="Please enter lastname"
                />
                <FormLabel htmlFor="firstname">Participant Firstname</FormLabel>
                <Input id="firstname" placeholder="Please enter firstname" />
                <br/>
                <br/>
                <FormLabel htmlFor="BirthDate"> Birthyear</FormLabel>
                <Input
                  type="date"
                  id="BirthDate"
                  placeholder="BirthDate"
                ></Input>
                <FormLabel htmlFor="country">Country</FormLabel>
                <Select id="country" defaultValue="Curacao">
                  <option value="Curacao">Curacao</option>
                  <option value="Bonaire">Bonaire</option>
                  <option value="Aruba">Aruba</option>
                  <option value="Venezuela">Venezuela</option>
                </Select>
              </Box>
              <Box></Box>
              <Box>
                <FormLabel htmlFor="club">Select Club</FormLabel>
                <Select id="club">
                  {clubs.map((club) => (
                    <option key={club.id} value={club.name}>
                      {club.name}
                    </option>
                  ))}
                </Select>
                <br/>
                <FormLabel htmlFor="division">Select Division</FormLabel>
                <Select id="division" defaultValue="awd">
                  <option value="awd">AWD</option>
                  <option value="novice-a">Novice-A</option>
                  <option value="novice-b">Novice-B</option>
                  <option value="age-group">Age-Group</option>
                </Select>
                <br/>
                <FormLabel htmlFor="age-categorie">
                  Select AgeCategorie
                </FormLabel>
                <Select id="age-categorie" defaultValue="AWD-6&Under">
                  <option value="AWD-6&Under">AWD-6&Under</option>
                  <option value="AWD-7&8">AWD-7&8</option>
                  <option value="AWD-9&10">AWD-9&10</option>
                  <option value="AWD-11&12">AWD-11&12</option>
                  <option value="AWD-13&Over">AWD-13&Over</option>
                  <option value="Novice-6&Under">Novice-6&Under</option>
                  <option value="Novice-7&8">Novice-7&8</option>
                  <option value="Novice-9&10">Novice-9&10</option>
                  <option value="Novice-11&12">Novice-11&12</option>
                  <option value="Novice-13&Over">Novice-13&Over</option>
                </Select>
                <br/>
                <FormLabel htmlFor="age-group">
                  Select AgeGroup
                </FormLabel>
                <Select id="age-group" defaultValue="10&Under">
                  <option value="10&Under">10&Under</option>
                  <option value="12&Under">12&Under</option>
                  <option value="Youth">Youth</option>
                  <option value="Senior">Senior</option>
                </Select>
              </Box>
            </Stack>
            <br/>
            <Button colorScheme="blue" type="submit">Submit</Button>
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
function ClubDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const cellPhone = document.getElementById("cellPhone").value;
    const email = document.getElementById("email").value;

    try {
      const result = await registerclub(name, cellPhone, email).then(onClose());

      console.log("Registration successful:", result);
      return result;
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };
  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Club{" "}
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
            Create a new Club
          </DrawerHeader>

          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    ref={firstField}
                    id="name"
                    placeholder="Please enter Club Name"
                  />
                  <FormLabel htmlFor="Cell-phone">Cell-Phone</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="+5999" />
                    <Input
                      type="tel"
                      placeholder="phone number"
                      id="cellPhone"
                    />
                  </InputGroup>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Please enter email"
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
// function AlertDialog() {
//   const {
//     isOpen: isVisible,
//     onClose,
//     onOpen,
//   } = useDisclosure({ defaultIsOpen: true })

//   return isVisible ? (
//     <Alert status='success'>
//       <AlertIcon />
//       <Box>
//         <AlertTitle>Success!</AlertTitle>
//         <AlertDescription>
//          User has been added to the database.
//         </AlertDescription>
//       </Box>
//       <CloseButton
//         alignSelf='flex-start'
//         position='relative'
//         right={-1}
//         top={-1}
//         onClick={onClose}
//       />
//     </Alert>
//   ) : (
//     <Button onClick={onOpen}>Show Alert</Button>
//   )
// }

function ImagePopover(button) {
  const initialFocusRef = React.useRef();
  return (
    <Popover
      placement="bottom-start"
      initialFocusRef={initialFocusRef}
      closeOnBlur={false}
    >
      <PopoverTrigger>{button}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>QR Code</PopoverHeader>
        <PopoverBody>
          <QRCodeGenerator ssid="BBS" password="BandaBouSplash01!" />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const Navigation = () => {
  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const navigateToParticipant = () => {
    navigate("/participant");
  };

  const navigateToJudge = () => {
    navigate("/judge");
  };

  const navigateToClub = () => {
    navigate("/club");
  };

  return (
    <ChakraProvider resetCSS>
      <Box
        display="flex"
        overflow="visible"
        minWidth="100%"
        minHeight={75}
        flexDirection="row"
        alignItems="stretch"
        justifyContent="flex-start"
        backgroundColor="red.500"
      >
        <List
          styleType="square"
          display="flex"
          backgroundColor="twitter.300"
          overflow="visible"
          justifyContent="space-around"
          minHeight={75}
          minWidth="100%"
          alignItems="stretch"
          flexDirection="row"
        >
          {WalkthroughPopover(
            <IconButton
              aria-label="icon"
              icon={<AddIcon />}
              size="lg"
              isRound
              display="flex"
              flexDirection="row"
              justifyContent="center"
              colorScheme="red"
              mt={3}
              variant="link"
              backgroundColor="whiteAlpha.900"
              border={2}
              borderRadius={45}
              mb={3}
              alignItems="center"
            />
          )}

          <Button
            variant="link"
            size="md"
            ml={3}
            mr={3}
            backgroundColor="red.500"
            color="whiteAlpha.900"
            fontWeight="bold"
            opacity={1}
            colorScheme="red"
            leftIcon={<HamburgerIcon />}
            display="flex"
            justifyContent="center"
            height={16}
            textAlign="center"
            width={40}
            mt={1}
            alignItems="center"
            onClick={navigateToDashboard}
          >
            Dashboard
          </Button>
          <Button
            variant="link"
            size="md"
            ml={3}
            mr={3}
            backgroundColor="red.500"
            color="whiteAlpha.900"
            fontWeight="bold"
            opacity={1}
            colorScheme="red"
            leftIcon={<ViewIcon />}
            display="flex"
            justifyContent="center"
            height={16}
            textAlign="center"
            width={40}
            mt={1}
            alignItems="center"
            onClick={navigateToParticipant}
          >
            Participants
          </Button>
          <Button
            variant="link"
            size="md"
            ml={3}
            mr={3}
            backgroundColor="red.500"
            color="whiteAlpha.900"
            fontWeight="bold"
            opacity={1}
            colorScheme="red"
            leftIcon={<ViewIcon />}
            display="flex"
            justifyContent="center"
            height={16}
            textAlign="center"
            width={40}
            mt={1}
            alignItems="center"
            onClick={navigateToJudge}
          >
            Judges
          </Button>
          <Button
            variant="link"
            size="md"
            ml={3}
            mr={3}
            backgroundColor="red.500"
            color="whiteAlpha.900"
            fontWeight="bold"
            opacity={1}
            colorScheme="red"
            leftIcon={<ViewIcon />}
            display="flex"
            justifyContent="center"
            height={16}
            textAlign="center"
            width={40}
            mt={1}
            alignItems="center"
            onClick={navigateToClub}
          >
            Clubs
          </Button>
          {ImagePopover(
            <IconButton
              aria-label="icon"
              icon={<InfoOutlineIcon />}
              size="lg"
              isRound
              display="flex"
              flexDirection="row"
              justifyContent="center"
              colorScheme="red"
              mt={3}
              variant="link"
              backgroundColor="whiteAlpha.900"
              border={2}
              borderRadius={45}
              mb={3}
              alignItems="center"
            />
          )}

          <Avatar
            size="md"
            showBorder
            display="block"
            justifyContent="center"
            alignItems="center"
            flexDirection="row"
            mt={3}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRruTfnpNKs0px2RjVrmJy9T0srVXoUg76e8g&usqp=CAU"
          >
            <AvatarBadge bg="green.500" boxSize="1.25rem" borderColor="white" />
          </Avatar>
        </List>
      </Box>
    </ChakraProvider>
  );
};

export default Navigation;
