import React  from "react";

function arrowsStyle(width, squareSize, boardPadding) {
    const height = ( squareSize * 8 ) + (boardPadding * 2);
    return {
        width: width ? width: undefined,
        height: height ? height : undefined,
        transform: height ? 'translate(0, -' + height +'px)' : undefined,
        pointerEvents: 'none',
    };
}

/* http://thenewcode.com/1068/Making-Arrows-in-SVG */
function Arrows(props) {
    const { width, squareSize, boardPadding, arrows, orientation } = props;

    // square coordinates
    // (0,0)  left - top square
    // (7,7)  right - bottom square
    const c = (s) => (
        orientation === 'white' ? {
            x: s.charCodeAt(0) - 'a'.charCodeAt(0),
            y: 7 - s.charCodeAt(1) + '1'.charCodeAt(0),
        } : {
            x: 7 - s.charCodeAt(0) + 'a'.charCodeAt(0),
            y: s.charCodeAt(1) - '1'.charCodeAt(0),
        }
    );

    // square coordinate to pixel one
    const t = (x) => boardPadding + x * squareSize + ( squareSize / 2 );

    // unique colors
    const colors = arrows.map(a => a.c).filter((v, i, a) => a.indexOf(v) === i);

    // Examples:
    // orientation: white A8 -> H1 in navy color
    // { x1: 0, y1: 0, x2: 7, y2: 7, c: 'navy' },
    // orientation: white B1 -> C3 in olive color
    // { x1: 1, y1: 7, x2: 2, y2: 5, c: 'olive' },
    const lines = arrows.map( a => {
        const xy1 = c(a.s);
        const xy2 = c(a.e);
        return {
            x1: xy1.x,
            y1: xy1.y,
            x2: xy2.x,
            y2: xy2.y,
            c: a.c,
        };

    })

    return (
        <svg style={arrowsStyle(width, squareSize, boardPadding)}>
            <defs>
            {
            colors.map(c =>
                <marker id={"arrowhead" + c}
                    key={"arrowhead" + c}
                    markerWidth="5" markerHeight="7"
                    refX="5" refY="3.5" orient="auto">
                    <polygon
                        points="0 0, 5 3.5, 0 7"
                        fill={c}
                    />
                </marker>
            )
            }
            </defs>
            {(squareSize) ?
                lines.map( (a, i) =>
                <line
                    key={"arrow" + i}
                    x1={t(a.x1)} y1={t(a.y1)}
                    x2={t(a.x2)} y2={t(a.y2)}
                    stroke={a.c}
                    strokeWidth={squareSize / 8}
                    markerEnd={"url(#arrowhead" + a.c +")"}
                />) : null
            }
        </svg>
    );
}

export default Arrows;
