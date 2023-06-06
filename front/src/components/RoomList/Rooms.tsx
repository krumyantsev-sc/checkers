import React from 'react';
import RoomService from "../../API/RoomService";
import {useLocation, useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import {useModal} from "../Modal/ModalContext";

interface RoomsProps {
    firstPlayer: string;
    secondPlayer: string;
    id: number;
}

const Rooms: React.FC<RoomsProps> = ({firstPlayer, secondPlayer, id}) => {
    const {showModal} = useModal();
    const getNumberOfPlayers = () => {
        let counter = 0;
        if (firstPlayer !== "no player") {
            counter++;
        }
        if (secondPlayer !== "no player") {
            counter++;
        }
        return counter + "/2";
    }
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            className="room-container">
            <div
                className="roomId">
                {id}
            </div>
            <div
                className="firstPlayer">
                {firstPlayer}
            </div>
            <div
                className="secondPlayer">
                {secondPlayer}
            </div>
            <div
                className="total">
                {getNumberOfPlayers()}
            </div>
            <div
                className="connect-button-wrapper">
                <div
                    className="play-button"
                    onClick={() => {
                        RoomService.connectToRoom(id).then(() => navigate(`${location.pathname}/${id}`))
                            .catch((error) => {
                                showModal(error.response.data.message);
                                if (error.response.data.roomId) {
                                    setTimeout(() => {
                                        navigate(`${location.pathname}/${error.response.data.roomId}`)
                                    }, 1000);
                                }
                            })
                    }}
                >ПРИСОЕДИНИТЬСЯ
                </div>
            </div>
        </div>
    );
};

export default Rooms;