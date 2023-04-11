import React from 'react';
import "./styles/App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Game from "./components/Game";


function App() {
  return (
      <BrowserRouter>
          <Routes>
                  <Route path="/login" element={<Login/>} />
                  <Route path="/game" element={<Game/>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
