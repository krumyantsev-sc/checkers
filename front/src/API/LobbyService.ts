import axios from "axios";

export default class LobbyService {
    static getLobbyInfo = async (id: string | undefined) => {
        const response = await axios.post('http://localhost:3001/room/getLobbyInfo', {id: id}, {withCredentials: true});
        return response;
    };

}