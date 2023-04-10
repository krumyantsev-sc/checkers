import React, {ReactNode, useEffect, useState} from 'react';
import "../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../API/CheckerService";
const _ = require("lodash")
import Checker from "./Checker";



const Board = () => {
    const [checkersBoard, setCheckersBoard] = useState<any[][]>([[],[],[],[],[],[],[],[]]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>( [[],[],[],[],[],[],[],[]]);
    const [highlightPositions, setHighlightPositions] = useState<any[]>([]);
    const [initPos,setInitPosition] = useState<any>();

    const setInitPos = (position: any) => {
        setInitPosition(position);
    }

    const setHighlightPos = (positionArr: any) => {
        setHighlightPositions(positionArr);
    }

    const moveChecker = (to: any) => {
        console.log(checkersBoard);
        let newArr = [...checkersBoard];
        const from: any = initPos;
        newArr[to.i][to.j] = newArr[from.i][from.j];
        newArr[from.i][from.j] = null;
        setCheckersBoard(newArr);
    }

    useEffect(() => {
        const fetchBoardFromServer = async () => {
            const res = await CheckerService.getBoardFromServer();
            const serverBoard = await res.data;
            setCheckersBoard(serverBoard);
        };
        fetchBoardFromServer();
    },[]);

    const compare = (arr:any,obj: any) => {
        for (let i = 0; i < arr.length; i++) {
            if (_.isEqual(highlightPositions[i], obj)) {
                return true;
            }
        }
        return false;
    }
    const generateComponents = () => {
        const boardRows: JSX.Element[][] = [];
        for (let i = 0; i < 8; i++) {
            const boardRow = [];
            for (let j = 0; j < 8; j++) {
                let cellColor = ((i + j) % 2 === 0 ? "light-cell" : "dark-cell");
                if (highlightPositions.length > 0 && compare(highlightPositions,{i:i,j:j})) {
                    cellColor = "highlighted";
                }
                boardRow.push(<Cell color={cellColor} checker={checkersBoard[i][j]} coords={{i: i, j: j}}
                                    moveChecker={moveChecker} setInitPos={setInitPos}/>);
            }
            boardRows.push(boardRow);
        }
        setBoardArr(boardRows);
    }

    useEffect(() => {
        generateComponents();
    }, [checkersBoard]);

    useEffect(() => {
        generateComponents();
    },[highlightPositions]);



    return (
        <div className="board-container">
            <div className="board">
                {boardArr.map((boardRow, i) =>
                    <div className="board-row" key={i}>
                        {boardRow.map((cell, j) =>
                            <Cell key={`${i}-${j}`} color={cell.props.color} checker={cell.props.checker} coords={{i, j}} moveChecker={moveChecker} setInitPos={setInitPos} setHighlightedPos={setHighlightPos} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;