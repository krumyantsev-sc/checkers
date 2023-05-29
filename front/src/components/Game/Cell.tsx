import React from 'react';
import "../../styles/Board.css"
import Checker from "./Checker";
import {checker, checkerCoords} from "./types/checkersTypes";

interface cellProps {
    color: string;
    checker: checker | null;
    coords: checkerCoords;
    moveChecker: (to: checkerCoords) => void;
    setInitPos: (position: checkerCoords) => void;
    setHighlightedPos?: (positionArr: checkerCoords[]) => void;
    moveColor?: string;
}

const Cell: React.FC<cellProps> =
    ({
         color,
         checker,
         coords,
         moveChecker,
         setInitPos,
         setHighlightedPos,
         moveColor,
     }) => {

        const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            moveChecker(coords);
            if (setHighlightedPos) {
                setHighlightedPos([]);
            }
        }
        const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
        }
        return (
            <div
                className={color}
                onDrop={onDrop}
                onDragOver={onDragOver}>
                {checker &&
                <Checker
                    checkerColor={checker.color}
                    isLady={checker.isLady}
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