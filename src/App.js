import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom"
//import components here  
import Login from './Components/Login';
import JudgeCard from './Components/JudgeCard';
import ParticipantCard from './Components/ParticipantCard';
import Dashboard from './Components/Dashboard';
import ClubCard from './Components/ClubCard';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="/dashboard" element={ <Dashboard/> } />
        <Route path="/judge" element={ <JudgeCard/> } />
        <Route path="/participant" element={ <ParticipantCard/> } />
        <Route path="/club" element={ <ClubCard/> } />
      </Routes>
    </div>
  )
}

export default App;
