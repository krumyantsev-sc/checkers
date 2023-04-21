import React from 'react';
import SideMenu from "./SideMenu";
import Board from "./Board";
import ScoreBoard from "./ScoreBoard";
import { ModalProvider } from './Modal/ModalContext';

const Game = () => {
    return (
        <ModalProvider>
            <div className="game-page">
                <SideMenu/>
                <Board/>
                <ScoreBoard/>
            </div>
        </ModalProvider>
    );
};
export default Game;
