import React from 'react';
import {green} from "@mui/material/colors";

interface ProfileGameProps {
    firstPlayer: string;
    secondPlayer: string;
    id: number;
    winner: string;
    gameName: string;
    createdAt: Date;
    duration: number;
}

const ProfileGame: React.FC<ProfileGameProps> = ({ firstPlayer, secondPlayer, id, winner, gameName, duration, createdAt }) => {

    return (
        <div className="profile-room-container">
            <div className="profile-roomId">{id}</div>
            <div className="profile-gameName">{gameName}</div>
            <div className="profile-firstPlayer" style={firstPlayer === winner ? {color: "green"} : {color: "black"}}>{firstPlayer}</div>
            <div className="profile-secondPlayer" style={secondPlayer === winner ? {color: "green"} : {color: "black"}}>{secondPlayer}</div>
            <div className="profile-startedAt">{new Date(createdAt).toLocaleString('ru-RU', {
                timeZone: 'Europe/Moscow'
            })}</div>
            <div className="profile-duration">{duration + "m"}</div>
        </div>
    );
};

export default ProfileGame;