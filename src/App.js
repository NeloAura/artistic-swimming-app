import './App.css';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
//import components here
import Navigation from './Components/Navigation';   
import LoginComp from './Components/Login';

function App() {
  return (
    <ChakraProvider>
    

      <nav>
      <Navigation/> 
      </nav>
     
    <LoginComp/>
   
   
    
    </ChakraProvider>
  )
}

export default App;
