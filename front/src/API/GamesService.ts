import axios from "axios";

export default class GamesService {
    static getGames = async () => {
        const response = await axios.get('http://localhost:3001/games/getGames', {withCredentials: true});
        return response;
    };
    static updateGame = async (formData: FormData) => {
        const response = await axios.post('http://localhost:3001/games/update-game', formData,{withCredentials: true, headers: {
                'Content-Type': 'multipart/form-data'
            }});
        return response;
    };
    static createGame = async (formData: FormData) => {
        const response = await axios.post('http://localhost:3001/games/create-game', formData,{withCredentials: true, headers: {
                'Content-Type': 'multipart/form-data'
            }});
        return response;
    };
    static deleteGame = async (gameId: number) => {
        const response = await axios.get(`http://localhost:3001/games/${gameId}/delete`,{withCredentials: true});
        return response;
    };
}