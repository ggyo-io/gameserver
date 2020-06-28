import React, {useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import {serverFetchHistory} from "./loader"
import {useHistory} from "react-router-dom"
import {useStoreActions} from "easy-peasy";

const draw = <span>&frac12;-&frac12;</span>

const renderRows = (games) => {
    const history = useHistory();
    const {setAnalysis} = useStoreActions(actions => actions.game)

    return games.map((game, index) => {
        const onClick = () => {
            setAnalysis(game)
            history.push('/analysisboard')
        };

        return (
            <tr key={index} onClick={onClick}>
                <td>{game.Date}</td>
                <td><span className="mr-2">{game.White}</span><span
                    className="badge badge-light badge-pill">{game.WhiteElo}</span></td>
                <td><span className="mr-2">{game.Black}</span><span
                    className="badge badge-light badge-pill">{game.BlackElo}</span></td>
                <td>{game.Result === "1/2-1/2" ? draw : game.Result}</td>
            </tr>
        );
    })
}

export const History = (props) => {
    const [games, setGames] = useState([])
    useEffect(() => {
        serverFetchHistory("/api/history", setGames);
    }, [])
    const _renderRows = renderRows(games)
    return <Table style={{cursor: 'pointer'}} striped bordered hover>
        <tbody>
        {_renderRows}
        </tbody>
    </Table>
}
