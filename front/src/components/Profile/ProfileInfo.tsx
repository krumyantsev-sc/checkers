import React, {useEffect, useState} from 'react';
import RoomService from "../../API/RoomService";
import ProfileService from "../../API/ProfileService";
import Loading from "../Loading";
import {eventWrapper} from "@testing-library/user-event/dist/utils";
import Diagram from "./Diagram";
interface Props {
    userAvatar: string;
    userInfo: {
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        wins: number,
        loses: number
    }
}
const ProfileInfo: React.FC<Props> = ({userAvatar,userInfo}) => {
    return (
        <div className="profile-wrapper">
            <div className="avatar-info-container">
                <img className="profile-user-avatar" src={userAvatar} alt="avatar"/>
                <div className="info-container">
                    <div className="profile-username">{userInfo.username}</div>
                    <div className="profile-name">{userInfo.firstName} {userInfo.lastName}</div>
                    <div className="profile-email">{userInfo.email}</div>
                </div>
            </div>
            <div className="stats-container">
                <div className="wins-loses-container">
                    <div className="profile-wins"> win: {userInfo.wins}</div>
                    <div className="profile-loses">lose: {userInfo.loses}</div>
                </div>
                <Diagram data={[
                    { name: 'Поражения', value: userInfo.loses },
                    { name: 'Победы', value: userInfo.wins },
                ]} />
            </div>
        </div>
    );
};

export default ProfileInfo;