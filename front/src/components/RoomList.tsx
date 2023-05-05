import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu";
import Rooms from "./RoomList/Rooms";
import {useNavigate, useParams} from "react-router-dom";
import RoomService from "../API/RoomService";
import "../styles/Rooms.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons';
import {match} from "assert";
import {ModalProvider} from "./Modal/ModalContext";

interface GameProps {
    gameName: string;
}
const RoomList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [rooms,setRooms] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    let { gameName } : any = useParams<Record<keyof GameProps, string>>();
    let gameHeader: string = gameName.toUpperCase();

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        getRoomsFromServer();
    }, [currentPage]);

    const renderPagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <li key={i} onClick={() => handlePageChange(i)}>
                    {i}
                </li>
            );
        }
        return <ul className="pagination">{pageNumbers}</ul>;
    };

    async function getRoomsFromServer() {
        try {
            const response = await RoomService.getRooms(gameName.toLowerCase(), currentPage);
            const data = await response.data;
            console.log(data);
            if (data) {
                setRooms(data.transformedRooms);
                setTotalPages(data.totalPages);
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
        <ModalProvider>
        <div className="room-page">
            <SideMenu/>
            <div className="room-list-container-wrapper">
                <span className="game-header">{gameHeader}</span>

                <div className="room-list-container">
                    <div className="room-controls">
                        <div className="play-button"
                        onClick={() => {RoomService.createRoom(gameHeader).then(() => {getRoomsFromServer()})}}
                        >CREATE ROOM</div>
                        <div
                            className="refresh-icon-container"
                            onClick={() => getRoomsFromServer()}
                        >
                        <FontAwesomeIcon className="refresh-icon" icon={faArrowsRotate} size="xl" style={{color: "#ffffff",}}/>
                        </div>
                    </div>
                    <div
                        className="room-container"
                        style={{border: "1px solid lightsalmon"}}
                    >
                        <div className="room-list-section">ID</div>
                        <div className="room-list-section">Player 1</div>
                        <div className="room-list-section">Player 2</div>
                        <div className="room-list-section">Total</div>
                        <div className="room-list-section"> </div>
                    </div>
                    {rooms.map((room:any) => (
                        <Rooms
                            key={room._id}
                            firstPlayer={room.firstPlayer ? room.firstPlayer : "no player"}
                            secondPlayer={room.secondPlayer ? room.secondPlayer : "no player"}
                            id={room._id} />
                    ))}
                </div>
                {renderPagination()}
            </div>
        </div>
        </ModalProvider>
    );
};

export default RoomList;