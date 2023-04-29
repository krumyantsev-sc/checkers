import axios from "axios";

export default class ChatService {
    static sendMessage = async (roomId: string, message: string) => {
        const response = await axios.post(`http://localhost:3001/chat/${roomId}/sendMessage`, {text: message},{withCredentials: true});
        return response;
    };
    static getMessageHistory = async (roomId: string) => {
        const response = await axios.get(`http://localhost:3001/chat/${roomId}/getMessages`, {withCredentials: true});
        return response;
    }
}