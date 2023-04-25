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

}