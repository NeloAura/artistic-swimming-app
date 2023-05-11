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
import { AtSignIcon } from '@chakra-ui/icons'
//link : https://chakra-ui.com/docs/components/card/usage

const JudgeCard = () => (
    <ChakraProvider resetCSS>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>


<Card>
    <CardHeader>
     <AtSignIcon boxSize={8} color='blue.300' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='purple'>Judge</Badge>
     <br />
      <Text as='b' >Jonathan</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    Type : artistic expression
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
     <AtSignIcon boxSize={8} color='blue.300' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='purple'>Judge</Badge>
     <br />
      <Text as='b' >Jeanello</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    Type : difficulty
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>
<Card>
    <CardHeader>
     <AtSignIcon boxSize={8} color='blue.300' />
    </CardHeader>
    <CardBody>
    <Badge colorScheme='purple'>Judge</Badge>
     <br />
      <Text as='b' >Kevin</Text>
      <br />
      <Badge variant='solid' colorScheme='blue'>
    Type : execution
  </Badge>
    </CardBody>
    <CardFooter alignItems="center" justifyContent="center">
      <Button>Edit</Button>
    </CardFooter>
</Card>

</SimpleGrid>
    </ChakraProvider>
  )
  
  export default JudgeCard