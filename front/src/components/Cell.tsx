import React from 'react';
import "../styles/Board.css"
import Checker from "./Checker";

const Cell = (props: any) => {
    console.log(props.checker);
    return (
        <div className={props.color}>
            {props.checker !== null && <Checker checkerColor={props.checker.color} isLady={props.checker.isLady}/>}
        </div>
    );
};

export default Cell;