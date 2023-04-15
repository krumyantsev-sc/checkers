import React from 'react';
import RoomService from "../../API/RoomService";
import {useLocation, useNavigate} from "react-router-dom";
interface RoomsProps {
    firstPlayer: string;
    secondPlayer: string;
    id: number;
}

const Rooms: React.FC<RoomsProps> = ({ firstPlayer, secondPlayer, id }) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <div className="room-container">
            <div className="roomId">{id}</div>
            <div className="firstPlayer">{firstPlayer}</div>
            <div className="secondPlayer">{secondPlayer}</div>
            <div
                className="connect-button"
                onClick={() => {RoomService.connectToRoom(id).then(() => navigate(`${location.pathname}/${id}`))}}
            >CONNECT</div>
        </div>
    );
};

export default Rooms;