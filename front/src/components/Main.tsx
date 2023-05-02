import React from 'react';
import SideMenu from "./SideMenu";
import { AuthProvider } from './auth/AuthContext';


const Main = () => {
    return (
        <div>
            <SideMenu/>
        </div>
    );
};

export default Main;