import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  useDisclosure,
  List,
  IconButton,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Badge,
  SimpleGrid,
  Checkbox,
  CheckboxGroup,
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
  Spinner,
} from "@chakra-ui/react";
import {
  InfoOutlineIcon,
  AddIcon,
  HamburgerIcon,
  ViewIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { emit } from "../socket_io";
import { socket } from "../socket_io";
const countries = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire",
  "Sint Eustatius",
  "Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "British Virgin Islands",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos Islands",
  "Colombia",
  "Comoros",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern and Antarctic Lands",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard island and McDonald Islands",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "North Korea",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Republic of the Congo",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and South Sandwich Islands",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "U.S. Virgin Islands",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican",
  "Venezuela",
  "Vietnam",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

//functions

const Navigation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
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

  const navigateToGenerated = () => {
    navigate("/generated");
  };

  const navigateToClubBoard = () => {
    navigate("/clubboard");
  };

  const navigateToParticipantBoard = () => {
    navigate("/participantboard");
  };

  const navigateToGroupBoard = () => {
    navigate("/groupboard");
  };

  const generateNumbers = () => {
    socket.emit("assign-random-numbers");
  };

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
      setTimeout(() => {
        setIsLoading(false);
        navigateToJudge();
      }, 5000);
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
      navigateToDashboard();
      setTimeout(() => {
        setIsLoading(false);
        navigateToClub();
      }, 5000);
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed");
    }
  }
  async function registercompetition(name) {
    try {
      const result = emit("register-competition", {
        name,
      });
      console.log(" Competition Registration successful:", result);
      navigateToDashboard();
      setTimeout(() => {
        setIsLoading(false);
        navigateToDashboard();
      }, 5000);
      return result;
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed");
    }
  }
  async function registerParticipant(
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
      const result = emit("register-participant", {
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
      console.log("Participant Registration successful:", result);
      navigateToDashboard();
      setTimeout(() => {
        setIsLoading(false);
        navigateToParticipant();
      }, 5000);
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
        <PopoverContent
          color="white"
          bg="blue.800"
          borderColor="twiter.300"
          minWidth="500px"
          overflowY="auto"
        >
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
              {CompetitionDrawer()}
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
        setIsLoading(true);
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
    const [competitions, setCompetitions] = React.useState([]);
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

    const [formValues, setFormValues] = React.useState({
      lastname: "",
      firstname: "",
      birthYear: "",
      country: "",
      clublinkId: "",
      division: "",
      age_category: "",
      competition: "",
      event: "",
    });

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

        const result = await registerParticipant(
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
        setIsLoading(true);
        onClose();

        return result;
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    };

    const handleChange = (field, value) => {
      setFormValues((prevFormValues) => {
        if (field === "event") {
          // Checkbox field
          const prevFieldValues = prevFormValues[field] || []; // Initialize with an empty array if the field doesn't exist

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
        <Button colorScheme="green" onClick={onOpen}>
          Participant
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
              Create Participant
            </DrawerHeader>
            <DrawerBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing="24px">
                  <Box>
                    <FormLabel htmlFor={`lastname`}>Lastname</FormLabel>
                    <Input
                      ref={firstField}
                      id={`lastname`}
                      value={formValues.lastname}
                      onChange={(e) => handleChange("lastname", e.target.value)}
                      placeholder="Please enter lastname"
                    />
                    <FormLabel htmlFor={`firstname`}>Firstname</FormLabel>
                    <Input
                      id={`firstname`}
                      value={formValues.firstname}
                      onChange={(e) =>
                        handleChange("firstname", e.target.value)
                      }
                      placeholder="Please enter firstname"
                    />
                    <br />
                    <br />
                    <FormLabel htmlFor={`BirthDate`}> Birthyear</FormLabel>
                    <Input
                      type="date"
                      id={`BirthDate`}
                      value={formValues.birthYear}
                      onChange={(e) =>
                        handleChange("birthYear", e.target.value)
                      }
                      placeholder="BirthDate"
                    />

                    <FormLabel htmlFor={`country`}>Country</FormLabel>
                    <Select
                      id={`country`}
                      value={formValues.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Box></Box>
                  <Box>
                    <FormLabel htmlFor={`club`}>Select Club</FormLabel>
                    <Select
                      id={`club`}
                      placeholder="Please Choose Club "
                      value={formValues.clublinkId}
                      onChange={(e) =>
                        handleChange("clublinkId", e.target.value)
                      }
                    >
                      {clubs.map((club) => (
                        <option key={club.id} value={club.name}>
                          {club.name}
                        </option>
                      ))}
                    </Select>
                    <br />
                    <FormLabel htmlFor={`division`}>Select Division</FormLabel>
                    <Select
                      id={`division`}
                      placeholder="Please Choose Division "
                      value={formValues.division ?? "AWD"}
                      onChange={(e) => handleChange("division", e.target.value)}
                    >
                      <option value="AWD">AWD</option>
                      <option value="Novice-A">Novice-A</option>
                      <option value="Novice-B">Novice-B</option>
                      <option value="Age Group">Age-Group</option>
                    </Select>
                    <br />
                    <FormLabel htmlFor={`age-categorie`}>
                      Select AgeCategorie
                    </FormLabel>
                    <Select
                      id={`age-categorie`}
                      placeholder="Please Choose AgeCategorie"
                      value={formValues.age_category ?? "noagelimit"}
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
                      <option value="Senior">AgeGroup-Senior</option>
                    </Select>
                    <br />
                    <FormLabel htmlFor={`competition`}>
                      Select Competition
                    </FormLabel>
                    <Select
                      id={`competition`}
                      placeholder="Please Choose Competition "
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

                    <FormLabel htmlFor={`event`}>Select Events</FormLabel>
                    <CheckboxGroup colorScheme="green" defaultValue={[]}>
                      <Stack spacing={[1, 5]} direction={["flex-row"]}>
                        <Checkbox
                          value="Solo"
                          id={`event1`}
                          onChange={(e) =>
                            handleChange("event", e.target.value)
                          }
                          isChecked={formValues.event.includes("Solo")}
                        >
                          Solo
                        </Checkbox>
                        <Checkbox
                          colorScheme="red"
                          value="Male Solo"
                          id={`event5`}
                          onChange={(e) =>
                            handleChange("event", e.target.value)
                          }
                          isChecked={formValues.event.includes("Male Solo")}
                        >
                          Male Solo
                        </Checkbox>
                        <Checkbox
                          value="Duet"
                          id={`event2`}
                          onChange={(e) =>
                            handleChange("event", e.target.value)
                          }
                          isChecked={formValues.event.includes("Duet")}
                        >
                          Duet
                        </Checkbox>
                        <Checkbox
                          value="MixDuet"
                          id={`event3`}
                          onChange={(e) =>
                            handleChange("event", e.target.value)
                          }
                          isChecked={formValues.event.includes("MixDuet")}
                        >
                          Mix Duet
                        </Checkbox>
                        <Checkbox
                          value="Team"
                          id={`event4`}
                          onChange={(e) =>
                            handleChange("event", e.target.value)
                          }
                          isChecked={formValues.event.includes("Team")}
                        >
                          Team
                        </Checkbox>
                      </Stack>
                    </CheckboxGroup>
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
  function ClubDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = React.useRef();
    const handleSubmit = async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;
      const cellPhone = document.getElementById("cellPhone").value;
      const email = document.getElementById("email").value;

      try {
        const result = await registerclub(name, cellPhone, email).then(
          onClose()
        );
        setIsLoading(true);
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
  function CompetitionDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = React.useRef();
    const handleSubmit = async (event) => {
      event.preventDefault();
      const name = document.getElementById("name").value;

      try {
        const result = await registercompetition(name).then(onClose());
        setIsLoading(true);
        console.log("Registration successful:", result);
        return result;
      } catch (error) {
        console.error("Failed to register :", error);
      }
    };
    return (
      <>
        <Button colorScheme="yellow" onClick={onOpen}>
          Competition{" "}
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
              Create a new Competition
            </DrawerHeader>

            <DrawerBody>
              <form onSubmit={handleSubmit}>
                <Stack spacing="24px">
                  <Box>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                      ref={firstField}
                      id="name"
                      placeholder="Please enter Competition Name"
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
  function ImagePopover(button) {
    const initialFocusRef = React.useRef();
    const [judges, setJudges] = React.useState([]);

    // Fetch judges
    const fetchJudges = async () => {
      return new Promise((resolve, reject) => {
        socket.emit("fetchJudges");
        socket.on("judgesData", (judges) => {
          resolve(judges);
        });
        socket.on("connect_error", (error) => {
          reject(error);
          socket.disconnect();
        });
      });
    };

    React.useEffect(() => {
      const fetchJudgesData = async () => {
        try {
          const judgesData = await fetchJudges();
          setJudges(judgesData);
        } catch (error) {
          console.error("Error setting judges:", error);
        }
      };

      fetchJudgesData();
    }, []);

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
            <SimpleGrid
              spacing={4}
              templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            >
              {judges.map((judge) => (
                <JudgeCardItem key={judge.id} judge={judge} />
              ))}
            </SimpleGrid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
  const JudgeCardItem = ({ judge }) => {
    const button = (
      <Badge variant="solid" colorScheme="blue">
        Judge: {judge.name}
      </Badge>
    );

    return (
      <QRCodeGenerator
        ssid="BBS"
        password="BandaBouSplash01!"
        username={judge.username}
        userPassword={judge.password}
        button={button}
      />
    );
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
          {isLoading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.500"
              size="xl"
              mt="3"
            />
          )}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              mt={4}
              colorScheme="red"
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  generateNumbers();
                  navigateToGenerated();
                }}
              >
                GenerateNumbers
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigateToClubBoard();
                }}
              >
                ClubBoard
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigateToParticipantBoard();
                }}
              >
                ParticipantBoard
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigateToGroupBoard();
                }}
              >
                GroupBoard
              </MenuItem>
            </MenuList>
          </Menu>
        </List>
      </Box>
    </ChakraProvider>
  );
};

export default Navigation;
