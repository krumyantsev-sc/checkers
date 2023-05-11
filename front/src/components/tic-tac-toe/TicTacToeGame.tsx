import React, {useEffect} from 'react';
import SideMenu from "../SideMenu";
import {useParams} from "react-router-dom";
import {useModal} from "../Modal/ModalContext";
import socket from "../../API/socket";
import Cell from "../Game/Cell";
import Board from "./Board";

interface GameProps {
    gameId: string;
}

const TicTacToeGame = () => {

    return (
        <div>
            <SideMenu/>
            <div className="tic-tac-toe-page">
                <Board/>
            </div>
        </div>
    );
};

export default TicTacToeGame;