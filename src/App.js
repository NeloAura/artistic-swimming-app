import './App.css';
import React from 'react';
import { ChakraProvider} from '@chakra-ui/react'
//import components here
import Navigation from './Components/Navigation';   
import LoginComp from './Components/Login';
import GradeComp from './Components/Grade';
import AssignEventComp from './Components/AssignEvent';
import EventCard from './Components/EventCard';
import { QRCodeGenerator } from './Components/QRCodeGenerator';



function App() {
  return (
    <ChakraProvider>
    

      <nav>
      <Navigation/> 
      </nav>
     
    <LoginComp/>
    <GradeComp/>
    <AssignEventComp/>
    <EventCard/>
    <QRCodeGenerator ssid="Aura" password="notinpan10" />
    </ChakraProvider>
  )
}

export default App;
