import React, {ChangeEvent, useState} from 'react';
import '../../styles/Auth.css';
import AuthService from "../../API/AuthService";
import {useModal} from "../Modal/ModalContext";


interface RegFormProps {
    setLogin: (value: boolean) => void;
}

const RegForm: React.FC<RegFormProps> = ({setLogin}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
    });
    const {showModal} = useModal();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const validateEmail = (email: string) => {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(email);
    };

    const validateName = (name: string) => {
        const re = /^[A-Za-z]+$/;
        return re.test(name);
    };

    const validateUsername = (username: string) => {
        const re = /^[A-Za-z0-9]+$/;
        return re.test(username);
    };

    const validatePassword = (password: string) => {
        return password.length > 7;
    };

    const validate = () => {
        const newErrors = {
            firstName: validateName(formData.firstName)
                ? ''
                : 'Имя должно содержать только английские буквы',
            lastName: validateName(formData.lastName)
                ? ''
                : 'Фамилия должна содержать только английские буквы',
            email: validateEmail(formData.email)
                ? ''
                : 'Введите корректный адрес электронной почты',
            username: validateUsername(formData.username)
                ? ''
                : 'Имя пользователя должно содержать только английские буквы и цифры',
            password: validatePassword(formData.password)
                ? ''
                : 'Пароль должен быть длиннее 7 символов',
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };
    const register = async () => {
        try {
            const res = await AuthService.register(formData)
            const data = res.data;
            showModal(data.message);
        } catch (error: any) {
            showModal(error.response.data.message)
            console.error("Ошибка регистрации")
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (validate()) {
            register();
            setErrors({
                firstName: '',
                lastName: '',
                email: '',
                username: '',
                password: '',
            });
        }
    };
    return (
        <div
            className="form-button-container">
            <span
                className="authPartSpan">
                Регистрация
            </span>
            <form
                className="form-container"
                onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    type="text"
                    name="firstName"
                    placeholder="Имя"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                {errors.firstName && (
                    <div
                        className="error-message">
                        {errors.firstName}
                    </div>
                )}
                <input
                    className="input-field"
                    type="text"
                    name="lastName"
                    placeholder="Фамилия"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                {errors.lastName && (
                    <div
                        className="error-message">
                        {errors.lastName}
                    </div>
                )}
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    placeholder="Электронная почта"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && (
                    <div
                        className="error-message">
                        {errors.email}
                    </div>
                )}
                <input
                    className="input-field"
                    type="text"
                    name="username"
                    placeholder="Имя пользователя"
                    value={formData.username}
                    onChange={handleChange}
                />
                {errors.username && (
                    <div
                        className="error-message">
                        {errors.username}
                    </div>
                )}
                <input
                    className="input-field"
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && (
                    <div
                        className="error-message">
                        {errors.password}
                    </div>
                )}
                <button
                    className="submit-button"
                    type="submit">
                    Зарегистрироваться
                </button>
            </form>
            <div
                className="backButton"
                onClick={() => setLogin(true)}>
                Войти в аккаунт
            </div>
        </div>
    );
};

export default RegForm;