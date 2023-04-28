import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu";
import Rooms from "./RoomList/Rooms";
import {useNavigate, useParams} from "react-router-dom";
import RoomService from "../API/RoomService";
import "../styles/Rooms.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons';
import {match} from "assert";

interface GameProps {
    gameName: string;
}
const RoomList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [rooms,setRooms] = useState([]);
    const navigate = useNavigate();
    let { gameName } : any = useParams<Record<keyof GameProps, string>>();
    let gameHeader: string = gameName.toUpperCase();
    async function getRoomsFromServer() {
        try {
            const response = await RoomService.getRooms();
            const data = await response.data;
            console.log(data);
            if (data) {
                setRooms(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Ошибка при получении комнат:', error);
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getRoomsFromServer();
    }, []);

    return (
        <div className="room-page">
            <SideMenu/>
            <div className="room-list-container-wrapper">
                <span className="game-header">{gameHeader}</span>

                <div className="room-list-container">
                    <div className="room-controls">
                        <div className="add-room-button"
                        onClick={() => {RoomService.createRoom(gameHeader)}}
                        >CREATE ROOM</div>
                        <div
                            className="refresh-icon-container"
                            onClick={() => getRoomsFromServer()}
                        >
                        <FontAwesomeIcon className="refresh-icon" icon={faArrowsRotate} size="xl" style={{color: "#ffffff",}}/>
                        </div>
                    </div>
                    {rooms.map((room:any) => (
                        <Rooms
                            key={room._id}
                            firstPlayer={room.firstPlayer ? room.firstPlayer : "no player"}
                            secondPlayer={room.secondPlayer ? room.secondPlayer : "no player"}
                            id={room._id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomList;