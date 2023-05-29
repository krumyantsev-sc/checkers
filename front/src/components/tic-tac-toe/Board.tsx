import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useModal} from "../Modal/ModalContext";
import TttCell from "../tic-tac-toe/tttCell";
import socket from "../../API/socket";
import TicTacToeService from "../../API/Tic-Tac-ToeService";
import "../../styles/Tic-Tac-Toe.css"

const Board = () => {
    const [gameBoard, setGameBoard] = useState<string[][]>([[], [], []]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>([[], [], []]);
    let {gameId} = useParams();
    const [canMove, setCanMove] = useState<boolean>(false);
    const {showModal} = useModal();
    const navigate = useNavigate();

    async function fetchBoardFromServer() {
        try {
            const res = await TicTacToeService.getBoardFromServer(gameId!);
            const serverBoard = await res.data;
            if (serverBoard) {
                setGameBoard(serverBoard);
            }
        } catch (error) {
            console.error('Ошибка при получении поля:', error);
        }
    }

    useEffect(() => {
        fetchBoardFromServer()
            .then(generateCells)
    }, []);
    useEffect(() => {
        generateCells();
    }, [gameBoard]);

    const generateCells = () => {
        const boardRows: JSX.Element[][] = [];
        for (let i = 0; i < 3; i++) {
            const boardRow: JSX.Element[] = [];
            for (let j = 0; j < 3; j++) {
                console.log(gameBoard[i][j])
                boardRow.push(<TttCell
                    coords={{i: i, j: j}}
                    symbol={gameBoard[i][j] || ""}
                    canMove={canMove}
                    setCanMove={setCanMove}/>);
            }
            boardRows.push(boardRow);
        }
        setBoardArr(boardRows);
    }

    useEffect(() => {
        socket.connect();
        const updateBoard = (data: { board: string[][] }) => {
            setGameBoard(() => {
                return data.board
            })
        }

        const finishGame = (data: { message: string }) => {
            showModal(data.message);
            setTimeout(() => {
                navigate('/games')
            }, 2000);
        }

        const giveListeners = () => {
            setCanMove(true);
        }

        socket.on('tttGiveListeners', giveListeners);
        socket.on('tttBoardUpdated', updateBoard);
        socket.on('gameFinished', finishGame);

        return () => {
            socket.off('tttBoardUpdated', updateBoard);
            socket.off('tttGameFinished', finishGame);
            socket.off('tttGiveListeners', giveListeners);
            socket.disconnect();
        };
    }, []);

    return (
        <div
            className="ttt-board-container">
            <div
                className="ttt-board">
                {boardArr.map((boardRow, i) =>
                    <div
                        className="ttt-board-row" key={i}>
                        {boardRow.map((cell, j) =>
                            <TttCell
                                key={`${i}-${j}`}
                                symbol={cell.props.symbol}
                                coords={{i, j}}
                                canMove={canMove}
                                setCanMove={setCanMove}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export {}
export default Board;