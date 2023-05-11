import React from 'react'
import {
  ChakraProvider,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  CardFooter,
  Badge,
  Button
} from '@chakra-ui/react'
import { SunIcon } from '@chakra-ui/icons'
import NavigationComp from './Navigation'

//link : https://chakra-ui.com/docs/components/card/usage

const ParticipantCard = () => (
    <ChakraProvider resetCSS>
    <nav>
    <NavigationComp/>
    </nav>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
<Card>
    <CardHeader>
     <SunIcon boxSize={8} color='blue.200' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='purple'>Participant</Badge>
     <br />
      <Text as='b' >Jonathan</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    20
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
     <SunIcon boxSize={8} color='blue.200' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='pink'>Group</Badge>
     <br />
      <Text as='b' >Wambi | Gary</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    65
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
     <SunIcon boxSize={8} color='blue.200' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='purple'>Participant</Badge>
     <br />
      <Text as='b' >Kevin</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    34
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
     </SimpleGrid>
    </ChakraProvider>
  )
  
  export default ParticipantCard