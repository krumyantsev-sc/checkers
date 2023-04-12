import React, {useState} from 'react';
import checkersBoardImg from "../assets/img/checkers.png"
import "../styles/Auth.css"
import LoginForm from "./auth/LoginForm";
import RegForm from "./auth/RegForm";
import { ModalProvider } from './Modal/ModalContext';
const Login = () => {
    const [login,setLogin] = useState(true);
    return (
        <ModalProvider>
              <div className="page">
                  <img src={checkersBoardImg} className="auth-image" alt=""/>
                    <div className="auth-page--container">
                        <div className="login-container">
                            {login ? <LoginForm setLogin={setLogin}/> : <RegForm setLogin={setLogin}/>}
                        </div>
                    </div>
              </div>
        </ModalProvider>
    );
};

export default Login;