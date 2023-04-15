import React from 'react';
import SideMenu from "./SideMenu";
import Board from "./Board";
import ScoreBoard from "./ScoreBoard";

const Game = () => {
    return (
        <div className="game-page">
            <SideMenu/>
            <Board/>
            <ScoreBoard/>
        </div>
    );
};
export default Game;
