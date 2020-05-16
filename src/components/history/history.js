import React from 'react';
import Table from "react-bootstrap/Table";

const renderRows = () => {
    const games = [
        {time: "18:30", p1: "Baum(1807)", p2: "Durak (1421)", result: "1 - 0"},
        {time: "May 1, 18:13", p1: "Durak (1419)", p2: "Durak (1421)Baum (1800)", result: "&frac12;-&frac12;"},
        {time: "May 1, 17:59", p1: "Baum(1807)", p2: "Puta(2345)", result: "0 - 1"}]

    return games.map((game, index) => (
        <tr onClick={() => window.location = '/analysisboard'}>
            <td>{game.time}</td>
            <td>{game.p1}</td>
            <td>{game.p2}</td>
            <td>{game.result}</td>
        </tr>

    ))
}

export const History = () => {
    const _renderRows = renderRows()
    return <Table style={{cursor: 'pointer'}} striped bordered hover>
        <tbody>
        {_renderRows}
        </tbody>
    </Table>
}
