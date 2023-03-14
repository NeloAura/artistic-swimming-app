import './App.css';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react'
//import components here
import Navigation from './Components/Navigation';   
import LoginComp from './Components/Login';
import GradeComp from './Components/Grade';
import AssignEventComp from './Components/AssignEvent';

function App() {
  return (
    <ChakraProvider>
    

      <nav>
      <Navigation/> 
      </nav>
     
    <LoginComp/>
    <GradeComp/>
    <AssignEventComp/>
     
    
    </ChakraProvider>
  )
}

export default App;
