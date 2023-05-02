import React, { useState } from 'react';
import '../../styles/Auth.css';
import AuthService from "../../API/AuthService";
import {useModal} from "../Modal/ModalContext";
import { useNavigate } from 'react-router-dom';
import {useAuth} from "./AuthContext";

interface LoginFormProps {
    setLogin: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLogin })=> {
    const { login } = useAuth();
    const { showModal, closeModal } = useModal();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password: string) => {
        return password.length > 7;
    };

    const logIn = async () => {
        try {
            const res = await AuthService.login(formData)
            const data = await res.data;
            showModal(data.message);
            login();
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error){
            showModal("Ошибка авторизации! Проверьте введенные данные.");
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (validatePassword(formData.password)) {
            logIn();
            setError('');
        } else {
            setError('Пароль должен быть длиннее 7 символов');
        }
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="form-button-container">
            <span className="authPartSpan">Login</span>
            <form className="form-container" onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    type="text"
                    name="username"
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button className="submit-button" type="submit">
                    Войти
                </button>
            </form>
            {error && <div className="error-message">{error}</div>}
            <div className="backButton"
                onClick={() => setLogin(false)}
            >
                Register
            </div>
        </div>
    );
};

export default LoginForm;