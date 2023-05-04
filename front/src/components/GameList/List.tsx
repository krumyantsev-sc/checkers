import React, {useState} from 'react';
import Game from "./Game";
import "../../styles/GameList.css"
import {useAuth} from "../auth/AuthContext";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GameModal from "./GameModal";
import AddGameModal from "./AddGameModal";

interface Game {
    _id: number;
    name: string;
    logo: string;
    description: string;
}

interface ListProps {
    games: Game[];
    getGames: () => {};
}

const List = ({games, getGames}: ListProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleClose = () => {
        setModalOpen(false);
    };
    const {isAdmin} = useAuth();
    return (
        <div className="list-container-wrapper">
            <AddGameModal open={modalOpen} onClose={handleClose} getGames={getGames}/>
            <div className="games-header-wrapper">
                <span className="available-games">AVAILABLE GAMES</span>
                {isAdmin && <div
                    className="add-game-button"
                    onClick={() => setModalOpen(true)}
                ><FontAwesomeIcon icon={faCirclePlus} size="xl" style={{color: "#ffffff", fontSize: "30px"}}/></div>}
            </div>
            <div className="list-container">
                {games.map((game) => (
                    <Game key={game._id} getGames={getGames} id={game._id} name={game.name} logo={game.logo} description={game.description} />
                ))}
            </div>
        </div>
    );
};

export default List;