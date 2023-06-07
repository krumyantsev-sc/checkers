import React, {useState, useEffect} from "react";
import ProfileService from "../../API/ProfileService";
import ProfileGame from "./ProfileGame";
import "../../styles/Profile.css"
import IProfileGame from "./interfaces/IProfileGame";

const History: React.FC = () => {
    const [games, setGames] = useState<IProfileGame[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        ProfileService.getHistory(currentPage)
            .then((response) => {
                setGames(response.data.games);
                setTotalPages(response.data.totalPages)
            });
    }, [currentPage]);

    return (
        <div
            className="profile-room-list-container">
            <h1>История игр</h1>
            <div
                className="profile-room-container"
                style={{border: "none"}}>
                <div
                    className="profile-roomId">
                    ID
                </div>
                <div
                    className="profile-gameName">
                    Игра
                </div>
                <div
                    className="profile-firstPlayer">
                    Первый игрок
                </div>
                <div
                    className="profile-secondPlayer">
                    Второй игрок
                </div>
                <div
                    className="profile-startedAt">
                    Создана в
                </div>
                <div
                    className="profile-duration">
                    Длительность
                </div>
            </div>
            {games.map((game) => (
                <ProfileGame
                    key={game._id}
                    firstPlayer={game.firstPlayer}
                    secondPlayer={game.secondPlayer}
                    _id={game._id}
                    winner={game.winner}
                    game={game.game}
                    duration={game.duration}
                    createdAt={game.createdAt}/>
            ))}
            <div>
                {Array.from({length: totalPages}, (_, index) => (
                    <button
                    style={{marginRight:4, textAlign: "center"}}
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default History;