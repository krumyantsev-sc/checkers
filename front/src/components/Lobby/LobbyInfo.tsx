import React, {useEffect, useState} from 'react';
import PlayerInfo from "./PlayerInfo";
import "../../styles/Lobby.css"
import socket from "../../API/socket";
import {useLocation, useNavigate} from "react-router-dom";
import CheckerService from "../../API/CheckerService";
interface IPlayer {
    username: string,
    firstName: string,
    lastName: string,
    statistics: {wins: number, loses: number},
    avatar: string
}
interface RoomsProps {
    firstPlayer: IPlayer;
    secondPlayer: IPlayer;
    lobbyId: number;
}

const LobbyInfo: React.FC<RoomsProps> = ({ firstPlayer, secondPlayer, lobbyId }) => {
    const [isReady,setIsReady] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (firstPlayer.username && secondPlayer.username) {
            setIsReady(true);
        }
        socket.connect();
        socket.on('updateLobbyData', (data) => {
            setIsReady(true);
        });
        socket.on('makeBtnActive', () => {
            console.log('Active');
            console.log(isReady);
            setIsReady(true);
            console.log(isReady);
        })

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <div className="room-info">
            <PlayerInfo
                username={firstPlayer.username || "no player"}
                firstName={firstPlayer.firstName || " "}
                lastName={firstPlayer.lastName || " "}
                statistics={firstPlayer.statistics || {}}
                avatar={firstPlayer.avatar || ""}
            />
            <div className="game-info">
                <span>GAME ID</span>
                <span className="gameId">{lobbyId}</span>
                {isReady && <div
                    className="play-button-lobby"
                    onClick={() => {
                        CheckerService.initializeGame(lobbyId.toString())
                            .then(() => {
                                navigate(`${location.pathname}/game`)})
                            }
                    }
                >PLAY</div>}
            </div>
            <PlayerInfo
                username={secondPlayer.username || "no player"}
                firstName={secondPlayer.firstName || "Waiting"}
                lastName={secondPlayer.lastName || "for opponent"}
                statistics={secondPlayer.statistics}
                avatar={secondPlayer.avatar || ""}
            />
        </div>
    );
};

export default LobbyInfo;