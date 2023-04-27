import axios from "axios";

export default class AuthService {
    static register = async (data: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
    }) => {
        const response = await axios.post('http://localhost:3001/auth/registration', data);
        return response;
    };

    static login = async (data: {
        username: string;
        password: string;
    }) => {
        const response = await axios.post('http://localhost:3001/auth/login', data, {withCredentials: true});
        return response;
    };
    static check = async () => {
        const response = await axios.get('http://localhost:3001/auth/check', {withCredentials: true});
        return response;
    };
}