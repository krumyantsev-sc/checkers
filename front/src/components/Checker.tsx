import React from 'react';
import "../styles/Board.css"
import whiteCheckerImg from "../assets/img/Pawn.png"
import blackCheckerImg from "../assets/img/PawnBlack.png"
import {Simulate} from "react-dom/test-utils";
import dragOver = Simulate.dragOver;


const Checker = (props: any) => {
    const onDragStart = (event: any) => {
        console.log("dragstart")
        props.setInitPos(props.coords);
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
        <div className={props.checkerColor === "Black" ? "black-checker" : "white-checker"} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} draggable={true}>
            <img src={props.checkerColor === "Black" ? blackCheckerImg : whiteCheckerImg} alt="checker"/>
        </div>
    );
};

export default Checker;