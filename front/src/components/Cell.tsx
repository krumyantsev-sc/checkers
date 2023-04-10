import React from 'react';
import "../styles/Board.css"
import Checker from "./Checker";
const Cell = ({ color, checker, coords, moveChecker, setInitPos, setHighlightedPos }: any) => {

    const onDrop = (event: any) => {
        console.log('drop')
        event.preventDefault();
        moveChecker(coords);
    }
    const onDragOver = (event: any) => {
        event.preventDefault();
    }
    return (
        <div className={color} onDrop={onDrop} onDragOver={onDragOver}>
            {checker && <Checker checkerColor={checker.color} coords={coords} moveChecker={moveChecker} setInitPos={setInitPos} setHighlightedPos={setHighlightedPos} />}
        </div>
    );
};

export default Cell;