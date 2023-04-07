import React from 'react';
import "../styles/Board.css"

const Checker = (props: any) => {
    return (
        <div className={props.checkerColor === "Black" ? "black-checker" : "white-checker"}>

        </div>
    );
};

export default Checker;