import './App.css';
import React from 'react';
import Navigation from './Components/Navigation';   

import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <nav>
      <Navigation/>

      </nav>
    </ChakraProvider>
  )
}

export default App;
