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
        <Route path="/" element={ <Login/> } />
        <Route path="/event" element={ <EventCard/> } />
        
      </Routes>
    </div>
  )
}

export default App;
