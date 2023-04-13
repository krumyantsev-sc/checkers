import React from 'react';
import "../styles/SideMenu.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faChessBoard, faUser, faAddressBook, faQuestion, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const SideMenu = () => {
    return (
        <div className="sidenav">
            <div className="nav-container">
                <a href="#"><FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#ffffff",}}/></a>
                <a href="#"><FontAwesomeIcon icon={faChessBoard} size="xl" style={{color: "#ffffff",}}/></a>
                <a href="#"><FontAwesomeIcon icon={faUser} size="xl" style={{color: "#ffffff",}}/></a>
                <a href="#"><FontAwesomeIcon icon={faAddressBook} size="xl" style={{color: "#ffffff",}}/></a>
                <a href="#"><FontAwesomeIcon icon={faQuestion} size="xl" style={{color: "#ffffff",}}/></a>
            </div>
            <div className="logout-container">
                <div className="logout"><FontAwesomeIcon icon={faRightFromBracket} size="xl" style={{color: "#ffffff",}}/></div>
            </div>
        </div>
    );
};

export default SideMenu;