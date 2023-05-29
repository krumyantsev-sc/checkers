import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../auth/AuthContext";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GameModal from "./GameModal";

interface IGame {
    id: number;
    name: string;
    description: string;
    logo: string;
    getGames: () => {};
}

const Game: React.FC<IGame> = ({
                                   getGames,
                                   id,
                                   name,
                                   description,
                                   logo
                               }) => {
    const {isAdmin} = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    const handleClose = () => {
        setModalOpen(false);
    };

    const navigate = useNavigate();
    return (
        <div className="card">
            <GameModal
                open={modalOpen}
                onClose={handleClose}
                id={id}
                getGames={getGames}
                initialGameName={name}
                initialGameDescription={description}
                initialGameImage={logo}
            />
            <div
                className="game-name">
                {name}
            </div>
            <div
                className="game-image">
                <img
                    src={`http://localhost:3001/static/games/${logo}`}
                    alt="logo"
                />
            </div>
            <div
                className="game-description">
                {description}
            </div>
            <div
                className="play-button-wrapper">
                <div
                    className="play-button"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/games/${name.toLowerCase()}`)
                    }}
                >PLAY
                </div>
                {isAdmin && <div
                    className="game-edit-button"
                    onClick={() => setModalOpen(true)}
                >
                    <FontAwesomeIcon
                        icon={faGear}
                        size="xl"
                        style={{color: "#ffffff",}}
                    />
                </div>}
            </div>
        </div>
    );
};

export default Game;