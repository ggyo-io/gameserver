import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import fetchHistory from "./loader"
import {useHistory} from "react-router-dom"

const draw = <span>&frac12;-&frac12;</span>

const renderRows = (games) => {
    const history = useHistory();
    return games.map((game, index) => {
        const onClick = () => {
            history.push('/analysisboard', {game: game})
        };
        return (
            <tr key={index} onClick={onClick}>
                <td>{game.time}</td>
                <td><span className="mr-2">{game.p1}</span><span className="badge badge-light badge-pill">{game.p1Elo}</span></td>
                <td><span className="mr-2">{game.p2}</span><span className="badge badge-light badge-pill">{game.p2Elo}</span></td>
                <td>{game.result === "1/2-1/2"? draw: game.result}</td>
            </tr>
        );
    })
}

export const History = (props) => {
    const [games, setGames] = useState([])
    useEffect(()=> {
        fetchHistory("/history", setGames);
    }, [])
    const _renderRows = renderRows(games)
    return <Table style={{cursor: 'pointer'}} striped bordered hover>
        <tbody>
        {_renderRows}
        </tbody>
    </Table>
}
