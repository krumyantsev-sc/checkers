import React from 'react';
import SideMenu from "./SideMenu";
import Rooms from "./RoomList/Rooms";

const RoomList = () => {
    return (
        <div>
            <SideMenu/>
            <Rooms/>
        </div>
    );
};

export default RoomList;