import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu";
import "../styles/Profile.css"
import ProfileInfo from "./Profile/ProfileInfo";
import ProfileService from "../API/ProfileService";
import Loading from "./Loading";
import EditProfile from "./Profile/EditProfile";
import History from "./Profile/History";
import {ModalProvider} from "./Modal/ModalContext";

const Profile = () => {
    const [info, setInfo] = useState(true);
    const [edit, setEdit] = useState(false);
    const [history, setHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo,setUserInfo] = useState<any>();
    const [userAvatar,setUserAvatar] = useState('');
    async function getUserInfoFromServer() {
        try {
            const avatarResponse = await ProfileService.getUserAvatar();
            const avatarData = await avatarResponse.data;
            const userInfoResponse = await ProfileService.getUserInfo();
            const infoData = await userInfoResponse.data;
            if (avatarData && infoData) {
                setUserAvatar(`http://localhost:3001/static/avatar/${avatarData.avatar}`);
                setUserInfo(infoData);
                console.log(infoData)
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Ошибка при получении данных с сервера:', error);
            //window.location.reload();
            //navigate('/');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getUserInfoFromServer();
    }, []);
    if (isLoading) {
        return <Loading/>;
    }
    const infoContainerSize = {
        height: edit ? '80vh' : '55vh',
        width: history ? "55vw" : "30vw",
        marginLeft: history ? "25vw" : "35vw"
    };
    return (
        <div className="profile-page">
            <SideMenu/>
            <div className="information-container" style={infoContainerSize}>
                {info && <ProfileInfo userInfo={userInfo} userAvatar={userAvatar}/>}
                {edit && <ModalProvider> <EditProfile userInfo={userInfo} userAvatarLink={userAvatar} updateInfo={getUserInfoFromServer}/></ModalProvider>}
                {history && <History/>}
                <div className="buttons-container">
                    <div className="profile-info-button"
                    onClick={()=>{setEdit(false); setHistory(false); setInfo(true)}}
                    >Profile</div>
                    <div className="edit-profile-button"
                    onClick={()=>{setEdit(true); setHistory(false); setInfo(false)}}
                    >Edit</div>
                    <div className="history-button"
                    onClick={()=>{setEdit(false); setHistory(true); setInfo(false)}}
                    >History</div>
                </div>
            </div>
        </div>
    );
};

export default Profile;