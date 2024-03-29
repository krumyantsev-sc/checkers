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

    static logout = async () => {
        const response = await axios.get('http://localhost:3001/auth/logout', {withCredentials: true});
        return response;
    }

    static getUsers = async (currentPage: number) => {
        const response = await axios.get(`http://localhost:3001/auth/users?page=${currentPage}`, {withCredentials: true});
        return response;
    }

    static searchUsers = async (searchTerm: string) => {
        const response = await axios.get(`http://localhost:3001/auth/users/search`, {withCredentials: true, params: { searchTerm }});
        return response;
    }

    static makeAdmin = async (userId: number) => {
        const response = await axios.get(`http://localhost:3001/auth/users/${userId}/makeAdmin`, {withCredentials: true});
        return response;
    }

    static ban = async (userId: number) => {
        const response = await axios.get(`http://localhost:3001/auth/users/${userId}/ban`, {withCredentials: true});
        return response;
    }
}