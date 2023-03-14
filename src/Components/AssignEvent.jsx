import React from 'react'
import {
  ChakraProvider,
  Text,
  Switch,
  Container,
  List,
  SimpleGrid,
  IconButton
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const AssignEventComp = () => (
  <ChakraProvider resetCSS>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(650px, 1fr))' alignContents={'center'}>
    <Container
      backgroundColor="twitter.300"
      pb={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="space-around"
      m={8}
      overflow="visible"
      minWidth="200px"
      minHeight="200px"
    >
      <Text
        mt={5}
        pt={2}
        pb={2}
        backgroundColor="red.300"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontWeight="bold"
        textAlign="center"
        color="gray.600"
        letterSpacing="widest"
      >
        Participants{' '}
      </Text>
      <Text
        mb={5}
        pt={2}
        pb={2}
        backgroundColor="red.100"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontWeight="bold"
        textAlign="center"
        color="gray.600"
        letterSpacing="tight"
      >
        Event : Solo{' '}
      </Text>
      <List
        mb={5}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        overflow="scroll"
      >
        <Container
          display="flex"
          justifyContent="space-between"
          backgroundColor="twitter.200"
          mb={2}
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Text>Jeanello</Text>
          <Switch  colorScheme="red" />
        </Container>
        <Container
          display="flex"
          justifyContent="space-between"
          backgroundColor="twitter.200"
          mb={2}
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Text>Kevin</Text>
          <Switch  colorScheme="red" />
        </Container>
        <Container
          display="flex"
          justifyContent="space-between"
          backgroundColor="twitter.200"
          mb={2}
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Text>Jonathan</Text>
          <Switch  colorScheme="red" />
        </Container>
      </List>
      <IconButton
        aria-label="icon"
        icon={<CheckCircleIcon />}
        size="md"
        colorScheme="red"
        ml={5}
        mr={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      />
    </Container>
    <Container
      backgroundColor="twitter.300"
      pb={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="space-around"
      m={8}
      overflow="visible"
      minWidth="200px"
      minHeight="200px"
    >
      <Text
        mt={5}
        pt={2}
        pb={2}
        backgroundColor="teal.400"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontWeight="bold"
        textAlign="center"
        color="gray.600"
        letterSpacing="widest"
      >
        Judges
      </Text>
      <Text
        mb={5}
        pt={2}
        pb={2}
        backgroundColor="teal.100"
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontWeight="bold"
        textAlign="center"
        color="gray.600"
        letterSpacing="tight"
      >
        Event : Solo{' '}
      </Text>
      <List
        mb={5}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        overflow="scroll"
      >
        <Container
          display="flex"
          justifyContent="space-between"
          backgroundColor="twitter.200"
          mb={2}
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Text>Hellburg</Text>
          <Switch  colorScheme="teal" />
        </Container>
        
        <Container
          display="flex"
          justifyContent="space-between"
          backgroundColor="twitter.200"
          mb={2}
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Text>Tomas</Text>
          <Switch  colorScheme="teal" />
        </Container>
        <Container
          display="flex"
          justifyContent="space-between"
          backgroundColor="twitter.200"
          mb={2}
          alignItems="center"
          pt={2}
          pb={2}
        >
          <Text>Martina</Text>
          <Switch  colorScheme="teal" />
        </Container>
      </List>
      <IconButton
        aria-label="icon"
        icon={<CheckCircleIcon />}
        size="md"
        colorScheme="teal"
        ml={5}
        mr={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      />
    </Container>
    </SimpleGrid>
  </ChakraProvider>
)

export default AssignEventComp
