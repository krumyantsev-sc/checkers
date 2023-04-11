import React, { useState } from 'react';
import '../../styles/Auth.css';

interface LoginFormProps {
    setLogin: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setLogin })=> {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(formData);
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
            <div className="backButton"
                onClick={() => setLogin(false)}
            >
                Register
            </div>
        </div>
    );
};

export default LoginForm;