import React, {useState} from 'react';
import "../../styles/Profile.css"
import {useModal} from "../Modal/ModalContext";
import ProfileService from "../../API/ProfileService";
import IUserInfo from "./interfaces/IUserInfo";

interface Props {
    userInfo: IUserInfo;
    userAvatarLink: string;

    updateInfo(): Promise<void>;
}

const EditProfile: React.FC<Props> = (
    {
        userInfo,
        userAvatarLink,
        updateInfo
    }) => {

    const {showModal} = useModal();
    const [email, setEmail] = useState<string>(userInfo.email);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>(userInfo.firstName);
    const [lastName, setLastName] = useState<string>(userInfo.lastName);
    const [avatar, setAvatar] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showModal('Пароль не совпадает!');
            return;
        }
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        if (avatar) {
            formData.append('avatar', avatar);
        }
        ProfileService.updateProfile(formData)
            .then((response) => {
                if (response.data.status === "success") {
                    showModal(response.data.message);
                    updateInfo();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div
            className="profile-edit-form">
            <form
                onSubmit={handleSubmit}>
                <label>
                    E-mail:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                <label>
                    Подтверждение пароля:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                <label>
                    Имя:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        pattern="^[a-zA-Z]+$"
                        required
                    />
                </label>
                <label>
                    Фамилия:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        pattern="^[a-zA-Z]+$"
                        required
                    />
                </label>
                <label>
                    Аватар:
                    <input
                        type="file"
                        accept="image/*"
                        name="avatar"
                        onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                    />
                </label>
                <img
                    className='edit-avatar'
                    src={userAvatarLink}
                    alt="avatar"
                />
                <button
                    className='submit-button'
                    type="submit">
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default EditProfile;