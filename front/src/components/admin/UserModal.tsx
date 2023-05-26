import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import ProfileService from "../../API/ProfileService";
import {Avatar} from "@mui/material";
import "../../styles/UserList.css"

interface User {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    wins: number,
    loses: number,
    avatar: string
}

interface UserModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

function UserModal({userId, isOpen, onClose}: UserModalProps) {
    const [userData, setUserData] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && userId) {
            ProfileService.getProfileById(userId)
                .then((response) => setUserData(response.data))
                .catch((error) => setError(error.message));
        }
    }, [isOpen, userId]);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}>
            <DialogTitle>
                {`Информация о пользователе ${userId}`}
            </DialogTitle>
            <DialogContent>
                {error ? (
                    <DialogContentText>
                        Ошибка при загрузке данных пользователя: {error}
                    </DialogContentText>
                ) : userData ? (
                    <DialogContentText>
                        <div
                            className="admin-userinfo-container">
                            <Avatar sx={{width: 120, height: 120}}
                                    alt="Avatar"
                                    src={`http://localhost:3001/static/avatar/${userData.avatar}`}
                            />
                            Имя пользователя: {userData.username} <br/>
                            Электронная почта: {userData.email} <br/>
                            Имя: {userData.firstName} <br/>
                            Фамилия: {userData.lastName} <br/>
                            Побед: {userData.wins} <br/>
                            Поражений: {userData.loses} <br/>
                        </div>
                    </DialogContentText>
                ) : (
                    <DialogContentText>
                        Загрузка данных пользователя...
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserModal;