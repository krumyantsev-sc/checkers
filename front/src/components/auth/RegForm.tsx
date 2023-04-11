import React, { useState } from 'react';
import '../../styles/Auth.css';

interface RegFormProps {
    setLogin: (value: boolean) => void;
}
const RegForm: React.FC<RegFormProps> = ({ setLogin })=> {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
            <span className="authPartSpan">Registration</span>
            <form className="form-container" onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    type="text"
                    name="firstName"
                    placeholder="Имя"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="text"
                    name="lastName"
                    placeholder="Фамилия"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    placeholder="Электронная почта"
                    value={formData.email}
                    onChange={handleChange}
                />
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
                    Зарегистрироваться
                </button>
            </form>
            <div className="backButton"
                 onClick={() => setLogin(true)}
            >
                Back to login
            </div>
        </div>
    );
};

export default RegForm;