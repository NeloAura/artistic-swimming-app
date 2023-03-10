import React from 'react'
import {
  ChakraProvider,
  Container,
  InputGroup,
  InputLeftAddon,
  Input,
  Avatar,
  Text,
  IconButton
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

const LoginComp = () => (
  <ChakraProvider resetCSS>
    
    <Container
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="linkedin.400"
      p={10}
      mt={10}
      mb={10}
    >
    
      <Text
        pb={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontWeight="bold"
        textAlign="center"
        fontSize="5xl"
        
      >
        Welcome
      </Text>
      <Avatar
        size="2xl"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={8}
        showBorder
      />
      <InputGroup>
        <InputLeftAddon backgroundColor="red.400">User</InputLeftAddon>
        <Input />
      </InputGroup>
      <InputGroup mt={5} mb={6}>
        <InputLeftAddon backgroundColor="red.400">Pass</InputLeftAddon>
        <Input Type= {"password"} />
      </InputGroup>
      <IconButton
        aria-label="icon"
        icon={<CheckCircleIcon />}
        size="lg"
        isRound
        mt={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={20}
        width={20}
        borderRadius={45}
        boxShadow="60%"
        opacity={0.87}
        bgGradient="linear(to bottom right, red.500,red.300)"
      />
    </Container>
    
  </ChakraProvider>
)

export default LoginComp
