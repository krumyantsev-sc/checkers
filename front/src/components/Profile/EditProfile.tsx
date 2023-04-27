import React, { useState } from 'react';
import "../../styles/Profile.css"
import {useModal} from "../Modal/ModalContext";
import ProfileService from "../../API/ProfileService";

interface Props {
    userInfo: {
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        wins: number,
        loses: number
    }
    userAvatarLink: string;
}

const EditProfile: React.FC<Props> = ({userInfo, userAvatarLink}) => {
    const {showModal, closeModal} = useModal();
    const [username, setUsername] = useState(userInfo.username);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState(userInfo.firstName);
    const [lastName, setLastName] = useState(userInfo.lastName);
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
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="profile-edit-form">
            <form onSubmit={handleSubmit}>
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
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        required
                    />
                </label>
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        pattern="^[a-zA-Z]+$"
                        required
                    />
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        pattern="^[a-zA-Z]+$"
                        required
                    />
                </label>
                <label>
                    Avatar:
                    <input
                        type="file"
                        accept="image/*"
                        name="avatar"
                        onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
                    />
                </label>
                <img className='edit-avatar' src={userAvatarLink} alt="avatar"/>
                <button className='submit-button' type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditProfile;