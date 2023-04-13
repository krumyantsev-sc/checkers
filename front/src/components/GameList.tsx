import React, {useEffect, useState} from 'react';
import SideMenu from "./SideMenu";
import List from "./GameList/List";
import GamesService from "../API/GamesService";
import {useNavigate} from "react-router-dom";
import Loading from "./Loading";

const GameList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [games,setGames] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        async function getGamesFromServer() {
            try {
                const response = await GamesService.getGames();
                const data = await response.data;
                console.log(data);
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
        getGamesFromServer();
    }, []);

    if (isLoading) {
        return <Loading/>;
    }
    return (
        <div>
            <SideMenu/>
            <List games={games}/>
        </div>
    );
};

export default GameList;