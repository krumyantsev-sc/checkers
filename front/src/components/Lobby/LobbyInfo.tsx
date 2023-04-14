import React from 'react';
import PlayerInfo from "./PlayerInfo";
import "../../styles/Lobby.css"
interface RoomsProps {
    firstPlayer: string;
    secondPlayer: string;
    lobbyId: number;
}

const LobbyInfo: React.FC<RoomsProps> = ({ firstPlayer, secondPlayer, lobbyId }) => {
    console.log(lobbyId)
    return (
        <div className="room-info">
            <PlayerInfo name={firstPlayer}/>
            <div className="game-info">
                <span>GAME ID</span>
                <span className="gameId">{lobbyId}</span>
                <div className="play-button">PLAY</div>
            </div>
            <PlayerInfo name={secondPlayer}/>
        </div>
    );
};

export default LobbyInfo;