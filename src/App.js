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
import ParticipantOnEventCard from './Components/ParticipantOnEventCard';
import ClubScoreBoard from './Components/ClubScoreBoard';
import ParticipantScoreBoard from './Components/ParticipantScoreBoard'
import GroupScoreBoard from './Components/GroupScoreBoard';
import JudgeScoreBoard from './Components/JudgeScoreBoard';
import ParticipantScoreTable from './Components/ParticipantScoreTable';

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
        <Route path="/participant-on-event/:combinedParams" element={<ParticipantOnEventCard />} />
        <Route path="/generated" element={<GeneratedNumberCard />} />
        <Route path="/clubboard" element={<ClubScoreBoard/>} exact/>
        <Route path="/participantboard" element={<ParticipantScoreBoard/>} exact />
        <Route path="/groupboard" element={<GroupScoreBoard/>} exact />
        <Route path="/editscore" element={<ParticipantScoreTable/>} exact />
        <Route path="/judgeboard" element={<JudgeScoreBoard/>} exact />
      </Routes>
    </div>
  );
}

export default App;
