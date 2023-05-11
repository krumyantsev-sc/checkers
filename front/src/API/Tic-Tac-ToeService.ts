import axios from "axios";

export default class TicTacToeService {
    static async getBoardFromServer(gameId: string) {
        const res = await axios.get(`http://localhost:3001/tic-tac-toe/${gameId}/getBoard`);
        return res;
    }
    static async initializeGame(gameId: string) {
        const res = await axios.get(`http://localhost:3001/tic-tac-toe/${gameId}/initialize`, {withCredentials: true});
        return res;
    }
}