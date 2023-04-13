import React from 'react';
import checkersBoardImg from "../../assets/img/checkers.png";

interface IGame {
    name: string;
    description: string;
    logo: string;
}

const Game: React.FC<IGame> = ({name, description, logo}) => {
    return (
        <div className="card">
            <div className="game-name">{name}</div>
            <div
                className="game-image"
                style={ {
                    backgroundImage: `url(${checkersBoardImg})`
                } }
            />
            <div className="game-description">{description}</div>
            <div className="play-button-wrapper">
                <div className="play-button">PLAY</div>
            </div>
        </div>
    );
};

export default Game;
// export {}