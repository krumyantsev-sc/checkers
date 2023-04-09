import React from 'react';
import "../styles/Board.css"
import Checker from "./Checker";
const Cell = ({ color, checker, coords, moveChecker, setInitPos }: any) => {
    const onDragStart = (event: any) => {
        setInitPos(coords);
        event.dataTransfer.setData("text/plain", "");
    }

    const onDragOver = (event: any) => {
        event.preventDefault();
    }

    const onDrop = (event: any) => {
        event.preventDefault();
        moveChecker(coords);
    }

    return (
        <div className={`cell ${color}`} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}>
            {checker && <Checker checkerColor={checker.color} />}
        </div>
    );
};

export default Cell;