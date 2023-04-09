import React, {ReactNode, useEffect, useState} from 'react';
import "../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../API/CheckerService";



const Board = () => {
    const [serverBoard, setServerBoard] = useState([]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>( [[],[],[],[],[],[],[],[]]);
    let initPos: any;

    const setInitPos = (position: any) => {
        initPos = position;
    }

    const moveChecker = (to: any) => {
        let from: any = initPos;
        const newBoardArr = [...boardArr]; // создаем копию массива
        newBoardArr[to.i][to.j] = newBoardArr[from.i][from.j];
        newBoardArr[from.i][from.j] = <Cell color="dark-cell" />;
        setBoardArr(newBoardArr);
    }

    useEffect(() => {
        const fetchBoardFromServer = async () => {
            const res = await CheckerService.getBoardFromServer();
            const serverBoard = await res.data;
            const boardRows: JSX.Element[][] = [];
            for (let i = 0; i < 8; i++) {
                const boardRow = [];
                for (let j = 0; j < 8; j++) {
                    let cellColor = ((i + j) % 2 === 0 ? "light-cell" : "dark-cell");
                    boardRow.push(<Cell color={cellColor} checker={serverBoard[i][j]} coords={{i:i,j:j}} moveChecker={moveChecker} setInitPos={setInitPos} />);
                }
                boardRows.push(boardRow);
            }
            setBoardArr(boardRows);
        };
        fetchBoardFromServer();
    },[]);

    return (
        <div className="board-container">
            <div className="board">
                {boardArr.map((boardRow, i) =>
                    <div className="board-row" key={i}>
                        {boardRow.map((cell, j) =>
                            <Cell key={`${i}-${j}`} color={cell.props.color} checker={cell.props.checker} coords={{i, j}} moveChecker={moveChecker} setInitPos={setInitPos} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;