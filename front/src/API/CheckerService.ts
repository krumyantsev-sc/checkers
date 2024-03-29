import axios from "axios";


export default class CheckerService {
    static async getBoardFromServer(gameId: string) {
        const res = await axios.get(`http://localhost:3001/checkers/${gameId}/getBoard`, {withCredentials: true});
        return res;
    }

    static async getPositionsForHighlighting(gameId: string, data: any) {
        const res = await axios.post(`http://localhost:3001/checkers/${gameId}/getPossiblePositions`,data, {withCredentials: true});
        return res;
    }

    static async initializeGame(gameId: string, withBot: boolean) {
        const res = await axios.get(`http://localhost:3001/checkers/${gameId}/initialize`, {params: {withBot: withBot}, withCredentials: true});
        return res;
    }

    static async getGameInfo(gameId: string) {
        const res = await axios.get(`http://localhost:3001/checkers/${gameId}/getGameInfo`, {withCredentials: true});
        return res;
    }

    static async moveChecker(gameId: string, data: any) {
        const res = await axios.post(`http://localhost:3001/checkers/${gameId}/updateBoard`, data,{withCredentials: true});
        return res;
    }

    static async getMoveStatus(gameId: string) {
        const res = await axios.get(`http://localhost:3001/checkers/${gameId}/getMoveStatusInfo`, {withCredentials: true});
        return res;
    }

    static async finishGameByDisconnect(gameId: string) {
        const res = await axios.get(`http://localhost:3001/checkers/${gameId}/finishGameOnTimedOut`, {withCredentials: true});
        return res;
    }
}