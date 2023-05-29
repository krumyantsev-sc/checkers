import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import CheckerService from "../../API/CheckerService";
import whiteCheckerImg from "../../assets/img/Pawn.png"
import blackCheckerImg from "../../assets/img/PawnBlack.png"
import "../../styles/Board.css"
import socket from "../../API/socket";
import Timer from "../Timer";

interface IGameInfo {
    firstPlayer: {
        name: string;
        score: number;
    }
    secondPlayer: {
        name: string;
        score: number;
    }
    gameId: string;
}

const ScoreBoard = () => {
    let {gameId} = useParams();
    const [displayTimer, setDisplayTimer] = useState<boolean>(false);
    const [gameInfo, setGameInfo] = useState<IGameInfo | null>(null);
    const [firstPlayerScore, setFirstPlayerScore] = useState<number>(0);
    const [secondPlayerScore, setSecondPlayerScore] = useState<number>(0);
    const [currentMoveColor, setCurrentMoveColor] = useState<string>("none");

    async function getGameInfoFromServer() {
        try {
            const response = await CheckerService.getGameInfo(gameId!);
            const data = await response.data;
            if (data) {
                setGameInfo(data);
                setFirstPlayerScore(data.firstPlayer.score);
                setSecondPlayerScore(data.secondPlayer.score);
            }
            const colorPromise = await CheckerService.getMoveStatus(gameId!);
            const currentColor = await colorPromise.data;
            if (currentColor) {
                setCurrentMoveColor(currentColor.color);
            }
        } catch (error) {
            console.error('Ошибка при получении комнат:', error);
        }
    }

    useEffect(() => {
        getGameInfoFromServer();
    }, []);

    useEffect(() => {
        socket.connect();
        const refreshScore = (data: { firstPlayerScore: number, secondPlayerScore: number }) => {
            setFirstPlayerScore(data.firstPlayerScore);
            setSecondPlayerScore(data.secondPlayerScore);
        }

        const changeColor = (data: { color: string }) => {
            setCurrentMoveColor(data.color);
        }

        const displayTimer = () => {
            setDisplayTimer(true);
        }

        const stopDisplayTimer = () => {
            setDisplayTimer(false);
        }

        socket.on('enemyReconnected', stopDisplayTimer);
        socket.on('syncTime', displayTimer);
        socket.on('switchTeam', changeColor);
        socket.on('refreshScore', refreshScore);
        return () => {
            socket.off('giveListeners', changeColor);
            socket.off('refreshScore', refreshScore);
            socket.off('enemyReconnected', stopDisplayTimer);
            socket.off('syncTime', displayTimer)
            socket.disconnect();
        };
    }, []);

    return (
        <div className="scoreboard-container">
            {gameInfo && (
                <>
                    <div
                        className="game-player-container">
                        <div
                            className="checker-name-container">
                            <img
                                src={whiteCheckerImg}
                                alt="whiteChecker"
                                style={currentMoveColor === "White" ? {
                                    border: "1px solid #2196f3",
                                    borderRadius: "10px"
                                } : {border: "none"}}
                            />
                            <span
                                className="game-player-name">
                                {gameInfo.firstPlayer.name}
                            </span>
                        </div>
                        <span
                            className="first-player-score">
                            {firstPlayerScore}
                        </span>
                    </div>
                    <div
                        className="game-player-container">
                        <div
                            className="checker-name-container">
                            <img
                                src={blackCheckerImg}
                                alt="blackChecker"
                                style={currentMoveColor === "Black" ? {
                                    border: "1px solid #2196f3",
                                    borderRadius: "10px"
                                } : {border: "none"}}
                            />
                            <span
                                className="game-player-name">
                                {gameInfo.secondPlayer.name}
                            </span>
                        </div>
                        <span
                            className="second-player-score">
                            {secondPlayerScore}
                        </span>
                    </div>
                    {displayTimer && <Timer/>}
                </>
            )}
        </div>
    );
};

export default ScoreBoard;