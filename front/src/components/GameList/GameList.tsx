import React, {useEffect, useState} from 'react';
import SideMenu from "../SideMenu";
import List from "./List";
import GamesService from "../../API/GamesService";
import {useNavigate} from "react-router-dom";
import Loading from "../Loading";
import Game from "./interfaces/IGame";

const GameList = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [games, setGames] = useState<Game[]>([]);
    const navigate = useNavigate();

    async function getGamesFromServer() {
        try {
            const response = await GamesService.getGames();
            const data = await response.data;
            if (data) {
                setGames(data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Ошибка при получении игр:', error);
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getGamesFromServer();
    }, []);

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <div>
            <SideMenu/>
            <List
                games={games}
                getGames={getGamesFromServer}
            />
        </div>
    );
};

export default GameList;