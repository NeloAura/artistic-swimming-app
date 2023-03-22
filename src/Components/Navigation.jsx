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
  InputRightAddon,
  Textarea,
  Select,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { SettingsIcon, AddIcon, HamburgerIcon, ViewIcon } from '@chakra-ui/icons'


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
            <Button colorScheme='purple' ref={initialFocusRef}>
              Judge
            </Button>
            <Button colorScheme='blue'>Club</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
function ParticipantDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()

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
                <FormLabel htmlFor='username'>Name</FormLabel>
                <Input
                  ref={firstField}
                  id='username'
                  placeholder='Please enter user name'
                />
              </Box>

              <Box>
                <FormLabel htmlFor='url'>Url</FormLabel>
                <InputGroup>
                  <InputLeftAddon>http://</InputLeftAddon>
                  <Input
                    type='url'
                    id='url'
                    placeholder='Please enter domain'
                  />
                  <InputRightAddon>.com</InputRightAddon>
                </InputGroup>
              </Box>

              <Box>
                <FormLabel htmlFor='owner'>Select Owner</FormLabel>
                <Select id='owner' defaultValue='segun'>
                  <option value='segun'>Segun Adebayo</option>
                  <option value='kola'>Kola Tioluwani</option>
                </Select>
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
    <IconButton
      aria-label="icon"
      icon={<SettingsIcon />}
      size="lg"
      isRound
      display="flex"
      flexDirection="row"
      justifyContent="center"
      colorScheme="red"
      mt={3}
      variant="link"
      backgroundColor="whiteAlpha.900"
      borderRadius={45}
      border={2}
      mb={3}
    />
    
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
