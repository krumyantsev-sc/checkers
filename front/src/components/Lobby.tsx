import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu";
import {useNavigate, useParams} from "react-router-dom";
import RoomService from "../API/RoomService";
import LobbyService from "../API/LobbyService";
import LobbyInfo from "./Lobby/LobbyInfo";
import "../styles/Lobby.css"
import socket from "../API/socket"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import {useModal} from "./Modal/ModalContext";

interface GameProps {
    gameName: string;
}

interface RoomProps {
    lobbyId: string;
}

interface IPlayer {
    username: string,
    firstName: string,
    lastName: string,
    statistics: {wins: number, loses: number},
    avatar: string
}

interface IRoomInfo {
    roomId: number,
    firstPlayer: IPlayer,
    secondPlayer: IPlayer
}

const Lobby = () => {
    const { showModal, closeModal } = useModal();
    const [isLoading, setIsLoading] = useState(true);
    const [roomInfo,setRoomInfo] = useState<IRoomInfo>();
    const navigate = useNavigate();
    let { gameName } : any = useParams<Record<keyof GameProps, string>>();
    let { gameId } : any = useParams<Record<keyof RoomProps, string>>();
    let gameHeader: string | undefined = gameName.toUpperCase();
    async function getRoomInfoFromServer() {
        try {
            const response = await LobbyService.getLobbyInfo(gameId);
            const data = await response.data;
            console.log(data);
            if (data) {
                setRoomInfo(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Ошибка при получении информации об игре:', error);
            //navigate('/');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getRoomInfoFromServer();
    }, []);


    useEffect(() => {
        socket.connect();
        socket.on('updateLobbyData', (data) => {
            getRoomInfoFromServer();
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const leaveRoomHandler = () => {
        if (roomInfo) {
            RoomService.leaveRoom(roomInfo.roomId)
                .then(() => {navigate(`/games/${gameName.toString()}`)})
                .catch((e) => {showModal(e.response.data.message)});
        }
    }

    return (
        <div>
            <SideMenu/>
            <div className="lobby-page">
                <div className="game-room-info-container">
                    <div className="room-header-button-container">
                        <span className="game-header">{gameHeader}</span>
                        <FontAwesomeIcon
                            className="room-leave-button"
                            onClick={() => {leaveRoomHandler()}}
                            icon={faCircleXmark} size="xl" style={{color: "#49a2de",}}/>
                    </div>
                    {roomInfo && <LobbyInfo
                        key={roomInfo.roomId}
                        lobbyId={roomInfo.roomId}
                        firstPlayer={roomInfo.firstPlayer}
                        secondPlayer={roomInfo.secondPlayer}/>}
                </div>
            </div>
        </div>
    );
};

export default Lobby;