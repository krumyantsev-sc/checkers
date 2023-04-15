import React, {useEffect, useState} from 'react';
import PlayerInfo from "./PlayerInfo";
import "../../styles/Lobby.css"
import socket from "../../API/socket";
import {useLocation, useNavigate} from "react-router-dom";
import CheckerService from "../../API/CheckerService";
interface RoomsProps {
    firstPlayer: string;
    secondPlayer: string;
    lobbyId: number;
}

const LobbyInfo: React.FC<RoomsProps> = ({ firstPlayer, secondPlayer, lobbyId }) => {
    const [isReady,setIsReady] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if ((firstPlayer !== "no player") && (secondPlayer !== "no player")) {
            setIsReady(true);
        }
        socket.connect();

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
            <PlayerInfo name={firstPlayer}/>
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
            <PlayerInfo name={secondPlayer}/>
        </div>
    );
};

export default LobbyInfo;