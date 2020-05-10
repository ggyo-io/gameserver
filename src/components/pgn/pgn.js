import React from "react";
import "./pgn.scss"

export function PGN(props) {

    const style = {
        // color: '#af8a69'
        color: '#eddab9'
    };
    const mvstrs = ['1.e4', '1.Rf1', '2.d4', '2.e4', '3.Rf1', '3.d4', '4.d4','4.e4'];
    const moves = mvstrs.map((move, index) => {
        let active = '';
        if (index === mvstrs.length - 1)
            active = ' active';

        return (
            <li key={index} className={"pgn-item page-item" + active}><a style={style}  className="page-link" role="button" href="#">{move}</a></li>
        )
    })

    return (
        <ul className="pagination" name="PGN">
            <li className="page-item"><a style={style} className="page-link" role="button" href="#"><span
                aria-hidden="true">«</span><span className="sr-only">First</span></a></li>
            <li className="page-item"><a style={style} className="page-link" role="button" href="#"><span
                aria-hidden="true">‹</span><span className="sr-only">Previous</span></a></li>
            {moves}
            <li className="page-item"><a style={style} className="page-link" role="button" href="#"><span
                aria-hidden="true">›</span><span className="sr-only">Next</span></a></li>
            <li className="page-item"><a style={style} className="page-link" role="button" href="#"><span
                aria-hidden="true">»</span><span className="sr-only">Last</span></a></li>
        </ul>
    )
}