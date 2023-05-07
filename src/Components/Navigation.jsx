import React from 'react'
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
  Textarea,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Checkbox
} from '@chakra-ui/react'
import { InfoOutlineIcon, AddIcon, HamburgerIcon, ViewIcon } from '@chakra-ui/icons'
import { QRCodeGenerator } from './QRCodeGenerator'
import {emit} from '../socket_io.js';
import os from "os";
import {socket} from "../socket_io"
//constants

const ip =  getIpAddress();
const secret = generateSecretCode();

//functions

function getIpAddress() {
  return new Promise((resolve, reject) => {
    const ifaces = os.networkInterfaces();
    let ipAddress;

    Object.keys(ifaces).forEach(ifname => {
      ifaces[ifname].forEach(iface => {
        if (iface.family === 'IPv4' && !iface.internal) {
          ipAddress = iface.address;
        }
      });
    });

    if (ipAddress) {
      resolve(ipAddress);
    } else {
      reject(new Error('Unable to retrieve IP address'));
    }
  });
}

function generateSecretCode(length = 8) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  console.log(code);
  socket.emit('secretCode', code)
  //

  return code;
}


// Register a new user with their username and password
async function register(name, username, password, role) {
  try {
    const result = await emit('register', { name, username, password, role });
    console.log('Registration successful:', result);
    return result;
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Registration failed');
  }
}


function WalkthroughPopover(button) {
  const initialFocusRef = React.useRef()
  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement='bottom'
      closeOnBlur={false}
    >
      <PopoverTrigger>
        {button}
      </PopoverTrigger>
      <PopoverContent color='white' bg='blue.800' borderColor='twiter.300'>
        <PopoverHeader pt={4} fontWeight='bold' border='0'>
          Add
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          Click the desired button with descripton to add
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
     
     >
          
          <ButtonGroup size='sm'>
            {ParticipantDrawer()}
            {UserDrawer()}
            {ClubDrawer()}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
function UserDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
      await register(name, username, password, role);
      onClose();
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  };

  return (
    <>
      <Button colorScheme='purple' onClick={onOpen}>User </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Create a new account
          </DrawerHeader>
   
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing='24px'>
                <Box>
                  <FormLabel htmlFor='name'>Name</FormLabel>
                  <Input
                    ref={firstField}
                    id='name'
                    placeholder='Please enter name'
                  />
                  <FormLabel htmlFor='username'>Username</FormLabel>
                  <Input
                    id='username'
                    placeholder='Please enter username'
                  />
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <Input
                    type='password'
                    id='password'
                    placeholder='Please enter password'
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor='role'>Select Role</FormLabel>
                  <Select id='role' defaultValue='Stakamahachi'>
                    <option value='admin'>Admin</option>
                    <option value='judge'>Jugde</option>
                  </Select>
                </Box>
              </Stack>
              <Button mt={4} colorScheme='blue' type='submit'>Submit</Button>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
function ParticipantDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()
  const [checkedItems, setCheckedItems] = React.useState([false, false])
  const allChecked = checkedItems.every(Boolean)
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <>
      <Button colorScheme='green' onClick={onOpen}>Participant </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Create a new account
          </DrawerHeader>
   
          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
              <FormLabel htmlFor='lastname'>Participant LastName</FormLabel>
                <Input
                  ref={firstField}
                  id='lastname'
                  placeholder='Please enter lastname'
                />
                <FormLabel htmlFor='firstname'>Participant FirstName</FormLabel>
                <Input
                  id='firstname'
                  placeholder='Please enter firstname'
                />
                <FormLabel htmlFor='BirthDate'>Participant FirstName</FormLabel>
                <Input
                type='date'
                id='firstname'
                placeholder='BirthDate'
                >

                </Input>
                <FormLabel htmlFor='country'>Country</FormLabel>
                <Select id='country' defaultValue='Curacao'>
                  <option value='Curacao'>AWD</option>
                  <option value='Bonaire'>Novice-A</option>
                  <option value='Aruba'>Novice-B</option>
                  <option value='Venezuela'>Age-Group</option>
                </Select>
              </Box>
              <Box>
              
              </Box>

              <Box>
                <FormLabel htmlFor='club'>Select Club</FormLabel>
                <Select id='club' defaultValue='Stakamahachi'>
                  <option value='Stakamahachi'>Stakamahachi</option>
                  <option value='Tioluwani'>Tioluwani</option>
                </Select>
                <FormLabel htmlFor='division'>Select Division</FormLabel>
                <Select id='division' defaultValue='awd'>
                  <option value='awd'>AWD</option>
                  <option value='novice-a'>Novice-A</option>
                  <option value='novice-b'>Novice-B</option>
                  <option value='age-group'>Age-Group</option>
                </Select>
                <FormLabel htmlFor='age-categorie'>Select AgeCategorie</FormLabel>
                
              </Box> 

              <Box> 
              {/* awd */}
              <>
              <Checkbox>
                AWD
              </Checkbox>
           {/* Novice */}
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
      >
        Novice
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        <Checkbox
          isChecked={checkedItems[0]}
          onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
        >
          6 & Under
        </Checkbox>
        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          7 & 8
        </Checkbox>

        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          9 & 10
        </Checkbox>

        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          11 & 12
        </Checkbox>

        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          13 & O
        </Checkbox>
      </Stack>

         {/* Agegroup */}
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
      >
        AgeGroup
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        <Checkbox
          isChecked={checkedItems[0]}
          onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
        >
          10 & Under
        </Checkbox>
        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          12 & Under
        </Checkbox>

        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          Youth
        </Checkbox>

        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          Junior
        </Checkbox>

        <Checkbox
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          Senior
        </Checkbox>
      </Stack>
    </>
              </Box>

              <Box>
                <FormLabel htmlFor='desc'>Description</FormLabel>
                <Textarea id='desc' />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
function ClubDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>Club </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            Create a new account
          </DrawerHeader>
   
          <DrawerBody>
            <Stack spacing='24px'>
              <Box>
              <FormLabel htmlFor='name'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='name'
                  placeholder='Please enter Club Name'
                />
                <FormLabel htmlFor='Cell-phone'>Cell-Phone</FormLabel>
                <InputGroup>
               <InputLeftAddon children='+5999' />
               <Input type='tel' placeholder='phone number' />
               </InputGroup>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input
                  type='email'
                  id='email'
                  placeholder='Please enter email'
                />
              </Box>

              <Box>
                <FormLabel htmlFor='role'>Select Role</FormLabel>
                <Select id='role' defaultValue='Stakamahachi'>
                  <option value='admin'>Admin</option>
                  <option value='judge'>Jugde</option>
                </Select>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth='1px'>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function ImagePopover(button) {
 
  const initialFocusRef = React.useRef()
  return (
    <Popover
        placement="bottom-start"
        initialFocusRef={initialFocusRef}
        closeOnBlur={false}
      >
        <PopoverTrigger>
          {button}
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>QR Code</PopoverHeader>
          <PopoverBody>
          <QRCodeGenerator ssid="BBS" password="BandaBouSplash01!" ipAddress={ip} secretCode={secret} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
  )
}



const Navigation = () => (

  
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
    {WalkthroughPopover(<IconButton
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
    />)}
    
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
      leftIcon={<ViewIcon/>}
      display="flex"
      justifyContent="center"
      height={16}
      textAlign="center"
      width={40}
      mt={1}
      alignItems="center"
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
    >
      Clubs
    </Button>
    {ImagePopover(<IconButton
      aria-label="icon"
      icon={<InfoOutlineIcon/>}
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
    />)}
    
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
)

const NavigationComp = () => (
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
      <Navigation />
    </Box>
  </ChakraProvider>
)

export default NavigationComp
