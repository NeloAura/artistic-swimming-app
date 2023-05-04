import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom"
//import components here  
import Login from './Components/Login';

import EventCard from './Components/EventCard';




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/event" element={ <Login/> } />
        <Route path="/" element={ <EventCard/> } />
        
      </Routes>
    </div>
  )
}

export default App;
