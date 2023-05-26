import React from 'react';
import IProfileGame from "./interfaces/IProfileGame";


const ProfileGame: React.FC<IProfileGame> = (
    {
        firstPlayer,
        secondPlayer,
        _id,
        winner,
        game,
        duration,
        createdAt
    }) => {

    return (
        <div
            className="profile-room-container">
            <div
                className="profile-roomId">
                {_id}
            </div>
            <div
                className="profile-gameName">
                {game}
            </div>
            <div
                className="profile-firstPlayer"
                style={firstPlayer === winner ? {color: "green"} : {color: "black"}}>
                {firstPlayer}
            </div>
            <div
                className="profile-secondPlayer"
                style={secondPlayer === winner ? {color: "green"} : {color: "black"}}>
                {secondPlayer}
            </div>
            <div
                className="profile-startedAt">
                {new Date(createdAt).toLocaleString('ru-RU', {
                    timeZone: 'Europe/Moscow'
                })}
            </div>
            <div
                className="profile-duration">
                {duration + "m"}
            </div>
        </div>
    );
};

export default ProfileGame;