import React from 'react';
import SideMenu from "../SideMenu";
import {ModalProvider, useModal} from "../Modal/ModalContext";
import Board from "./Board";
import "../../styles/Tic-Tac-Toe.css"
import TicTacToeScoreBoard from "./TicTacToeScoreBoard";
import Chat from "../Game/Chat";

const TicTacToeGame = () => {

    return (
        <ModalProvider>
            <div>
                <SideMenu/>
                <div
                    className="tic-tac-toe-page">
                    <Chat/>
                    <Board/>
                    <TicTacToeScoreBoard/>
                </div>
            </div>
        </ModalProvider>
    );
};

export default TicTacToeGame;