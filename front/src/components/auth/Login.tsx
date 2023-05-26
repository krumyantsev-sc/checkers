import React, {useState} from 'react';
import checkersBoardImg from "../../assets/img/checkers.png"
import "../../styles/Auth.css"
import LoginForm from "./LoginForm";
import RegForm from "./RegForm";
import {ModalProvider} from '../Modal/ModalContext';

const Login = () => {
    const [login, setLogin] = useState(true);
    return (
        <ModalProvider>
            <div className="page">
                <div
                    className="auth-image"
                    style={{
                        backgroundImage: `url(${checkersBoardImg})`
                    }}
                />
                <div className="auth-page--container">
                    <div className="login-container">
                        {login ?
                            <LoginForm
                                setLogin={setLogin}
                            />
                            :
                            <RegForm
                                setLogin={setLogin}
                            />
                        }
                    </div>
                </div>
            </div>
        </ModalProvider>
    );
};

export default Login;