import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Input, InputLabel, FormControl } from "@mui/material";
import ProfileService from "../../API/ProfileService";
import GamesService from "../../API/GamesService";

interface Props {
    open: boolean;
    onClose: () => void;
    id: number;
    initialGameName: string;
    initialGameDescription: string;
    initialGameImage: string;
    getGames: () => {};
}

const GameModal: React.FC<Props> = ({getGames, open, onClose, initialGameName, initialGameDescription, initialGameImage, id }) => {
    const [gameName, setGameName] = useState(initialGameName);
    const [gameDescription, setGameDescription] = useState(initialGameDescription);
    const [gameImage, setGameImage] = useState<File | null>(null);

    const [isGameNameValid, setIsGameNameValid] = useState(true);
    const [isGameDescriptionValid, setIsGameDescriptionValid] = useState(true);
    const [isGameImageValid, setIsGameImageValid] = useState(true);

    useEffect(() => {
        setIsGameNameValid(!!initialGameName);
        setIsGameDescriptionValid(!!initialGameDescription);
        setIsGameImageValid(!!initialGameImage);
    }, [initialGameName, initialGameDescription, initialGameImage]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameName(event.target.value);
        setIsGameNameValid(!!event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameDescription(event.target.value);
        setIsGameDescriptionValid(!!event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameImage(event.target.files ? event.target.files[0] : null);
        setIsGameImageValid(!!event.target.value);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('id', id.toString());
        formData.append('name', gameName);
        formData.append('description', gameDescription);
        if (gameImage) {
            console.log("Прикреплен")
            formData.append('logo', gameImage);
        }
        GamesService.updateGame(formData)
            .then((response) => {
                if (response.data.status === "success") {
                    getGames();
                }
            })
            .catch((error) => {
                console.error(error);
            });
        onClose();
    };

    const handleDelete = () => {
        GamesService.deleteGame(id)
            .then((response) => {
                    getGames();
            })
            .catch((error) => {
                console.error(error);
            });
        onClose();
    }

    const isFormValid = isGameNameValid && isGameDescriptionValid && isGameImageValid;

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Редактировать игру</DialogTitle>
            <DialogContent>
                <DialogContentText>Пожалуйста, заполните информацию о игре.</DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Название игры"
                    type="text"
                    fullWidth
                    value={gameName}
                    onChange={handleNameChange}
                    error={!isGameNameValid}
                    helperText={!isGameNameValid ? 'Название игры не должно быть пустым.' : ''}
                />
                <TextField
                    margin="dense"
                    id="description"
                    label="Описание игры"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={gameDescription}
                    onChange={handleDescriptionChange}
                    error={!isGameDescriptionValid}
                    helperText={!isGameDescriptionValid ? 'Описание игры не должно быть пустым.' : ''}
                />
                <FormControl fullWidth margin="dense">
                    <Input id="image-upload" type="file" onChange={handleImageChange} error={!isGameImageValid} />
                    {!isGameImageValid && <p style={{ color: 'red' }}>Выберите изображение игры.</p>}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="primary">
                    Удалить
                </Button>
                <Button onClick={onClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={handleSubmit} color="primary" disabled={!isFormValid}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GameModal;