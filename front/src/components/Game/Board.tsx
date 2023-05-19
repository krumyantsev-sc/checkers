import React, {ReactNode, useEffect, useRef, useState} from 'react';
import "../../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../../API/CheckerService";
const _ = require("lodash")
import Checker from "./Checker";
import RoomService from "../../API/RoomService";
import {useNavigate, useParams} from "react-router-dom";
import socket from "../../API/socket";
import {io} from "socket.io-client";
import {useModal} from "../Modal/ModalContext";


interface GameProps {
    gameId: string;
}

const Board = () => {
    const [checkersBoard, setCheckersBoard] = useState<any[][]>([[],[],[],[],[],[],[],[]]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>( [[],[],[],[],[],[],[],[]]);
    const [highlightPositions, setHighlightPositions] = useState<any[]>([]);
    const [draggableColor, setDraggableColor] = useState<string>("none");
    let [initPos,setInitPosition] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();
    const { showModal, closeModal } = useModal();
    const navigate = useNavigate();

    const setInitPos = (position: any) => {
        setInitPosition(position);
    }

    const setHighlightPos = (positionArr: any) => {
        setHighlightPositions(positionArr);
    }

    const updateBoard = (currentBoard:any, to: any) => {
        let newArr = [...currentBoard];
        const from: any = initPos;
        newArr[to.i][to.j] = newArr[from.i][from.j];
        newArr[from.i][from.j] = null;
        return newArr;
    }

    const removeChecker = (currentBoard: any, checker: {i: number,j: number, color: string}) => {
        let newArr = [...currentBoard];
        newArr[checker.i][checker.j] = null;
        return newArr;
    }

    const makeCheckerLady = (currentBoard: any, checker: {i: number,j: number}) => {
        let newArr = [...currentBoard];
        newArr[checker.i][checker.j].isLady = true;
        return newArr;
    }

    const moveChecker = (to: any) => {
        if(_.findIndex(highlightPositions,to) !== -1) {
            console.log(checkersBoard)
            const from: any = initPos;
            setCheckersBoard(updateBoard(checkersBoard,to));
            CheckerService.moveChecker(gameId, {fromI: from.i, fromJ: from.j, toI: to.i, toJ: to.j}).then(r => {
                if (r.data.length > 0) {
                    CheckerService.getPositionsForHighlighting(gameId, to).then((res) => {
                        setHighlightPos(res.data);
                    });
                } else {
                    setDraggableColor("none");
                }
            });
        }
    }

    async function fetchBoardFromServer() {
        try {
            const res = await CheckerService.getBoardFromServer(gameId);
            const serverBoard = await res.data;
            if (serverBoard) {
                setCheckersBoard(serverBoard);
            }
            const colorPromise = await CheckerService.getMoveStatus(gameId);
            const currentColor = await colorPromise.data;
            if (currentColor) {
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

        const updateBoardFromServer = (data: any) => {
            initPos = {i: data.fromI, j: data.fromJ};
            setCheckersBoard((checkersBoard:any) => {
                if (checkersBoard[data.fromI][data.fromJ] !== null) {
                    return updateBoard(checkersBoard,{i: data.toI, j: data.toJ})
                }
                return checkersBoard;
            })
        }

        const removeCheckerByEvent = (data: any) => {
            setCheckersBoard((checkersBoard:any) => {
                if (checkersBoard[data.i][data.j] !== null) {
                    return removeChecker(checkersBoard, data);
                }
                return checkersBoard;
            })
        }

        const changeDragColor = (data: {color: string}) => {
            setDraggableColor(data.color);
            console.log(data.color);
        }

        const finishGame = (data: {message: string}) => {
            showModal(data.message);
            setTimeout(() => {navigate('/games')}, 2000);
        }

        const makeLady = (coords: {i: number, j: number}) => {
            setCheckersBoard((checkersBoard:any) => {
                if (!checkersBoard[coords.i][coords.j].isLady) {
                    return makeCheckerLady(checkersBoard, coords);
                }
                return checkersBoard;
            })
        }
        socket.on('makeLady', makeLady);
        socket.on('gameFinished', finishGame);
        socket.on('giveListeners', changeDragColor);
        socket.on('checkerMoved', updateBoardFromServer);
        socket.on('removeChecker', removeCheckerByEvent);
        return () => {
            socket.off('makeLady', makeLady);
            socket.off('gameFinished', finishGame);
            socket.off('giveListeners', changeDragColor);
            socket.off('checkerMoved', updateBoardFromServer);
            socket.off('removeChecker', removeCheckerByEvent);
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
                            <Cell key={`${i}-${j}`}
                                  color={cell.props.color}
                                  checker={cell.props.checker}
                                  coords={{i, j}}
                                  moveChecker={moveChecker}
                                  setInitPos={setInitPos}
                                  setHighlightedPos={setHighlightPos}
                                  moveColor={draggableColor}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;