import React, {useEffect, useState} from 'react';
import SideMenu from "../SideMenu";
import "../../styles/Profile.css"
import ProfileInfo from "./ProfileInfo";
import ProfileService from "../../API/ProfileService";
import Loading from "../Loading";
import EditProfile from "./EditProfile";
import History from "./History";
import {ModalProvider} from "../Modal/ModalContext";
import IUserInfo from "./interfaces/IUserInfo"

const Profile = () => {
    const [info, setInfo] = useState<boolean>(true);
    const [edit, setEdit] = useState<boolean>(false);
    const [history, setHistory] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userInfo, setUserInfo] = useState<IUserInfo | undefined>();
    const [userAvatar, setUserAvatar] = useState<string>('');

    async function getUserInfoFromServer() {
        try {
            const avatarResponse = await ProfileService.getUserAvatar();
            const avatarData = await avatarResponse.data;
            const userInfoResponse = await ProfileService.getUserInfo();
            const infoData = await userInfoResponse.data;
            if (avatarData && infoData) {
                setUserAvatar(`http://localhost:3001/static/avatar/${avatarData.avatar}`);
                setUserInfo(infoData);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Ошибка при получении данных с сервера:', error);
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
        marginTop: edit ? "2vh" : "10vh"
    };

    return (
        <div className="profile-page">
            <SideMenu/>
            <div className="profile-container">
                <div className="information-container" style={infoContainerSize}>
                    {info && userInfo &&
                    <ProfileInfo
                        userInfo={userInfo}
                        userAvatar={userAvatar}
                    />}
                    {edit && userInfo &&
                    <ModalProvider>
                        <EditProfile
                            userInfo={userInfo}
                            userAvatarLink={userAvatar}
                            updateInfo={getUserInfoFromServer}
                        />
                    </ModalProvider>}
                    {history && <History/>}
                    <div
                        className="buttons-container">
                        <div
                            className="profile-info-button"
                            onClick={() => {
                                setEdit(false);
                                setHistory(false);
                                setInfo(true)
                            }}
                        >Profile
                        </div>
                        <div
                            className="edit-profile-button"
                            onClick={() => {
                                setEdit(true);
                                setHistory(false);
                                setInfo(false)
                            }}
                        >Edit
                        </div>
                        <div
                            className="history-button"
                            onClick={() => {
                                setEdit(false);
                                setHistory(true);
                                setInfo(false)
                            }}
                        >History
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;