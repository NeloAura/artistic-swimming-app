import React from 'react'
import {
  ChakraProvider,
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
  ButtonGroup
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
            <Button colorScheme='green'>Participant</Button>
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
