import React, { useState } from 'react';
import {Navigate} from 'react-router-dom'

import {
  ChakraProvider,
  Box,
  Container,
  InputGroup,
  InputLeftAddon,
  Input,
  Avatar,
  Text,
  IconButton,

} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import adminAvatar from '../assets/images/BBS.jpg';
import {http_post} from '../../utils/axios.js';


//functions
async function authenticate(username, password) {
  try {
    const response = await http_post('/authenticate', { username, password });
    return response;
  } catch (error) {
    console.error(error);
    return new RequestResult(500, 'Internal server error');
  }
}



const LoginComp = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Perform authentication check here
    // If authentication succeeds, set authenticated to true
    const authResult = await authenticate(username, password);
    console.log(authResult.status, authResult.data);

    if(authResult.status=='200')
    setAuthenticated(true);
  };

  if (authenticated) {
    return <Navigate to="/event" />;
  }

  return (
    <ChakraProvider resetCSS>
      <Box backgroundColor="blue.100">
        <Container
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
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
            src={adminAvatar}
          />
          <InputGroup>
            <InputLeftAddon backgroundColor="red.400">User</InputLeftAddon>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </InputGroup>
          <InputGroup mt={5} mb={6}>
            <InputLeftAddon backgroundColor="red.400">Pass</InputLeftAddon>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
            onClick={handleLogin}
          />
        </Container>
      </Box>
    </ChakraProvider>
  );
};

const Login = () => {
  return (
    <LoginComp/>
  );
};

export default Login;
