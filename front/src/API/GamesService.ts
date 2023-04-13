import axios from "axios";

export default class GamesService {
    static getGames = async () => {
        const response = await axios.get('http://localhost:3001/games/getGames', {withCredentials: true});
        return response;
    };
}