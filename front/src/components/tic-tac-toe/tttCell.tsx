import React from 'react';
import "../../styles/Tic-Tac-Toe.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX, faO} from '@fortawesome/free-solid-svg-icons';
import {useParams} from "react-router-dom";
import TicTacToeService from "../../API/Tic-Tac-ToeService";

interface TicTacToeCellProps {
    coords: {i: number, j: number};
    symbol: string;
}

interface GameProps {
    gameId: string;
}

const TttCell: React.FC<TicTacToeCellProps> = ({symbol,coords}) => {
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();
    return (
        <div className="ttt-board-cell"
        onClick={symbol === "" ? () => {TicTacToeService.makeMove(gameId.toString(), coords)} : () => {}}>
            {symbol !== "" && (symbol === "0" ? <FontAwesomeIcon icon={faO} size="xl" style={{color: "#3ed2f0",}}/> :<FontAwesomeIcon icon={faX} size="xl" style={{color: "lightsalmon",}}/>)}
        </div>
    );
};

export default TttCell;