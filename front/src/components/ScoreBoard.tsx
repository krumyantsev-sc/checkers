import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import RoomService from "../API/RoomService";
import CheckerService from "../API/CheckerService";
import whiteCheckerImg from "../assets/img/Pawn.png"
import blackCheckerImg from "../assets/img/PawnBlack.png"
import "../styles/Board.css"

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

    async function getGameInfoFromServer() {
        try {
            const response = await CheckerService.getGameInfo(gameId);
            const data = await response.data;
            console.log(data);
            if (data) {
                setGameInfo(data);
                setFirstPlayerScore(data.firstPlayer.score);
                setSecondPlayerScore(data.secondPlayer.score);
            }
        } catch (error) {
            console.error('Ошибка при получении комнат:', error);
           // navigate('/');
        }
    }
    useEffect(() => {
        getGameInfoFromServer();
    }, []);

    return (
        <div className="scoreboard-container">
            {gameInfo && (
                <>
                    <div className="game-player-container">
                        <div className="checker-name-container">
                            <img src={whiteCheckerImg} alt="whiteChecker"/>
                            <span className="game-player-name">{gameInfo.firstPlayer.name}</span>
                        </div>
                        <span className="first-player-score">{firstPlayerScore}</span>
                    </div>
                    <div className="game-player-container">
                        <div className="checker-name-container">
                            <img src={blackCheckerImg} alt="blackChecker"/>
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