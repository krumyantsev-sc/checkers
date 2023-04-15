import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu";
import {useNavigate, useParams} from "react-router-dom";
import RoomService from "../API/RoomService";
import LobbyService from "../API/LobbyService";
import LobbyInfo from "./Lobby/LobbyInfo";
import "../styles/Lobby.css"
import socket from "../API/socket"

interface GameProps {
    gameName: string;
}

interface RoomProps {
    lobbyId: string;
}

const Lobby = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [roomInfo,setRoomInfo] = useState<any>([]);
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
            setRoomInfo(data);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <SideMenu/>
            <div className="lobby-page">
                <div className="game-room-info-container">
                    <span className="game-header">{gameHeader}</span>
                    <LobbyInfo
                        key={roomInfo.roomId}
                        lobbyId={roomInfo.roomId}
                        firstPlayer={roomInfo.firstPlayer}
                        secondPlayer={roomInfo.secondPlayer}/>
                </div>
            </div>
        </div>
    );
};

export default Lobby;