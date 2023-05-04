import axios from "axios";

export default class RoomService {
    static getRooms = async (gameName: string, currentPage: number) => {
        const response = await axios.get(`http://localhost:3001/room/getRoomList/${gameName}?page=${currentPage}`, {withCredentials: true});
        return response;
    };
    static createRoom = async (gameName: string) => {
        const response = await axios.get(`http://localhost:3001/room/createRoom/${gameName.toLowerCase()}`, {withCredentials: true});
        return response;
    };
    static connectToRoom = async (roomId: number) => {
        const response = await axios.post('http://localhost:3001/room/connect', {roomId: roomId}, {withCredentials: true});
        return response;
    };

}