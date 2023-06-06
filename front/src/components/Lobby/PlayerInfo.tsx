import React from 'react';
import avatarImg from "../../assets/img/profile-avatar.svg"
import "../../styles/Lobby.css"
import {Avatar} from "@mui/material";

interface PlayerProps {
    username: string,
    firstName: string,
    lastName: string,
    statistics: { wins: number, loses: number },
    avatar: string
}

const PlayerInfo: React.FC<PlayerProps> = ({
                                               username,
                                               firstName,
                                               lastName,
                                               statistics,
                                               avatar
                                           }) => {
    return (
        <div
            className="player-card">
            <span
                className="name-span">
                {username}
            </span>
            <span
                className="credentials-span">
                {(firstName && lastName) && firstName + " " + lastName}
            </span>
            <Avatar
                sx={{width: 250, height: 250, objectFit: 'cover', borderRadius: '50%', border: "1px solid lightsalmon"}}
                alt="Avatar"
                src={avatar ? `http://localhost:3001/static/avatar/${avatar}` : avatarImg}/>
            <div
                className="lobby-stats">
                {statistics && ("Побед: " + statistics.wins + " Поражений: " + statistics.loses)}
            </div>
        </div>
    );
};

export default PlayerInfo;