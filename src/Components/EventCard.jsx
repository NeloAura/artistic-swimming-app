import React from 'react'
import {
  ChakraProvider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  SimpleGrid,
  Avatar,
  Text,
  Button,
  Box,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react'

import { ViewIcon,EditIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons'
import EventImage from '../assets/images/event.png'


function AlertDialogExample() {
  const { isOpen, onOpen, onClose } = React.useDisclosure()
  const cancelRef = React.useRef()

  return (
    <>
      <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />} onClick={onOpen}>
        Delete 
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}


const EventCard = () => (
  <ChakraProvider resetCSS>
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(400px, 1fr))'>
    <Card maxW='lg' bg='twitter.300' margin={1}>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Event' src={EventImage}/>

        <Box>
          <Heading size='sm'>Event</Heading>
          <Text>Solo</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<DownloadIcon />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text 
    bg='red.300' 
    borderRadius={45}
    display="flex"
    flexDirection="column"
    justifyContent="space-around"
    alignItems="center"
    padding={10}
    textAlign={'center'}
    >
        Time: 14:30
      <br></br>
        Duration:30min

    </Text>
  </CardBody>
  

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    flexDirection={'row'}
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}

  >
    <Button flex='1' variant='ghost' leftIcon={<ViewIcon/>}>
      View
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
      Edit
    </Button>
    {/* {AlertDialogExample()} */}
    {/* Trying to call the AlertDialogExample function to render the button and display alert popover , but somehow the page renders blank , Hellp!! */}
  <Button flex='1' variant='ghost'  leftIcon={<DeleteIcon />}>Delete</Button>
     
  </CardFooter>
</Card>

<Card maxW='lg' bg='twitter.300' margin={1}>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Event' src={EventImage}/>

        <Box>
          <Heading size='sm'>Event</Heading>
          <Text>Duo</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<DownloadIcon />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text 
    bg='red.300' 
    borderRadius={45}
    display="flex"
    flexDirection="column"
    justifyContent="space-around"
    alignItems="center"
    padding={10}
    textAlign={'center'}
    >
        Time: 15:00
      <br></br>
        Duration:45min

    </Text>
  </CardBody>
  

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    flexDirection={'row'}
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}

  >
    <Button flex='1' variant='ghost' leftIcon={<ViewIcon/>}>
      View
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
      Edit
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />}>
      Delete
    </Button>
  </CardFooter>
</Card>
<Card maxW='lg' bg='twitter.300' margin={1}>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Event' src={EventImage}/>

        <Box>
          <Heading size='sm'>Event</Heading>
          <Text>Solo</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<DownloadIcon />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text 
    bg='red.300' 
    borderRadius={45}
    display="flex"
    flexDirection="column"
    justifyContent="space-around"
    alignItems="center"
    padding={10}
    textAlign={'center'}
    >
        Time: 14:30
      <br></br>
        Duration:30min

    </Text>
  </CardBody>
  

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    flexDirection={'row'}
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}

  >
    <Button flex='1' variant='ghost' leftIcon={<ViewIcon/>}>
      View
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
      Edit
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />}>
      Delete
    </Button>
  </CardFooter>
</Card>
<Card maxW='lg' bg='twitter.300' margin={1}>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Event' src={EventImage}/>

        <Box>
          <Heading size='sm'>Event</Heading>
          <Text>Solo</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<DownloadIcon />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text 
    bg='red.300' 
    borderRadius={45}
    display="flex"
    flexDirection="column"
    justifyContent="space-around"
    alignItems="center"
    padding={10}
    textAlign={'center'}
    >
        Time: 14:30
      <br></br>
        Duration:30min

    </Text>
  </CardBody>
  

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    flexDirection={'row'}
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}

  >
    <Button flex='1' variant='ghost' leftIcon={<ViewIcon/>}>
      View
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
      Edit
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />}>
      Delete
    </Button>
  </CardFooter>
</Card>
<Card maxW='lg' bg='twitter.300' margin={1}>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Event' src={EventImage}/>

        <Box>
          <Heading size='sm'>Event</Heading>
          <Text>Solo</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<DownloadIcon />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text 
    bg='red.300' 
    borderRadius={45}
    display="flex"
    flexDirection="column"
    justifyContent="space-around"
    alignItems="center"
    padding={10}
    textAlign={'center'}
    >
        Time: 14:30
      <br></br>
        Duration:30min

    </Text>
  </CardBody>
  

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    flexDirection={'row'}
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}

  >
    <Button flex='1' variant='ghost' leftIcon={<ViewIcon/>}>
      View
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
      Edit
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />}>
      Delete
    </Button>
  </CardFooter>
</Card>
<Card maxW='lg' bg='twitter.300' margin={1}>
  <CardHeader>
    <Flex spacing='4'>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Event' src={EventImage}/>

        <Box>
          <Heading size='sm'>Event</Heading>
          <Text>Solo</Text>
        </Box>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        icon={<DownloadIcon />}
      />
    </Flex>
  </CardHeader>
  <CardBody>
    <Text 
    bg='red.300' 
    borderRadius={45}
    display="flex"
    flexDirection="column"
    justifyContent="space-around"
    alignItems="center"
    padding={10}
    textAlign={'center'}
    >
        Time: 14:30
      <br></br>
        Duration:30min

    </Text>
  </CardBody>
  

  <CardFooter
    justify='space-between'
    flexWrap='wrap'
    flexDirection={'row'}
    sx={{
      '& > button': {
        minW: '136px',
      },
    }}

  >
    <Button flex='1' variant='ghost' leftIcon={<ViewIcon/>}>
      View
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<EditIcon />}>
      Edit
    </Button>
    <Button flex='1' variant='ghost' leftIcon={<DeleteIcon />}>
      Delete
    </Button>
  </CardFooter>
</Card>
</SimpleGrid>
</ChakraProvider>
)

export default EventCard