import React from 'react';
import "../../styles/Board.css"
import whiteCheckerImg from "../../assets/img/Pawn.png"
import blackCheckerImg from "../../assets/img/PawnBlack.png"
import whiteQueenImg from "../../assets/img/WhiteQueen.png"
import blackQueenImg from "../../assets/img/BlackQueen.png"
import CheckerService from "../../API/CheckerService";
import {useParams} from "react-router-dom";

interface GameProps {
    gameId: string;
}

const Checker = (props: any) => {
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();
    const onDragStart = (event: any) => {
        if (props.checkerColor === props.moveColor) {
            props.setInitPos(props.coords)
            const setHighLightedPositions = async () => {
                CheckerService.getPositionsForHighlighting(gameId, props.coords).then((res) => {
                    props.setHighlightedPos(res.data);
                });
            }
            setHighLightedPositions().then()
        }
        event.dataTransfer.setData("text/plain", "");
    }

    const onDragOver = (event: any) => {
        event.preventDefault();
    }

    const onDrop = (event: any) => {
        console.log('drop')
        event.preventDefault();
        props.moveChecker(props.coords);
    }

    return (
        <div
            className={props.checkerColor === "Black" ? "black-checker" : "white-checker"}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            draggable={false}>
            <img src={props.checkerColor === "Black" ? (props.isLady ? blackQueenImg : blackCheckerImg) :
                (props.isLady ? whiteQueenImg : whiteCheckerImg)} alt="checker"/>
        </div>
    );
};

export default Checker;