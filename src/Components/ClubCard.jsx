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

const ClubCard = () => (
    <ChakraProvider resetCSS>
    <nav>
    <NavigationComp/>
    </nav>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>


<Card>
    <CardHeader>
     <SunIcon boxSize={8} color='blue.300' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='red'>Club</Badge>
     <br />
      <Text as='b' >Los Vengadores</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    Colombia
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
     <SunIcon boxSize={8} color='blue.300' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='red'>Club</Badge>
     <br />
      <Text as='b' >Stakamahachi</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    Curacao
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
     <SunIcon boxSize={8} color='blue.300' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='red'>Club</Badge>
     <br />
      <Text as='b' >The Goldens</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    USA
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>

</SimpleGrid>
    </ChakraProvider>
  )
  
  export default ClubCard