import React from 'react';
import "../../styles/Board.css"
import whiteCheckerImg from "../../assets/img/Pawn.png"
import blackCheckerImg from "../../assets/img/PawnBlack.png"
import whiteQueenImg from "../../assets/img/WhiteQueen.png"
import blackQueenImg from "../../assets/img/BlackQueen.png"
import CheckerService from "../../API/CheckerService";
import {useParams} from "react-router-dom";
import {checkerCoords} from "./types/checkersTypes";

interface checkerProps {
    moveColor?: string;
    checkerColor: string;
    moveChecker: (to: checkerCoords) => void;
    setInitPos: (position: checkerCoords) => void;
    setHighlightedPos?: (positionArr: checkerCoords[]) => void;
    isLady: boolean;
    coords: checkerCoords;
}

const Checker: React.FC<checkerProps> = ({
                                             setHighlightedPos,
                                             setInitPos,
                                             moveChecker,
                                             checkerColor,
                                             moveColor,
                                             coords,
                                             isLady
                                         }) => {
    const {gameId} = useParams();

    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (checkerColor === moveColor) {
            setInitPos(coords)
            const setHighLightedPositions = async () => {
                CheckerService.getPositionsForHighlighting(gameId!, coords).then((res) => {
                    if (setHighlightedPos) {
                        setHighlightedPos(res.data);
                    }
                });
            }
            setHighLightedPositions().then()
        }
        event.dataTransfer.setData("text/plain", "");
    }

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        moveChecker(coords);
    }

    return (
        <div
            className={checkerColor === "Black" ? "black-checker" : "white-checker"}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            draggable={false}>
            <img
                src={checkerColor === "Black" ? (isLady ? blackQueenImg : blackCheckerImg) :
                    (isLady ? whiteQueenImg : whiteCheckerImg)}
                alt="checker"/>
        </div>
    );
};

export default Checker;