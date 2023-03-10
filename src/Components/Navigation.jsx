import React from 'react'
import {
  ChakraProvider,
  List,
  IconButton,
  Box,
  Avatar,
  Button
} from '@chakra-ui/react'
import { SettingsIcon, AddIcon, HamburgerIcon, ViewIcon } from '@chakra-ui/icons'

const Navigation = () => (
  <List
    styleType="square"
    display="flex"
    backgroundColor="twitter.400"
    overflow="visible"
    justifyContent="space-around"
    minHeight={75}
    minWidth="100%"
    alignItems="stretch"
    flexDirection="row"
  >
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
    />
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
