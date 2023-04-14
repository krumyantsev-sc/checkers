import React from 'react';
import avatarImg from "../../assets/img/profile-avatar.svg"
import "../../styles/Lobby.css"

interface PlayerProps {
    name: string;
}
const PlayerInfo: React.FC<PlayerProps> = ({name}) => {
    return (
        <div className="player-card">
            <span className="name-span">{name}</span>
            <img src={avatarImg} alt="avatar"/>
        </div>
    );
};

export default PlayerInfo;