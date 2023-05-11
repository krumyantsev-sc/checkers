import React from 'react';

interface TicTacToeCellProps {
    coords: {i: number, j: number};
    symbol: string;
}

const TttCell: React.FC<TicTacToeCellProps> = ({symbol,coords}) => {
    return (
        <div className="ttt-board-cell">
            {symbol}
        </div>
    );
};

export default TttCell;