import axios from "axios";

export default class ProfileService {
    static getUserAvatar = async () => {
        const response = await axios.get('http://localhost:3001/profile/getAvatar', {withCredentials: true});
        return response;
    };
    static getUserInfo = async () => {
        const response = await axios.get('http://localhost:3001/profile/getProfileInfo', {withCredentials: true});
        return response;
    };
    static updateProfile = async (formData: FormData) => {
        const response = await axios.post('http://localhost:3001/profile/update-profile', formData,{withCredentials: true, headers: {
            'Content-Type': 'multipart/form-data'
        }});
        return response;
    };
    static getHistory = async (page: number) => {
        const response = await axios.get(`http://localhost:3001/profile/getHistory?page=${page}`, {withCredentials: true});
        return response;
    }
    static getProfileById = async (id: number) => {
        const response = await axios.get(`http://localhost:3001/profile/${id}`, {withCredentials: true});
        return response;
    }
}