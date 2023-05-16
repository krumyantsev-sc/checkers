import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useModal} from "../Modal/ModalContext";
import TttCell from "../tic-tac-toe/tttCell";
import socket from "../../API/socket";
import CheckerService from "../../API/CheckerService";
import TicTacToeService from "../../API/Tic-Tac-ToeService";
import "../../styles/Tic-Tac-Toe.css"

interface GameProps {
    gameId: string;
}

const Board = () => {
    const [gameBoard, setGameBoard] = useState<any[][]>([[],[],[]]);
    const [boardArr, setBoardArr] = useState<JSX.Element[][]>( [[],[],[]]);
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();
    const { showModal, closeModal } = useModal();

    async function fetchBoardFromServer() {
        try {
            const res = await TicTacToeService.getBoardFromServer(gameId);
            const serverBoard = await res.data;
            if (serverBoard) {
                console.log(serverBoard)
                setGameBoard(serverBoard);
                console.log(gameBoard)
            }
        } catch (error) {
            console.error('Ошибка при получении поля:', error);
            // navigate('/');
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
                boardRow.push(<TttCell coords={{i: i, j: j}} symbol={gameBoard[i][j] || ""}/>);
            }
            boardRows.push(boardRow);
        }
        setBoardArr(boardRows);
    }
    useEffect(() => {
        socket.connect();

        const updateBoard = (data: any) => {
            setGameBoard((gameBoard: any) => {
                    return data.board
            })
        }

        const finishGame = (data: {message: string}) => {
            showModal(data.message);
        }

        socket.on('tttBoardUpdated', updateBoard);
        socket.on('tttGameFinished', finishGame);

        return () => {
            socket.off('tttBoardUpdated', updateBoard);
            socket.off('tttGameFinished', finishGame);
            socket.disconnect();
        };
    }, []);

    return (
        <div className="ttt-board-container">
            <div className="ttt-board">
                {boardArr.map((boardRow, i) =>
                    <div className="ttt-board-row" key={i}>
                        {boardRow.map((cell, j) =>
                            <TttCell key={`${i}-${j}`}
                                  symbol={cell.props.symbol}
                                  coords={{i, j}}
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