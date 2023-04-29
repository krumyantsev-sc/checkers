import React from 'react';
import SideMenu from "../SideMenu";
import Board from "./Board";
import Chat from "./Chat"
import ScoreBoard from "./ScoreBoard";
import { ModalProvider } from '../Modal/ModalContext';

const Game = () => {
    return (
        <ModalProvider>
            <div className="game-page">
                <SideMenu/>
                <Chat/>
                <Board/>
                <ScoreBoard/>
            </div>
        </ModalProvider>
    );
};
export default Game;
