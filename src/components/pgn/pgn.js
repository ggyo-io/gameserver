import React from "react";
import FontAwesome from 'react-fontawesome'
import "./pgn.scss"

export function PGN(props) {

    const mvstrs = ['1.e4', '1.Rf1', '2.d4', '2.e4', '3.Rf1', '3.d4', '4.d4','4.e4'];
    const moves = mvstrs.map((move, index) => {
        const active = index === mvstrs.length - 1 ? 'active' : '';
        return (
            <li key={index}
                className={`pgn-item page-item ${active}`}>
                <a className="page-link move-item"
                   role="button"
                   href="#">{move}
                </a>
            </li>
        )
    })

    return (
        <ul className="pagination" name="PGN">
            <li className="page-item">
                <a className="page-link move-item" role="button" href="#">
                    <span aria-hidden="true">
                        <FontAwesome name="chevron-left"/>
                    </span>
                    <span className="sr-only">First</span>
                </a>
            </li>
            <li className="page-item">
                <a className="page-link move-item" role="button" href="#">
                    <span aria-hidden="true">‹</span>
                    <span className="sr-only">Previous</span>
                </a>
            </li>
            {moves}
            <li className="page-item">
                <a className="page-link move-item" role="button" href="#">
                    <span aria-hidden="true">›</span><span className="sr-only">Next</span>
                </a>
            </li>
            <li className="page-item">
                <a className="page-link move-item" role="button" href="#">
                    <span aria-hidden="true">»</span>
                    <span className="sr-only">Last</span>
                </a>
            </li>
        </ul>
    )
}