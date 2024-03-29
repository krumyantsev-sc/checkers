import axios from "axios";

export default class TicTacToeService {
    static async getBoardFromServer(gameId: string) {
        const res = await axios.get(`http://localhost:3001/tic-tac-toe/${gameId}/getBoard`, {withCredentials: true});
        return res;
    }
    static async initializeGame(gameId: string) {
        const res = await axios.get(`http://localhost:3001/tic-tac-toe/${gameId}/initialize`, {withCredentials: true});
        return res;
    }
    static async makeMove(gameId: string, coords: {i: number, j: number}) {
        const res = await axios.post(`http://localhost:3001/tic-tac-toe/${gameId}/makeMove`, coords,{withCredentials: true});
        return res;
    }
    static async getGameInfo(gameId: string) {
        const res = await axios.get(`http://localhost:3001/tic-tac-toe/${gameId}/getGameInfo`, {withCredentials: true});
        return res;
    }
    static async finishGameByDisconnect(gameId: string) {
        const res = await axios.get(`http://localhost:3001/tic-tac-toe/${gameId}/finishGameOnTimedOut`, {withCredentials: true});
        return res;
    }
}