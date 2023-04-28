import React from 'react';

interface ProfileGameProps {
    firstPlayer: string;
    secondPlayer: string;
    id: number;
    winner: string;
    gameName: string;
}

const ProfileGame: React.FC<ProfileGameProps> = ({ firstPlayer, secondPlayer, id, winner, gameName }) => {

    return (
        <div className="room-container">
            <div className="roomId">{id}</div>
            <div className="gameName">{gameName}</div>
            <div className="firstPlayer">{firstPlayer}</div>
            <div className="secondPlayer">{secondPlayer}</div>
            <div className="winner">{winner}</div>
        </div>
    );
};

export default ProfileGame;