import React from 'react';
import Game from "./Game";
import "../../styles/GameList.css"

interface Game {
    _id: number;
    name: string;
    logo: string;
    description: string;
}

interface ListProps {
    games: Game[];
}

const List = ({games}: ListProps) => {
    return (
        <div className="list-container-wrapper">
            <span className="available-games">AVAILABLE GAMES</span>
            <div className="list-container">
                {games.map((game) => (
                    <Game key={game._id} name={game.name} logo={game.logo} description={game.description} />
                ))}
            </div>
        </div>
    );
};

export default List;