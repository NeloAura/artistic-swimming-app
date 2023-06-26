import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
// Import components here
import Login from './Components/Login';
import JudgeCard from './Components/JudgeCard';
import ParticipantCard from './Components/ParticipantCard';
import Dashboard from './Components/Dashboard';
import ClubCard from './Components/ClubCard';
import EventsCard from './Components/EventCard';
import GeneratedNumberCard from './Components/GeneratedNumberCard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/judge" element={<JudgeCard />} />
        <Route path="/participant" element={<ParticipantCard />} />
        <Route path="/club" element={<ClubCard />} />
        <Route path="/events/:competitionID" element={<EventsCard />} />
        <Route path="/participant-on-event/:combinedParams" element={<EventsCard />} />
        <Route path="/generated" element={<GeneratedNumberCard />} />
      </Routes>
    </div>
  );
}

export default App;
