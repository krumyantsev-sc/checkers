import React, {useEffect, useState} from 'react';
import "../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../API/CheckerService";



const Board = () => {
    const [serverBoard, setServerBoard] = useState([]);
    const [boardArr, setBoardArr] = useState<JSX.Element[]>( []);
    useEffect(() => {
        const fetchBoardFromServer = async () => {
            const res = await CheckerService.getBoardFromServer();
            const serverBoard = await res.data;
            const boardRows: JSX.Element[] = [];
            for (let i = 0; i < 8; i++) {
                const boardRow = [];
                for (let j = 0; j < 8; j++) {
                    let cellColor = ((i + j) % 2 === 0 ? "light-cell" : "dark-cell");
                    boardRow.push(<Cell color={cellColor} checker={serverBoard[i][j]} />);
                }
                boardRows.push(<div className="board-row">{boardRow}</div>);
            }
            setBoardArr(boardRows);
        };

        fetchBoardFromServer();


    },[]);




    return (
        <div className="board-container">
            <div className="board">{boardArr}</div>
        </div>
    );
};

export default Board;