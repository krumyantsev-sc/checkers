import React from 'react';
import "../styles/Board.css"

const Cell = (props: any) => {
    return (
        <div className={props.color}>
        </div>
    );
};

export default Cell;