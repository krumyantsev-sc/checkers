import React from 'react';
import "../styles/SideMenu.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faChessBoard, faUser, faAddressBook, faQuestion, faRightFromBracket, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import {useAuth} from "./auth/AuthContext";
import {Link, useNavigate} from 'react-router-dom';
import AuthService from "../API/AuthService";

const SideMenu = () => {
    const { isAuthenticated, login, logout, isAdmin, makeGuest } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="sidenav">
            <div className="nav-container">
                <Link to="/"><FontAwesomeIcon icon={faHouse} size="xl" style={{color: "#ffffff",}}/></Link>
                {isAuthenticated && <Link to="/games"><FontAwesomeIcon icon={faChessBoard} size="xl" style={{color: "#ffffff",}}/></Link>}
                {<Link to="/profile"><FontAwesomeIcon icon={faUser} size="xl" style={{color: "#ffffff",}}/></Link>}
                <Link to="#"><FontAwesomeIcon icon={faAddressBook} size="xl" style={{color: "#ffffff",}}/></Link>
                <Link to="#"><FontAwesomeIcon icon={faQuestion} size="xl" style={{color: "#ffffff",}}/></Link>
            </div>
            <div className="logout-container">
                {isAdmin && <Link to='/admin'><FontAwesomeIcon icon={faScrewdriverWrench} size="xl" style={{color: "#ffffff",}}/></Link>}
                {isAuthenticated && <div className="logout">
                    <FontAwesomeIcon
                        icon={faRightFromBracket}
                        size="xl"
                        style={{color: "#ffffff",}}
                        onClick={() => {
                            AuthService.logout().then(()=>{
                                logout();
                                makeGuest();
                                navigate("/");
                            });
                        }}
                    />
                </div>}
            </div>
        </div>
    );
};

export default SideMenu;