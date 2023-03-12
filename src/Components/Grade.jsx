import React from 'react'
import {
  ChakraProvider,
  Tag,
  Text,
  List,
  Container,
  Switch,
  IconButton
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const GradeComp = () => (
  <ChakraProvider resetCSS>
    <List
      backgroundColor="twitter.300"
      display="flex"
      justifyContent="center"
      alignItems="space-around"
      flexDirection="column"
      border="2px"
      styleType={"square"}
    >
      <Text
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="whiteAlpha.900"
        fontWeight="bold"
        lineHeight={10}
        letterSpacing="widest"
      >
        Participants
      </Text>
      <Container
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        p={2}
        mt={5}
        mb={5}
      >
        <Container
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          mt={5}
          mb={5}
          pt={5}
          pb={5}
          width={500}
        >
          <Tag size="lg">#54</Tag>
          <Text
            backgroundColor="gray.500"
            borderRadius={45}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            color="whiteAlpha.900"
          >
            Jeanello Haddocks
          </Text>
          <Switch colorScheme="red" size="md" />
        </Container>
        <Container
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          mt={5}
          mb={5}
          pt={5}
          pb={5}
          width={500}
        >
          <Tag size="lg">#58</Tag>
          <Text
            backgroundColor="gray.500"
            borderRadius={45}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            color="whiteAlpha.900"
          >
            Kevin Naranjo Silva
          </Text>
          <Switch colorScheme="red" size="md" />
        </Container>
        <Container
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          mt={5}
          mb={5}
          pt={5}
          pb={5}
          width={500}
        >
          <Tag size="lg">#17</Tag>
          <Text
            backgroundColor="gray.500"
            borderRadius={45}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
            color="whiteAlpha.900"
          >
            Jonathan Libier
          </Text>
          <Switch colorScheme="red" size="md" />
        </Container>
      </Container>
      <IconButton
        aria-label="icon"
        icon={<CheckCircleIcon />}
        size="lg"
        mb={2}
        ml={20}
        mr={20}
        display="flex"
        justifyContent="center"
        alignItems="center"
      />
    </List>
  </ChakraProvider>
)

export default GradeComp
