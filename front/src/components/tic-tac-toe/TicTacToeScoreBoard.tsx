import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import TicTacToeService from "../../API/Tic-Tac-ToeService";
import "../../styles/Tic-Tac-Toe.css"
import {Avatar} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faO, faX} from "@fortawesome/free-solid-svg-icons";
import socket from "../../API/socket";
import Timer from "../Timer";

interface IPlayer {
    firstPlayer: {
        name: string;
        avatar: string;
    }
    secondPlayer:  {
        name: string;
        avatar: string;
    }
    gameId: string;
}

const TicTacToeScoreBoard = () => {
    let { gameId } = useParams();
    const [gameInfo, setGameInfo] = useState<IPlayer | null>(null);
    const [currentMoveSymbol, setCurrentMoveSymbol] = useState("none");
    const [displayTimer, setDisplayTimer] = useState(false);

    async function getGameInfoFromServer() {
        try {
            const response = await TicTacToeService.getGameInfo(gameId!);
            const data = await response.data;
            if (data) {
                setGameInfo(data);
            }
        } catch (error) {
            console.error('Ошибка при получении комнат:', error);
        }
    }

    useEffect(() => {
        socket.connect();

        const changeSymbol = (data: {symbol: string}) => {
            setCurrentMoveSymbol(data.symbol);
        }

        const displayTimer = () => {
            setDisplayTimer(true);
        }

        const stopDisplayTimer = () => {
            setDisplayTimer(false);
        }

        socket.on('enemyReconnected', stopDisplayTimer);
        socket.on('syncTime', displayTimer);
        socket.on('changeSymbol', changeSymbol);
        return () => {
            socket.off('enemyReconnected', stopDisplayTimer);
            socket.off('syncTime', displayTimer);
            socket.off('changeSymbol', changeSymbol);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        getGameInfoFromServer();
    }, []);

    return (
        <div
            className="ttt-scoreboard-container">
            {gameInfo && (
                <>
                    <div
                        className="game-player-container">
                        <div
                            className="symbol-name-container"
                            style={currentMoveSymbol === "X" ? {border: "1px solid #3ed2f0"} : {}}>
                            <Avatar
                                sx={{ width: 100, height: 100,  objectFit: 'cover', borderRadius: '50%', border: "1px solid lightsalmon"}}
                                alt="Avatar"
                                src={`http://localhost:3001/static/avatar/${gameInfo.firstPlayer.avatar}`}/>
                            <span
                                className="ttt-game-player-name">
                                {gameInfo.firstPlayer.name}
                            </span>
                            <FontAwesomeIcon
                                icon={faX}
                                size="xl"
                                style={{color: "lightsalmon",}}
                            />
                        </div>
                    </div>
                    <div
                        className="game-player-container">
                        <div
                            className="symbol-name-container"
                            style={currentMoveSymbol === "0" ? {border: "1px solid #3ed2f0"} : {}}>
                            <Avatar
                                sx={{ width: 100, height: 100,  objectFit: 'cover', borderRadius: '50%', border: "1px solid lightsalmon"}}
                                alt="Avatar"
                                src={`http://localhost:3001/static/avatar/${gameInfo.secondPlayer.avatar}`}
                            />
                            <span
                                className="ttt-game-player-name">
                                {gameInfo.secondPlayer.name}
                            </span>
                            <FontAwesomeIcon
                                icon={faO}
                                size="xl"
                                style={{color: "#3ed2f0",}}
                            />
                        </div>
                    </div>
                    {displayTimer && <Timer/>}
                </>
            )}
        </div>
    );
};

export default TicTacToeScoreBoard;