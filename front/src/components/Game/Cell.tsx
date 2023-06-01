import React, {useEffect, useState} from 'react';
import "../../styles/Board.css"
import Checker from "./Checker";
import {checker, checkerCoords, moveCoords} from "./types/checkersTypes";
import socket from "../../API/socket";

interface cellProps {
    color: string;
    checker: checker | null;
    coords: checkerCoords;
    moveChecker: (to: checkerCoords) => void;
    setInitPos: (position: checkerCoords) => void;
    setHighlightedPos?: (positionArr: checkerCoords[]) => void;
    moveColor?: string;
    highLightMove: boolean;
    setHighLightMove: (moveState: boolean) => void;
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
         highLightMove,
         setHighLightMove
     }) => {
        const [highLight, setHighlight] = useState(false);


        useEffect(() => {
            socket.connect();

            const highlightBeatPos = (data: { positions: { fromI: number, fromJ: number, toI: number, toJ: number }[] }) => {
                if (data.positions.length > 0) {
                    console.log(data.positions)
                    setHighLightMove(true);
                    for (let item of data.positions) {
                        if (item.fromI === coords.i && item.fromJ === coords.j) {
                            setHighlight(true);
                        }
                        if (item.toI === coords.i && item.toJ === coords.j) {
                            setHighlight(true);
                        }
                    }
                }
            }

            const clearHighlight = () => {
                setHighlight(false)
            }

            socket.on('stopBeatHighlight', clearHighlight);
            socket.on('giveListeners', highlightBeatPos)
            return () => {
                socket.off('giveListeners', highlightBeatPos)
                socket.off('stopBeatHighlight', clearHighlight);
                socket.disconnect();
            };
        }, []);

        const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (highLightMove) {
                if (highLight) {
                    if (event.currentTarget.children.length === 0) {
                        moveChecker(coords);
                        setHighLightMove(false);
                    }
                }
            } else {
                moveChecker(coords);
            }
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
                style={highLight ? {border: "2px dotted coral"} : {}}
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