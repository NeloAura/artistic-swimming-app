import React from 'react'
import EventCard from './EventCard'
import { ChakraProvider } from '@chakra-ui/react'

const Dashboard = () => (
<ChakraProvider resetCSS>
    <EventCard/>
</ChakraProvider>
  )
  
  export default Dashboard