import React from 'react';
import "../../styles/Board.css"
import Checker from "./Checker";
const Cell = ({ color, checker, coords, moveChecker, setInitPos, setHighlightedPos, moveColor }: any) => {

    const onDrop = (event: any) => {
        console.log('drop')
        event.preventDefault();
        moveChecker(coords);
        setHighlightedPos([]);
    }
    const onDragOver = (event: any) => {
        event.preventDefault();
    }
    return (
        <div className={color} onDrop={onDrop} onDragOver={onDragOver}>
            {checker && <Checker
                checkerColor={checker.color}
                isLady = {checker.isLady}
                coords={coords}
                moveChecker={moveChecker}
                setInitPos={setInitPos}
                setHighlightedPos={setHighlightedPos}
                moveColor={moveColor}
            />}
        </div>
    );
};

export default Cell;