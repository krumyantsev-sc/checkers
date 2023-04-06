import React from 'react';
import "../styles/Board.css"
import Cell from "./Cell";

const Board = () => {
    const boardRows = [];
    let squareCount = 0;
    for (let i = 0; i < 8; i++) {
        const boardRow = [];
        for (let j = 0; j < 8; j++) {
            let cellColor = ((i + j) % 2 === 0 ? "light-cell" : "dark-cell")
            boardRow.push(<Cell color={cellColor}/>);
            squareCount++;
        }
        boardRows.push(<div className="board-row">{boardRow}</div>);
    }

    return (
        <div className="board-container">
            <div className="board">{boardRows}</div>
        </div>
    );
};

export default Board;