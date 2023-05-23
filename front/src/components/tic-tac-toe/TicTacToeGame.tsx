import React, {useEffect} from 'react';
import SideMenu from "../SideMenu";
import {useParams} from "react-router-dom";
import {ModalProvider, useModal} from "../Modal/ModalContext";
import socket from "../../API/socket";
import Cell from "../Game/Cell";
import Board from "./Board";
import "../../styles/Tic-Tac-Toe.css"
import TicTacToeScoreBoard from "./TicTacToeScoreBoard";
import Chat from "../Game/Chat";

interface GameProps {
    gameId: string;
}

const TicTacToeGame = () => {

    return (
        <ModalProvider>
            <div>
                <SideMenu/>
                <div className="tic-tac-toe-page">
                    <Chat/>
                    <Board/>
                    <TicTacToeScoreBoard/>
                </div>
            </div>
        </ModalProvider>
    );
};

export default TicTacToeGame;