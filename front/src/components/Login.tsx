import React, {useState} from 'react';
import checkersBoardImg from "../assets/img/checkers.png"
import "../styles/Auth.css"
import LoginForm from "./auth/LoginForm";
import RegForm from "./auth/RegForm";
const Login = () => {
    const [login,setLogin] = useState(true);
    return (
        <div className="auth-page--container">
            <div className="login-container">
                <img src={checkersBoardImg} className="auth-image" alt=""/>
                {login ? <LoginForm setLogin={setLogin}/> : <RegForm setLogin={setLogin}/>}
            </div>
        </div>
    );
};

export default Login;