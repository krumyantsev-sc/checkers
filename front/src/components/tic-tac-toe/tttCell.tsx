import React, {Dispatch, SetStateAction} from 'react';
import "../../styles/Tic-Tac-Toe.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faX, faO} from '@fortawesome/free-solid-svg-icons';
import {useParams} from "react-router-dom";
import TicTacToeService from "../../API/Tic-Tac-ToeService";

interface TicTacToeCellProps {
    coords: {i: number, j: number};
    symbol: string;
    canMove: boolean;
    setCanMove: Dispatch<SetStateAction<boolean>>;
}

interface GameProps {
    gameId: string;
}

const TttCell: React.FC<TicTacToeCellProps> = ({symbol,coords, canMove, setCanMove}) => {
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();

    const makeMove = () => {
        TicTacToeService.makeMove(gameId.toString(), coords)
            .then(() => {setCanMove(false)});
    }

    return (
        <div className="ttt-board-cell"
             style={canMove ? {cursor: "pointer"} : {}}
        onClick={(symbol === "" && canMove) ? () => {makeMove()} : () => {}}>
            {symbol !== "" && (symbol === "0" ? <FontAwesomeIcon icon={faO} size="xl" style={{color: "#3ed2f0",}}/> :<FontAwesomeIcon icon={faX} size="xl" style={{color: "lightsalmon",}}/>)}
        </div>
    );
};

export default TttCell;