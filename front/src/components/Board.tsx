import React, {ReactNode, useEffect, useState} from 'react';
import "../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../API/CheckerService";
import Checker from "./Checker";



const Board = () => {
    const [serverBoard, setServerBoard] = useState([]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>( [[],[],[],[],[],[],[],[]]);
    let initPos: any;

    const setInitPos = (position: any) => {
        initPos = position;
    }

    const moveChecker = (to: any) => {
        console.log("moveChecker")
        const from: any = initPos;
        const fromCell = boardArr[from.i][from.j];
        console.log(fromCell)
        const toCell = boardArr[to.i][to.j];
        const fromChecker = fromCell.props.children && fromCell.props.children.type === Checker ? fromCell.props.children : null;
        //const newChecker = React.cloneElement(fromChecker, {coords: {i: to.i, j: to.j}});
        console.log(fromCell.props.children)
        //console.log(newChecker)
        // Создаем новую ячейку с новым элементом checker
        //const newToCell = React.cloneElement(toCell, {checker: newChecker});

        // Создаем новую ячейку на исходной позиции без элемента checker
        const newFromCell = React.cloneElement(fromCell, {checker: null});

        // Создаем новый массив, заменяя старые ячейки на новые
        // const newBoardArr = boardArr.map((boardRow, i) =>
        //     boardRow.map((cell, j) =>
        //         (i === to.i && j === to.j) ? newToCell :
        //             (i === from.i && j === from.j) ? newFromCell : cell
        //     )
        // );

        //setBoardArr(newBoardArr);
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