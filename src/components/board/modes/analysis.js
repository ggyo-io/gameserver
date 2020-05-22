import React from "react";
import Chessboard from "../../ggchessboard";

export const Analysis = (props) => {
    return (
        <Chessboard
            position={position}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDrop={onDrop}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onDragOverSquare={onDragOverSquare}
            calcWidth={() => size}
            {...props}
        />

    )
}
