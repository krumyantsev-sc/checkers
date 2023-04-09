import React from 'react';
import Board from "./components/Board";
import "./styles/App.css"
import SideMenu from "./components/SideMenu";


function App() {
  return (
    <div className="App">
        <SideMenu/>
        <Board/>
    </div>
  );
}

export default App;
