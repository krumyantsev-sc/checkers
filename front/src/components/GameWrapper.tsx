import {useParams} from 'react-router-dom';
import Game from './Game/Game';
import TicTacToeGame from './tic-tac-toe/TicTacToeGame';
import React from 'react';

const GameWrapper = () => {
    const {gameName} = useParams();
    if (gameName === 'checkers') {
        return <Game/>;
    } else if (gameName === 'tic-tac-toe') {
        return <TicTacToeGame/>;
    } else {
        return <div>Game not found</div>;
    }
};

export default GameWrapper;