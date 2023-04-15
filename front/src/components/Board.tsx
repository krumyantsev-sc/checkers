import React, {ReactNode, useEffect, useRef, useState} from 'react';
import "../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../API/CheckerService";
const _ = require("lodash")
import Checker from "./Checker";
import RoomService from "../API/RoomService";
import {useParams} from "react-router-dom";
import socket from "../API/socket";
import {io} from "socket.io-client";

interface GameProps {
    gameId: string;
}

const Board = () => {
    const [checkersBoard, setCheckersBoard] = useState<any[][]>([[],[],[],[],[],[],[],[]]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>( [[],[],[],[],[],[],[],[]]);
    const [highlightPositions, setHighlightPositions] = useState<any[]>([]);
    let [initPos,setInitPosition] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();
    const initRef = useRef(initPos);

    const setInitPos = (position: any) => {
        setInitPosition(position);
    }

    const setHighlightPos = (positionArr: any) => {
        setHighlightPositions(positionArr);
    }



    const moveChecker = (to: any) => {
        console.log(initPos);
        console.log("toot",to)
        if(_.findIndex(highlightPositions,to) !== -1) {
            let newArr = [...checkersBoard];
            const from: any = initPos;
            newArr[to.i][to.j] = newArr[from.i][from.j];
            newArr[from.i][from.j] = null;
            setCheckersBoard(newArr);
            CheckerService.moveChecker(gameId, {fromI: from.i, fromJ: from.j, toI: to.i, toJ: to.j}).then(r => console.log(r.data))
        }
    }

    async function fetchBoardFromServer() {
        try {
            const res = await CheckerService.getBoardFromServer(gameId);
            const serverBoard = await res.data;
            if (serverBoard) {
                setCheckersBoard(serverBoard);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Ошибка при получении поля:', error);
           // navigate('/');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
          fetchBoardFromServer();
    }, []);

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

        socket.connect();
        socket.on('checkerMoved', (data: any) => {
            initPos = {i: data.fromI, j: data.fromJ};
            console.log("moved")
            console.log(data);
            setInitPos({i: data.fromI, j: data.fromJ});
            moveChecker({i: data.toI, j: data.toJ});
        });
        return () => {
            socket.disconnect();
        };
    }, []);

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