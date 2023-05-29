import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Input,
    FormControl
} from "@mui/material";
import GamesService from "../../API/GamesService";

interface Props {
    open: boolean;
    onClose: () => void;
    getGames: () => {};
}

const AddGameModal: React.FC<Props> = ({getGames, open, onClose}) => {
    const [gameName, setGameName] = useState<string>("");
    const [gameDescription, setGameDescription] = useState<string>("");
    const [gameImage, setGameImage] = useState<File | null>(null);

    const [isGameNameValid, setIsGameNameValid] = useState<boolean>(true);
    const [isGameDescriptionValid, setIsGameDescriptionValid] = useState<boolean>(true);
    const [isGameImageValid, setIsGameImageValid] = useState<boolean>(true);

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
        formData.append('name', gameName);
        formData.append('description', gameDescription);
        if (gameImage) {
            formData.append('logo', gameImage);
        }
        GamesService.createGame(formData)
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

    const isFormValid = isGameNameValid && isGameDescriptionValid && isGameImageValid;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title">
            <DialogTitle
                id="form-dialog-title">
                Добавить игру
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Пожалуйста, заполните информацию о игре.
                </DialogContentText>
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
                <FormControl
                    fullWidth margin="dense">
                    <Input
                        id="image-upload"
                        type="file"
                        onChange={handleImageChange}
                        error={!isGameImageValid}
                    />
                    {!isGameImageValid &&
                    <p
                        style={{color: 'red'}}>
                        Выберите изображение игры.
                    </p>}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary">
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={!isFormValid}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddGameModal;