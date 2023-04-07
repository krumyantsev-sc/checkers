import axios from "axios";


export default class CheckerService {
    static async getBoardFromServer() {
        const res = await axios.get(`http://localhost:3001/checkers/642182b8cfaecd5b80164b99/getBoard`);
        return res;
    }
}