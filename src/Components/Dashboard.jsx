import React from 'react'
import CompetitionCard from './CompetitionCard'
import { ChakraProvider } from '@chakra-ui/react'

const Dashboard = () => (
<ChakraProvider resetCSS>
    <CompetitionCard/>
</ChakraProvider>
  )
  
  export default Dashboard