import React from 'react';
import RoomService from "../../API/RoomService";
interface RoomsProps {
    firstPlayer: string;
    secondPlayer: string;
    id: number;
}

const Rooms: React.FC<RoomsProps> = ({ firstPlayer, secondPlayer, id }) => {
    return (
        <div className="room-container">
            <div className="roomId">{id}</div>
            <div className="firstPlayer">{firstPlayer}</div>
            <div className="secondPlayer">{secondPlayer}</div>
            <div
                className="connect-button"
                onClick={() => RoomService.connectToRoom(id)}
            >CONNECT</div>
        </div>
    );
};

export default Rooms;