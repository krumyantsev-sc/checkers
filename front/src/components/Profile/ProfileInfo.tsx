import React from 'react';
import Diagram from "./Diagram";
import {Avatar} from "@mui/material";
import IUserInfo from "./interfaces/IUserInfo";

interface Props {
    userAvatar: string;
    userInfo: IUserInfo;
}

const ProfileInfo: React.FC<Props> = (
    {
        userAvatar,
        userInfo
    }) => {
    return (
        <div
            className="profile-wrapper">
            <div
                className="avatar-info-container">
                <Avatar
                    sx={{
                        width: 200,
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: "1px solid lightsalmon"
                    }}
                    alt="Avatar"
                    src={userAvatar}
                />
                <div
                    className="info-container">
                    <div
                        className="profile-username">
                        {userInfo.username}
                    </div>
                    <div
                        className="profile-name">
                        {userInfo.firstName} {userInfo.lastName}
                    </div>
                    <div
                        className="profile-email">
                        {userInfo.email}
                    </div>
                </div>
            </div>
            <div
                className="stats-container">
                <div
                    className="wins-loses-container">
                    <div
                        className="profile-wins">
                        Побед: {userInfo.wins}
                    </div>
                    <div
                        className="profile-loses">
                        Поражений: {userInfo.loses}
                    </div>
                </div>
                <Diagram
                    data={[
                        {name: 'Поражения', value: userInfo.loses},
                        {name: 'Победы', value: userInfo.wins},
                    ]}
                />
            </div>
        </div>
    );
};

export default ProfileInfo;