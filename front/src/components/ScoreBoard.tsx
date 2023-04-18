import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import RoomService from "../API/RoomService";
import CheckerService from "../API/CheckerService";
import whiteCheckerImg from "../assets/img/Pawn.png"
import blackCheckerImg from "../assets/img/PawnBlack.png"
import "../styles/Board.css"
import socket from "../API/socket";

interface GameProps {
    gameName: string;
}

interface RoomProps {
    lobbyId: string;
}

const ScoreBoard = () => {
    let { gameName } : any = useParams<Record<keyof GameProps, string>>();
    let { gameId } : any = useParams<Record<keyof RoomProps, string>>();
    let gameHeader: string | undefined = gameName.toUpperCase();
    const [gameInfo, setGameInfo] = useState<any>(null);
    const [firstPlayerScore, setFirstPlayerScore] = useState(0);
    const [secondPlayerScore, setSecondPlayerScore] = useState(0);
    const [currentMoveColor, setCurrentMoveColor] = useState("none");

    async function getGameInfoFromServer() {
        try {
            const response = await CheckerService.getGameInfo(gameId);
            const data = await response.data;
            if (data) {
                setGameInfo(data);
                setFirstPlayerScore(data.firstPlayer.score);
                setSecondPlayerScore(data.secondPlayer.score);
            }
            const colorPromise = await CheckerService.getMoveStatus(gameId);
            const currentColor = await colorPromise.data;
            if (currentColor) {
                setCurrentMoveColor(currentColor.color);
            }
        } catch (error) {
            console.error('Ошибка при получении комнат:', error);
           // navigate('/');
        }
    }
    useEffect(() => {
        getGameInfoFromServer();
    }, []);

    useEffect(() => {
        socket.connect();
        const refreshScore = (data: any) => {
            setFirstPlayerScore(data.firstPlayerScore);
            setSecondPlayerScore(data.secondPlayerScore);
        }

        const changeColor = (data: {color: string}) => {
            setCurrentMoveColor(data.color);
        }
        socket.on('switchTeam', changeColor);
        socket.on('refreshScore', refreshScore);
        return () => {
            socket.off('giveListeners', changeColor);
            socket.off('refreshScore', refreshScore);
            socket.disconnect();
        };
    }, []);

    return (
        <div className="scoreboard-container">
            {gameInfo && (
                <>
                    <div className="game-player-container">
                        <div className="checker-name-container">
                            <img
                                src={whiteCheckerImg}
                                alt="whiteChecker"
                                style={currentMoveColor === "White" ? {border: "1px solid white"} : {border: "none"}}
                            />
                            <span className="game-player-name">{gameInfo.firstPlayer.name}</span>
                        </div>
                        <span className="first-player-score">{firstPlayerScore}</span>
                    </div>
                    <div className="game-player-container">
                        <div className="checker-name-container">
                            <img
                                src={blackCheckerImg}
                                alt="blackChecker"
                                style={currentMoveColor === "Black" ? {border: "1px solid white"} : {border: "none"}}
                            />
                            <span className="game-player-name">{gameInfo.secondPlayer.name}</span>
                        </div>
                        <span className="second-player-score">{secondPlayerScore}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default ScoreBoard;