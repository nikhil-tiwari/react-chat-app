import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Lobby from "./pages/lobby/lobby";
import Room from "./pages/room/room";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Lobby />}/>
      <Route path="/room/:roomCode" element={<Room />}/>
    </Routes>
  )
}

export default App;