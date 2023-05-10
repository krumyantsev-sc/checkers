import React, { useState, useEffect } from "react";
import ProfileService from "../../API/ProfileService";
import ProfileGame from "./ProfileGame";
import "../../styles/Profile.css"

interface Game {
    games: object[];
    totalPages: number;
}

const History: React.FC = () => {
    const [games, setGames] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        ProfileService.getHistory(currentPage)
            .then((response) =>
            {
                console.log(response.data.games);
                setGames(response.data.games);
                setTotalPages(response.data.totalPages)
            });
    }, [currentPage]);

    return (
        <div className="profile-room-list-container">
            <h1>Game History</h1>
            <div className="profile-room-container" style={{border: "none"}}>
                <div className="profile-roomId">ID</div>
                <div className="profile-gameName">Game</div>
                <div className="profile-firstPlayer">First Player</div>
                <div className="profile-secondPlayer">Second Player</div>
                <div className="profile-startedAt">Created at</div>
                <div className="profile-duration">Duration</div>
            </div>
            {games.map((game) => (
                <ProfileGame key={game._id} firstPlayer={game.firstPlayer} secondPlayer={game.secondPlayer} id={game._id} winner={game.winner} gameName={game.game} duration={game.duration} createdAt={game.createdAt}/>
            ))}
            <div>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default History;