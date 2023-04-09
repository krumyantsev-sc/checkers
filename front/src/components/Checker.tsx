import React from 'react';
import "../styles/Board.css"
import whiteCheckerImg from "../assets/img/Pawn.png"
import blackCheckerImg from "../assets/img/PawnBlack.png"
import {Simulate} from "react-dom/test-utils";
import dragOver = Simulate.dragOver;


const Checker = (props: any) => {
    return (
        <div className={props.checkerColor === "Black" ? "black-checker" : "white-checker"}>
            <img src={props.checkerColor === "Black" ? blackCheckerImg : whiteCheckerImg} alt="checker"/>
        </div>
    );
};

export default Checker;