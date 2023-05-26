import React, {useEffect, useState} from 'react';
import "../../styles/Board.css"
import Cell from "./Cell";
import CheckerService from "../../API/CheckerService";
import {useNavigate, useParams} from "react-router-dom";
import socket from "../../API/socket";
import {useModal} from "../Modal/ModalContext";
import {checker, checkerCoords, checkerCoordsWithColor, moveCoords} from "./types/checkersTypes";

const _ = require("lodash")

const Board = () => {
    const [checkersBoard, setCheckersBoard] = useState<(checker | null)[][]>([[], [], [], [], [], [], [], []]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>([[], [], [], [], [], [], [], []]);
    const [highlightPositions, setHighlightPositions] = useState<checkerCoords[]>([]);
    const [draggableColor, setDraggableColor] = useState<string>("none");
    let [initPos, setInitPosition] = useState<checkerCoords>();
    const {gameId} = useParams();
    const {showModal} = useModal();
    const navigate = useNavigate();

    const setInitPos = (position: checkerCoords) => {
        setInitPosition(position);
    }

    const setHighlightPos = (positionArr: checkerCoords[]) => {
        setHighlightPositions(positionArr);
    }

    const updateBoard = (currentBoard: (checker | null)[][], to: checkerCoords) => {
        let newArr = [...currentBoard];
        const from: checkerCoords = initPos!;
        newArr[to.i][to.j] = newArr[from.i][from.j];
        newArr[from.i][from.j] = null;
        return newArr;
    }

    const removeChecker = (currentBoard: (checker | null)[][], checker: checkerCoords) => {
        let newArr = [...currentBoard];
        newArr[checker.i][checker.j] = null;
        return newArr;
    }

    const makeCheckerLady = (currentBoard: (checker | null)[][], checkerObj: checkerCoords) => {
        let newArr = [...currentBoard];
        let checker = newArr[checkerObj.i][checkerObj.j];
        if (checker !== null) {
            checker.isLady = true;
        }
        newArr[checkerObj.i][checkerObj.j] = checker;
        return newArr;
    }

    const moveChecker = (to: checkerCoords) => {
        if (_.findIndex(highlightPositions, to) !== -1) {
            const from: checkerCoords = initPos!;
            setCheckersBoard(updateBoard(checkersBoard, to));
            CheckerService.moveChecker(gameId!, {fromI: from.i, fromJ: from.j, toI: to.i, toJ: to.j})
                .then(r => {
                    if (r.data.length > 0) {
                        CheckerService.getPositionsForHighlighting(gameId!, to).then((res) => {
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
            const res = await CheckerService.getBoardFromServer(gameId!);
            const serverBoard = await res.data;
            if (serverBoard) {
                setCheckersBoard(serverBoard);
            }
        } catch (error) {
            console.error('Ошибка при получении поля:', error);
        }
    }

    useEffect(() => {
        fetchBoardFromServer();
    }, []);

    const compare = (arr: checkerCoords[], obj: checkerCoords) => {
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
                if (highlightPositions.length > 0 && compare(highlightPositions, {i: i, j: j})) {
                    cellColor = "highlighted";
                }
                boardRow.push(
                    <Cell
                        color={cellColor}
                        checker={checkersBoard[i][j]}
                        coords={{i: i, j: j}}
                        moveChecker={moveChecker}
                        setInitPos={setInitPos}/>);
            }
            boardRows.push(boardRow);
        }
        setBoardArr(boardRows);
    }

    useEffect(() => {
        socket.connect();

        const updateBoardFromServer = (data: moveCoords) => {
            initPos = {i: data.fromI, j: data.fromJ};
            setCheckersBoard((checkersBoard) => {
                if (checkersBoard[data.fromI][data.fromJ] !== null) {
                    return updateBoard(checkersBoard, {i: data.toI, j: data.toJ})
                }
                return checkersBoard;
            })
        }

        const removeCheckerByEvent = (data: checkerCoords) => {
            setCheckersBoard((checkersBoard: any) => {
                if (checkersBoard[data.i][data.j] !== null) {
                    return removeChecker(checkersBoard, data);
                }
                return checkersBoard;
            })
        }

        const changeDragColor = (data: { color: string }) => {
            setDraggableColor(data.color);
        }

        const finishGame = (data: { message: string }) => {
            showModal(data.message);
            setTimeout(() => {
                navigate('/games')
            }, 2000);
        }

        const makeLady = (coords: checkerCoords) => {
            setCheckersBoard((checkersBoard) => {
                if (!checkersBoard[coords.i][coords.j]!.isLady) {
                    return makeCheckerLady(checkersBoard, coords);
                }
                return checkersBoard;
            })
        }

        const enemyDisconnectHandler = () => {
            console.log("Оппонент отключился")
        }

        socket.on('makeLady', makeLady);
        socket.on('gameFinished', finishGame);
        socket.on('giveListeners', changeDragColor);
        socket.on('checkerMoved', updateBoardFromServer);
        socket.on('removeChecker', removeCheckerByEvent);
        socket.on('enemyDisconnected', enemyDisconnectHandler);
        return () => {
            socket.off('makeLady', makeLady);
            socket.off('gameFinished', finishGame);
            socket.off('giveListeners', changeDragColor);
            socket.off('checkerMoved', updateBoardFromServer);
            socket.off('removeChecker', removeCheckerByEvent);
            socket.off('enemyDisconnected', enemyDisconnectHandler);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        generateComponents();
    }, [checkersBoard]);

    useEffect(() => {
        generateComponents();
    }, [highlightPositions]);

    return (
        <div className="board-container">
            <div className="board">
                {boardArr.map((boardRow, i) =>
                    <div className="board-row" key={i}>
                        {boardRow.map((cell, j) =>
                            <Cell
                                key={`${i}-${j}`}
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